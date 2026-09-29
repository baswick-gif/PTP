// POST /api/bookings — creates a real booking: validates the selection
// against the database (trainer, slots, facility all still exist and
// actually match), prices it server-side using the trainer's own rate
// card and the gym's own membership fee (never trusting a total the
// client might send), then atomically claims every selected slot and
// inserts the booking row so two people can never book the same slot.
import { query, withTransaction } from '../lib/db.js';
import { withHandler, methodNotAllowed, sendJson, newId, stamp } from '../lib/util.js';
import { priceBooking } from '../lib/pricing.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATIONS = new Set(['Gym', 'Home', 'Hotel', 'Outdoor']);
const FACILITY_KIND_FOR_LOCATION = { Gym: 'gym', Hotel: 'hotel', Outdoor: 'outdoor' };
const MAX_SLOTS = 6;

function clean(v) {
  return typeof v === 'string' ? v.trim() : '';
}

async function bookings(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const body = req.body || {};
  const trainerId = clean(body.trainerId);
  const slotIds = Array.isArray(body.slotIds) ? [...new Set(body.slotIds.map(clean).filter(Boolean))] : [];
  const customerName = clean(body.customerName);
  const customerEmail = clean(body.customerEmail);
  const customerPhone = clean(body.customerPhone);
  const city = clean(body.city);
  const location = clean(body.location);
  const facilityId = clean(body.facilityId);
  const packageId = clean(body.packageId);

  if (!trainerId || !slotIds.length || !customerName || !customerEmail || !city || !location || !packageId) {
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
  // One Day sessions book a single slot; recurring packages (weekly/
  // monthly/yearly) need 2-6 weekly time slots — mirrors the frontend's
  // own toggleSlot/isRecurringPackage rule in BookingModal.jsx.
  const isRecurringPackage = packageId !== 'one_day';
  const minSlots = isRecurringPackage ? 2 : 1;
  const maxSlots = isRecurringPackage ? MAX_SLOTS : 1;
  if (slotIds.length < minSlots || slotIds.length > maxSlots) {
    return sendJson(res, 400, {
      error: isRecurringPackage
        ? 'Select 2-6 weekly time slots for this package.'
        : 'Select exactly one time slot for a one-day session.',
    });
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
    "select * from trainer_slots where trainer_id=$1 and id = any($2::text[]) and status='open'",
    [trainerId, slotIds]
  );
  if (slotRows.length !== slotIds.length) {
    return sendJson(res, 409, { error: 'One or more selected time slots are no longer available. Please pick again.' });
  }
  // Preserve the order the client selected them in for the confirmation message.
  const slotsById = new Map(slotRows.map((s) => [s.id, s]));
  const orderedSlots = slotIds.map((id) => slotsById.get(id));

  let facilityName;
  let facilityIdForRow = null;
  let gymMembershipFee = 0;
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
    if (location === 'Gym') gymMembershipFee = Number(facility.monthly_fee) || 0;
  }

  const monthlyRate = (trainer.monthly_rates || {})[location];
  const price = priceBooking({ location, packageId, monthlyRate, gymMembershipFee });
  if (!price) return sendJson(res, 400, { error: 'Unknown session package or trainer has no rate for this location.' });

  const bookingId = newId('bk');
  const now = stamp();

  const claimed = await withTransaction(async (client) => {
    const { rows } = await client.query(
      "update trainer_slots set status='booked' where id = any($1::text[]) and status='open' returning id",
      [slotIds]
    );
    if (rows.length !== slotIds.length) return false; // lost a race with another booking for at least one slot
    await client.query(
      `insert into bookings (
         id, trainer_id, slot_id, customer_name, customer_email, customer_phone,
         city, location, facility_id, facility_name, package_id, package_label,
         duration_months, monthly_rate, discount_amount, gym_membership_fee, total_cost,
         status, created_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'confirmed',$18)`,
      [
        bookingId, trainerId, slotIds[0], customerName, customerEmail, customerPhone || null,
        city, location, facilityIdForRow, facilityName, packageId, price.packageLabel,
        price.durationMonths, price.monthlyRate, price.discountAmount, price.gymMembershipFee, price.totalCost,
        now,
      ]
    );
    for (const slotId of slotIds) {
      await client.query('insert into booking_slots (booking_id, slot_id) values ($1,$2)', [bookingId, slotId]);
    }
    return true;
  });

  if (!claimed) {
    return sendJson(res, 409, { error: 'One or more selected time slots are no longer available. Please pick again.' });
  }

  sendJson(res, 201, {
    booking: {
      id: bookingId,
      trainerName: trainer.name,
      slotLabels: orderedSlots.map((s) => s.label),
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
