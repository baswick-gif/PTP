# PT Pool

A mobile-first marketplace for booking certified personal trainers in the Maldives — at home, at the gym, at a hotel, or outdoors.

## Running locally

The frontend (Vite) and the API (a small Node HTTP server standing in for Vercel's serverless functions) run as two processes in dev:

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL
node db/seed.js              # applies db/schema.sql and seeds trainers/facilities (safe to re-run)

npm run dev:api              # terminal 1 — the API on :3001
npm run dev                  # terminal 2 — Vite on :5173, proxies /api to :3001
```

Open the printed local URL on your phone (same Wi-Fi) or in a desktop browser resized to a phone viewport.

```bash
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint      # oxlint
npm run db:seed   # (re)apply schema.sql + seed data
```

## Backend

Trainers, gyms/hotels/outdoor spaces, and bookings are real data in Postgres — nothing is hardcoded or mocked anymore.

- **`db/schema.sql`** — `trainers`, `trainer_slots` (one row per bookable time slot, so a slot can never be double-booked), `facilities` (gyms/hotels/outdoor spaces share one table, told apart by `kind`), `bookings`.
- **`db/seed.js`** — applies the schema and seeds the same trainers/facilities the original mockup hardcoded, so the app looks identical after switching to the real backend. Re-running it is safe (every insert is `ON CONFLICT DO NOTHING`).
- **`api/marketplace.js`** (`GET`) — the full public dataset (trainers with their still-open slots, plus facilities) in one payload.
- **`api/bookings.js`** (`POST`) — creates a booking: re-validates the trainer/slot/facility/city/location combination against the database, prices it server-side from `lib/pricing.js` (a client-sent total is never trusted), then atomically claims the slot and inserts the booking inside one transaction so two people can't book the same slot.
- **`lib/db.js`** — a Postgres connection pool (`pg`), read from `DATABASE_URL`.
- **`api-server.js`** — routes `/api/*` to those same handler files for local dev (see "Running locally" above); Vercel's own zero-config `/api` routing takes over in production, no extra config needed.

No login is required to book yet, and no money actually moves — checkout creates a real, persisted booking (marks the slot unavailable, priced correctly) but payment is still a placeholder.

## Install as an app (PWA)

The build is a installable Progressive Web App: open the deployed site in Chrome (Android) or Safari (iOS) and use "Add to Home Screen." It gets an app icon, launches full-screen, and works with a service worker for offline caching of the app shell.

## What changed from the original mockup

The uploaded file (`PTPoolMarketplace.jsx`) was a single 960-line component with hardcoded mock data and a few mobile-specific bugs. This project turns it into a runnable Vite + React + Tailwind app and fixes:

- **Wrong currency symbol** — the mockup used ৳ (Bangladeshi Taka) to label Maldivian Rufiyaa amounts. Prices now read `MVR 3,000` instead.
- **Mobile nav menu didn't close** — tapping "Browse Trainers" or "Register as PT" in the hamburger menu left the menu open. Both links now close it.
- **"Search Trainers" button did nothing** — filtering was already live via the selects, so the button was dead weight. It now scrolls to the results section, which matters on mobile where results start below the fold.
- **Booking modal had no keyboard/scroll handling** — no Escape-to-close, no body scroll lock (so the page behind it would scroll on mobile), and it wasn't full-screen on small viewports where a centered card wastes space. Fixed all three, plus initial focus on the close button and `aria-modal`/`role="dialog"` for screen readers.
- **No iOS safe-area handling** — the sticky navbar, modal header, and footer now respect `env(safe-area-inset-*)` so content doesn't sit under the notch or home-indicator bar when installed as a PWA.
- **Static mock data re-created every render** — trainers, rates, gyms/hotels/outdoor spaces, and the currency helper were inline in the component body. Moved to `src/data/marketplaceData.js` and `src/utils/currency.js` (and later, trainers/facilities moved again to a real Postgres backend — see "Backend" below).
- **One 960-line component** — split into `Navbar`, `SearchHero`, `TrainerGrid`/`TrainerCard`, `BookingModal`, `PromoBanner`, `Footer`, and `Toast` for maintainability.
- **Not actually runnable** — there was no `package.json`, build tooling, or entry point. This is now a real Vite project with a PWA manifest and generated icons.

## Project structure

```
api/
  marketplace.js     GET  — trainers (with open slots) + facilities
  bookings.js         POST — create a booking
api-server.js         Local dev stand-in for Vercel's /api routing
db/
  schema.sql          Postgres tables
  seed.js              Applies schema.sql + seeds trainers/facilities
lib/
  db.js               Postgres connection pool
  pricing.js          Session package pricing, shared by api/bookings.js
  util.js              newId/stamp/JSON response helpers
src/
  api.js              fetch() wrappers for /api/marketplace and /api/bookings
  components/         UI split by section (Navbar, SearchHero, TrainerGrid, TrainerCard,
                       BookingModal, PromoBanner, Footer, Toast)
  data/                Pricing/business config (session packages, rates)
  utils/               Currency formatting (MVR / USD)
public/
  icons/               PWA app icons (192/512)
```

## Native mobile app (follow-up)

This is a responsive web app / installable PWA, not a native iOS/Android binary. If a true native app (App Store / Play Store listing, native gestures, push notifications, camera/contacts access, etc.) is needed later, the recommended path is:

1. Scaffold with **Expo** (`npx create-expo-app`), which shares the JS/React mental model but renders with native components instead of DOM/Tailwind.
2. Re-implement `TrainerCard`, `BookingModal`, etc. with `View`/`Text`/`Pressable` and a styling approach like NativeWind (Tailwind-compatible) or StyleSheet.
3. Move `src/data` and `src/utils` as-is — they're plain JS with no DOM dependency.
4. Replace `<select>` filters with a native picker/bottom-sheet component, since HTML `<select>` has no Expo equivalent.
5. Ship through EAS Build to TestFlight / Play Store internal testing.

This is a separate, larger effort from the web app and has not been started.
