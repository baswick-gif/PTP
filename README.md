# PT Pool

A mobile-first marketplace for booking certified personal trainers in the Maldives — at home, at the gym, at a hotel, or outdoors.

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi) or in a desktop browser resized to a phone viewport.

```bash
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint      # oxlint
```

## Install as an app (PWA)

The build is a installable Progressive Web App: open the deployed site in Chrome (Android) or Safari (iOS) and use "Add to Home Screen." It gets an app icon, launches full-screen, and works with a service worker for offline caching of the app shell.

## What changed from the original mockup

The uploaded file (`PTPoolMarketplace.jsx`) was a single 960-line component with hardcoded mock data and a few mobile-specific bugs. This project turns it into a runnable Vite + React + Tailwind app and fixes:

- **Wrong currency symbol** — the mockup used ৳ (Bangladeshi Taka) to label Maldivian Rufiyaa amounts. Prices now read `MVR 3,000` instead.
- **Mobile nav menu didn't close** — tapping "Browse Trainers" or "Register as PT" in the hamburger menu left the menu open. Both links now close it.
- **"Search Trainers" button did nothing** — filtering was already live via the selects, so the button was dead weight. It now scrolls to the results section, which matters on mobile where results start below the fold.
- **Booking modal had no keyboard/scroll handling** — no Escape-to-close, no body scroll lock (so the page behind it would scroll on mobile), and it wasn't full-screen on small viewports where a centered card wastes space. Fixed all three, plus initial focus on the close button and `aria-modal`/`role="dialog"` for screen readers.
- **No iOS safe-area handling** — the sticky navbar, modal header, and footer now respect `env(safe-area-inset-*)` so content doesn't sit under the notch or home-indicator bar when installed as a PWA.
- **Static mock data re-created every render** — trainers, rates, gyms/hotels/outdoor spaces, and the currency helper were inline in the component body. Moved to `src/data/marketplaceData.js` and `src/utils/currency.js`.
- **One 960-line component** — split into `Navbar`, `SearchHero`, `TrainerGrid`/`TrainerCard`, `BookingModal`, `PromoBanner`, `Footer`, and `Toast` for maintainability.
- **Not actually runnable** — there was no `package.json`, build tooling, or entry point. This is now a real Vite project with a PWA manifest and generated icons.

## Project structure

```
src/
  components/       UI split by section (Navbar, SearchHero, TrainerGrid, TrainerCard,
                     BookingModal, PromoBanner, Footer, Toast)
  data/              Mock trainers, rates, gyms/hotels/outdoor spaces
  utils/             Currency formatting (MVR / USD)
public/
  icons/             PWA app icons (192/512)
```

## Native mobile app (follow-up)

This is a responsive web app / installable PWA, not a native iOS/Android binary. If a true native app (App Store / Play Store listing, native gestures, push notifications, camera/contacts access, etc.) is needed later, the recommended path is:

1. Scaffold with **Expo** (`npx create-expo-app`), which shares the JS/React mental model but renders with native components instead of DOM/Tailwind.
2. Re-implement `TrainerCard`, `BookingModal`, etc. with `View`/`Text`/`Pressable` and a styling approach like NativeWind (Tailwind-compatible) or StyleSheet.
3. Move `src/data` and `src/utils` as-is — they're plain JS with no DOM dependency.
4. Replace `<select>` filters with a native picker/bottom-sheet component, since HTML `<select>` has no Expo equivalent.
5. Ship through EAS Build to TestFlight / Play Store internal testing.

This is a separate, larger effort from the web app and has not been started.
