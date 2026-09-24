// Pricing/business rules — kept identical to src/data/marketplaceData.js's
// sessionPackages/monthlyRates/gymMembershipFee (that file is what the
// frontend imports for display; this copy is what api/bookings.js
// prices a booking from). Never trust a total the client sends —
// api/bookings.js recomputes it from these here, the same way this
// file's frontend twin computes what's shown on screen.
const SESSION_PACKAGES = {
  one_day: { label: 'One Day Session', durationMonths: 1 / 12, requiresGymMembership: false, discountPercent: 0 },
  weekly: { label: 'Weekly Sessions', durationMonths: 1 / 4, requiresGymMembership: false, discountPercent: 0.1 },
  monthly: { label: 'Monthly Sessions', durationMonths: 1, requiresGymMembership: true, discountPercent: 0 },
  yearly: { label: 'Yearly Commitment', durationMonths: 10, requiresGymMembership: true, discountPercent: 0 },
};

const MONTHLY_RATES = { Gym: 2500, Home: 3000, Outdoor: 2000, Hotel: 3500 };

const GYM_MEMBERSHIP_FEE = 1080;

// Returns null for an unknown package/location combination — the caller
// treats that as a validation error rather than guessing a price.
function priceBooking(location, packageId) {
  const pkg = SESSION_PACKAGES[packageId];
  const monthlyRate = MONTHLY_RATES[location];
  if (!pkg || !monthlyRate) return null;

  const trainingCost = monthlyRate * pkg.durationMonths;
  const discountAmount = trainingCost * pkg.discountPercent;
  const trainingCostAfterDiscount = trainingCost - discountAmount;

  const requiresGymMembership = pkg.requiresGymMembership && location === 'Gym';
  const gymMembershipCost = requiresGymMembership ? GYM_MEMBERSHIP_FEE * pkg.durationMonths : 0;

  return {
    packageLabel: pkg.label,
    durationMonths: pkg.durationMonths,
    monthlyRate,
    discountAmount,
    gymMembershipFee: gymMembershipCost,
    totalCost: trainingCostAfterDiscount + gymMembershipCost,
  };
}

export { SESSION_PACKAGES, MONTHLY_RATES, GYM_MEMBERSHIP_FEE, priceBooking };
