// GET /api/marketplace — the whole public dataset (trainers with their
// still-open slots, plus gyms/hotels/outdoor spaces) in one payload.
// The dataset is tiny (a handful of trainers/facilities), so the
// frontend fetches it once and filters/searches client-side exactly
// like it did against the old static array — only the source changed.
import { query } from '../lib/db.js';
import { withHandler, methodNotAllowed } from '../lib/util.js';

async function marketplace(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const [{ rows: trainerRows }, { rows: slotRows }, { rows: facilityRows }] = await Promise.all([
    query('select * from trainers order by rating desc, id'),
    query("select * from trainer_slots where status='open' order by created_at, id"),
    query('select * from facilities order by kind, name'),
  ]);

  const slotsByTrainer = new Map();
  for (const s of slotRows) {
    const list = slotsByTrainer.get(s.trainer_id) || [];
    list.push({ id: s.id, label: s.label });
    slotsByTrainer.set(s.trainer_id, list);
  }

  const trainers = trainerRows.map((t) => ({
    id: t.id,
    name: t.name,
    image_url: t.image_url,
    bio: t.bio,
    certifications: t.certifications,
    specialties: t.specialties,
    available_cities: t.available_cities,
    available_locations: t.available_locations,
    rating: Number(t.rating),
    review_count: t.review_count,
    slots: slotsByTrainer.get(t.id) || [],
  }));

  const facilities = facilityRows.map((f) => ({
    id: f.id,
    kind: f.kind,
    name: f.name,
    city: f.city,
    detail: f.detail,
  }));

  res.status(200).setHeader('content-type', 'application/json').send(JSON.stringify({ trainers, facilities }));
}

export default withHandler(marketplace);
