#!/usr/bin/env node
// Seeds trainers/slots/facilities from the same mock data the frontend
// used to hardcode, so switching to the real backend doesn't change
// what's on screen. Safe to re-run — every insert is ON CONFLICT DO
// NOTHING, so it never duplicates or clobbers rows a real booking may
// have since touched (e.g. a slot flipped to 'booked').
//
// Usage: DATABASE_URL=postgresql://... node db/seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getPool } from '../lib/db.js';
import { stamp } from '../lib/util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const trainers = [
  {
    id: 'pt_01',
    name: 'Alex Mercer',
    image_url: 'https://images.unsplash.com/photo-1633180543038-4e0d06c9a9d2?w=400&h=500&fit=crop&crop=faces',
    certifications: ['REPs Level 3', 'NASM Nutrition Coach'],
    specialties: ['Weight Loss', 'Functional Strength', 'HIIT'],
    bio: 'Specializing in body transformations for busy professionals. I bring elite coaching directly to your preferred environment.',
    rating: 4.9,
    review_count: 42,
    verified: true,
    available_cities: ['Male', 'Hulhumale'],
    available_locations: ['Gym', 'Home', 'Outdoor'],
    monthly_rates: { Gym: 1800, Home: 2400, Outdoor: 1600 },
    slots: ['Mon 9AM', 'Mon 5PM', 'Tue 7AM', 'Wed 6PM', 'Thu 9AM', 'Fri 9AM', 'Fri 5PM', 'Sat 10AM'],
  },
  {
    id: 'pt_02',
    name: 'Sarah Jenkins',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=faces',
    certifications: ['ACE Personal Trainer', 'Pre/Post Natal Certified'],
    specialties: ['Mobility', 'Strength Training', 'Post-Pregnancy Fitness'],
    bio: 'Helping you build a sustainable lifestyle. Flexible schedules tailored for residential visits and private hotel gym training.',
    rating: 5.0,
    review_count: 28,
    verified: true,
    available_cities: ['Male'],
    available_locations: ['Home', 'Hotel', 'Outdoor'],
    monthly_rates: { Home: 2600, Hotel: 3000, Outdoor: 2000 },
    slots: ['Mon 8AM', 'Tue 8AM', 'Tue 1PM', 'Wed 9AM', 'Thu 9AM', 'Fri 4PM', 'Sat 10AM', 'Sat 4PM'],
  },
  {
    id: 'pt_03',
    name: 'Marcus Rodriguez',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces',
    certifications: ['ISSA Certified', 'Strength & Conditioning Specialist'],
    specialties: ['Muscle Gain', 'Athletic Performance', 'Sport-Specific Training'],
    bio: 'Olympic training methodology applied to everyday athletes. Get stronger, faster, better.',
    rating: 4.8,
    review_count: 35,
    verified: true,
    available_cities: ['Hulhumale'],
    available_locations: ['Gym', 'Home'],
    monthly_rates: { Gym: 2000, Home: 2700 },
    slots: ['Mon 7AM', 'Tue 6PM', 'Wed 6PM', 'Thu 7AM', 'Fri 6PM', 'Sat 8AM'],
  },
  {
    id: 'pt_04',
    name: 'Jessica Liu',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=faces',
    certifications: ['NASM Certified', 'Yoga Instructor Certified'],
    specialties: ['Flexibility', 'Mind-Body Training', 'Wellness'],
    bio: 'Holistic fitness approach combining strength, flexibility, and mental wellness. Transform your lifestyle.',
    rating: 4.9,
    review_count: 31,
    verified: true,
    available_cities: ['Male', 'Hulhumale'],
    available_locations: ['Home', 'Outdoor', 'Hotel'],
    monthly_rates: { Home: 2200, Outdoor: 1700, Hotel: 2500 },
    slots: ['Mon 10AM', 'Tue 7AM', 'Wed 7AM', 'Thu 5PM', 'Fri 10AM', 'Sat 11AM'],
  },
];

// Each gym sets its own monthly membership fee from its own rate card.
const facilities = [
  { id: 'gym_01', kind: 'gym', name: 'Iron Haven Fitness', city: 'Male', detail: 'Male City Center', monthly_fee: 1080 },
  { id: 'gym_02', kind: 'gym', name: 'FitZone Premium', city: 'Male', detail: 'Male North District', monthly_fee: 1080 },
  { id: 'gym_03', kind: 'gym', name: 'PowerPlay Gym', city: 'Hulhumale', detail: 'Hulhumale Central', monthly_fee: 1080 },
  { id: 'gym_04', kind: 'gym', name: 'Elite Fitness Hub', city: 'Hulhumale', detail: 'Hulhumale South', monthly_fee: 1080 },
  { id: 'hotel_01', kind: 'hotel', name: 'The Maldivian Resort', city: 'Male', detail: 'Full Gym, Olympic Pool, Spa' },
  { id: 'hotel_02', kind: 'hotel', name: 'Coral Palace Hotel', city: 'Male', detail: 'Fitness Center, Facilities' },
  { id: 'hotel_03', kind: 'hotel', name: 'Ocean View Hotel', city: 'Hulhumale', detail: 'Modern Gym, Beach Access' },
  { id: 'hotel_04', kind: 'hotel', name: 'Lagoon Retreat Hotel', city: 'Hulhumale', detail: 'Premium Gym, Private Beach' },
  { id: 'outdoor_01', kind: 'outdoor', name: 'Male Beach Park', city: 'Male', detail: 'Beach Park' },
  { id: 'outdoor_02', kind: 'outdoor', name: 'Central Park Male', city: 'Male', detail: 'Urban Park' },
  { id: 'outdoor_03', kind: 'outdoor', name: 'Hulhumale Beach Front', city: 'Hulhumale', detail: 'Beach' },
  { id: 'outdoor_04', kind: 'outdoor', name: 'Hulhumale Recreation Park', city: 'Hulhumale', detail: 'Park' },
];

async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(schema);

  const now = stamp();

  for (const t of trainers) {
    await query(
      `insert into trainers (id, name, image_url, bio, certifications, specialties, available_cities, available_locations, rating, review_count, verified, monthly_rates, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       on conflict (id) do nothing`,
      [t.id, t.name, t.image_url, t.bio, JSON.stringify(t.certifications), JSON.stringify(t.specialties),
       JSON.stringify(t.available_cities), JSON.stringify(t.available_locations), t.rating, t.review_count,
       t.verified, JSON.stringify(t.monthly_rates), now]
    );
    for (const label of t.slots) {
      // Deterministic id (not newId()) so re-running this script never
      // inserts a duplicate slot for the same trainer+label — newId()'s
      // randomness would defeat the "on conflict do nothing" below.
      const slotId = `slot_${t.id}_${label.replace(/[^A-Za-z0-9]/g, '')}`;
      await query(
        `insert into trainer_slots (id, trainer_id, label, status, created_at)
         values ($1,$2,$3,'open',$4)
         on conflict (id) do nothing`,
        [slotId, t.id, label, now]
      );
    }
  }

  for (const f of facilities) {
    await query(
      `insert into facilities (id, kind, name, city, detail, monthly_fee, created_at)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id) do nothing`,
      [f.id, f.kind, f.name, f.city, f.detail, f.monthly_fee || 0, now]
    );
  }

  const { rows: trainerCount } = await query('select count(*)::int as n from trainers');
  const { rows: slotCount } = await query('select count(*)::int as n from trainer_slots');
  const { rows: facilityCount } = await query('select count(*)::int as n from facilities');
  console.log(`Seeded: ${trainerCount[0].n} trainer(s), ${slotCount[0].n} slot(s), ${facilityCount[0].n} facilit(y/ies).`);
}

seed()
  .then(() => getPool().end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
