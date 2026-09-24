// Trainers, gyms, hotels and outdoor spaces are no longer hardcoded
// here — they're real data served by GET /api/marketplace (see
// src/api.js). What's left below is pricing/business config, which
// stays static on the frontend for display but is never trusted as-is:
// api/bookings.js (lib/pricing.js) recomputes the same numbers
// server-side before creating a booking, so keep the two in sync if
// either changes.

export const sessionPackages = [
  {
    id: 'one_day',
    label: 'One Day Session',
    description: 'Single session',
    durationMonths: 1 / 12,
    requiresGymMembership: false,
    discountPercent: 0,
  },
  {
    id: 'weekly',
    label: 'Weekly Sessions',
    description: 'Training for 1 week (3-5 sessions)',
    durationMonths: 1 / 4,
    requiresGymMembership: false,
    discountPercent: 0.1,
  },
  {
    id: 'monthly',
    label: 'Monthly Sessions',
    description: '4 weeks consistent training',
    durationMonths: 1,
    requiresGymMembership: true,
    discountPercent: 0,
  },
  {
    id: 'yearly',
    label: 'Yearly Commitment',
    description: '12 months (2 months free)',
    durationMonths: 10, // 10 months price for 12 months training
    requiresGymMembership: true,
    discountPercent: 0,
  },
];

// Monthly rates in MVR (baseline for 1 month commitment)
export const monthlyRates = {
  Gym: 2500,
  Home: 3000,
  Outdoor: 2000,
  Hotel: 3500,
};

export const gymMembershipFee = 1080; // MVR per month

export const MVR_PER_USD = 15.42;

export const CITIES = ['Male', 'Hulhumale'];
export const LOCATIONS = ['Gym', 'Home', 'Hotel', 'Outdoor'];
