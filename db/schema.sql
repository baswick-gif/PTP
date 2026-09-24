-- PT Pool database schema.
--
-- Text ids (not serial/uuid) throughout, matching the app's own id
-- style already baked into the frontend mock data (pt_01, gym_01, ...)
-- and generated the same way at runtime by lib/util.js's newId().
-- Every "create table"/"create index" is `if not exists` so this file
-- can be re-run safely against a database that already has some or all
-- of it applied.

create table if not exists trainers (
  id text primary key,
  name text not null,
  image_url text,
  bio text,
  certifications jsonb not null default '[]',
  specialties jsonb not null default '[]',
  available_cities jsonb not null default '[]',
  available_locations jsonb not null default '[]',
  rating numeric not null default 0,
  review_count integer not null default 0,
  created_at text not null
);

-- One row per bookable time slot, so booking one can never double-book
-- it — the booking transaction flips status to 'booked' and any
-- concurrent request for the same slot simply won't find it 'open'
-- anymore.
create table if not exists trainer_slots (
  id text primary key,
  trainer_id text not null references trainers(id),
  label text not null,
  status text not null default 'open',
  created_at text not null
);
create index if not exists idx_trainer_slots_trainer on trainer_slots(trainer_id, status);

-- Gyms, hotels and outdoor training spaces share one table (kind tells
-- them apart) since the frontend already treats them as one interchangeable
-- "facility" concept once a location type is picked — a Home booking has
-- no facility row at all (see bookings.facility_name below).
create table if not exists facilities (
  id text primary key,
  kind text not null, -- 'gym' | 'hotel' | 'outdoor'
  name text not null,
  city text not null,
  detail text, -- address (gym), amenities (hotel), or space type (outdoor)
  created_at text not null
);
create index if not exists idx_facilities_kind_city on facilities(kind, city);

create table if not exists bookings (
  id text primary key,
  trainer_id text not null references trainers(id),
  slot_id text not null references trainer_slots(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  city text not null,
  location text not null, -- 'Gym' | 'Home' | 'Hotel' | 'Outdoor'
  facility_id text references facilities(id),
  facility_name text not null, -- snapshot, since Home has no facilities row
  package_id text not null,
  package_label text not null,
  duration_months numeric not null,
  monthly_rate numeric not null,
  discount_amount numeric not null default 0,
  gym_membership_fee numeric not null default 0,
  total_cost numeric not null,
  status text not null default 'confirmed',
  created_at text not null
);
create index if not exists idx_bookings_trainer on bookings(trainer_id);
create index if not exists idx_bookings_email on bookings(customer_email);
