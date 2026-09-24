// POST /api/bookings — creates a real booking: validates the selection
// against the database (trainer, slot, facility all still exist and
// actually match), prices it server-side (never trusting a total the
// client might send), then atomically claims the slot and inserts the
// booking row so two people can never book the same slot.
import { query, withTransaction } from '../lib/db.js';
import { withHandler, methodNotAllowed, sendJson, newId, stamp } from '../lib/util.js';
import { priceBooking } from '../lib/pricing.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATIONS = new Set(['Gym', 'Home', 'Hotel', 'Outdoor']);
const FACILITY_KIND_FOR_LOCATION = { Gym: 'gym', Hotel: 'hotel', Outdoor: 'outdoor' };

function clean(v) {
  return typeof v === 'string' ? v.trim() : '';
}

async function bookings(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const body = req.body || {};
  const trainerId = clean(body.trainerId);
  const slotId = clean(body.slotId);
  const customerName = clean(body.customerName);
  const customerEmail = clean(body.customerEmail);
  const customerPhone = clean(body.customerPhone);
  const city = clean(body.city);
  const location = clean(body.location);
  const facilityId = clean(body.facilityId);
  const packageId = clean(body.packageId);

  if (!trainerId || !slotId || !customerName || !customerEmail || !city || !location || !packageId) {
    return sendJson(res, 400, { error: 'Missing required booking details.' });
  }
  if (!EMAIL_RE.test(customerEmail)) {
    return sendJson(res, 400, { error: 'Enter a valid email address.' });
  }
  if (!LOCATIONS.has(location)) {
    return sendJson(res, 400, { error: 'Unknown training location.' });
  }
  if (location !== 'Home' && !facilityId) {
    return sendJson(res, 400, { error: 'Select a facility for this location.' });
  }

  const { rows: trainerRows } = await query('select * from trainers where id=$1', [trainerId]);
  const trainer = trainerRows[0];
  if (!trainer) return sendJson(res, 404, { error: 'Trainer not found.' });
  if (!trainer.available_cities.includes(city)) {
    return sendJson(res, 400, { error: `${trainer.name} doesn't train in ${city}.` });
  }
  if (!trainer.available_locations.includes(location)) {
    return sendJson(res, 400, { error: `${trainer.name} doesn't offer ${location} sessions.` });
  }

  const { rows: slotRows } = await query(
    "select * from trainer_slots where id=$1 and trainer_id=$2 and status='open'",
    [slotId, trainerId]
  );
  if (!slotRows.length) {
    return sendJson(res, 409, { error: 'That time slot is no longer available. Please pick another.' });
  }
  const slot = slotRows[0];

  let facilityName;
  let facilityIdForRow = null;
  if (location === 'Home') {
    facilityName = `Your home in ${city}`;
  } else {
    const { rows: facilityRows } = await query('select * from facilities where id=$1', [facilityId]);
    const facility = facilityRows[0];
    if (!facility || facility.kind !== FACILITY_KIND_FOR_LOCATION[location] || facility.city !== city) {
      return sendJson(res, 400, { error: 'Selected facility is not available for this city/location.' });
    }
    facilityName = facility.name;
    facilityIdForRow = facility.id;
  }

  const price = priceBooking(location, packageId);
  if (!price) return sendJson(res, 400, { error: 'Unknown session package.' });

  const bookingId = newId('bk');
  const now = stamp();

  const claimed = await withTransaction(async (client) => {
    const { rows } = await client.query(
      "update trainer_slots set status='booked' where id=$1 and status='open' returning id",
      [slotId]
    );
    if (!rows.length) return false; // lost a race with another booking
    await client.query(
      `insert into bookings (
         id, trainer_id, slot_id, customer_name, customer_email, customer_phone,
         city, location, facility_id, facility_name, package_id, package_label,
         duration_months, monthly_rate, discount_amount, gym_membership_fee, total_cost,
         status, created_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'confirmed',$18)`,
      [
        bookingId, trainerId, slotId, customerName, customerEmail, customerPhone || null,
        city, location, facilityIdForRow, facilityName, packageId, price.packageLabel,
        price.durationMonths, price.monthlyRate, price.discountAmount, price.gymMembershipFee, price.totalCost,
        now,
      ]
    );
    return true;
  });

  if (!claimed) {
    return sendJson(res, 409, { error: 'That time slot is no longer available. Please pick another.' });
  }

  sendJson(res, 201, {
    booking: {
      id: bookingId,
      trainerName: trainer.name,
      slotLabel: slot.label,
      city,
      location,
      facilityName,
      packageLabel: price.packageLabel,
      totalCost: price.totalCost,
      status: 'confirmed',
    },
  });
}

export default withHandler(bookings);
