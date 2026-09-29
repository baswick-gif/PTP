// Pricing/business rules — kept identical to src/data/marketplaceData.js's
// sessionPackages (that file is what the frontend imports for display;
// this copy is what api/bookings.js prices a booking from). Never trust
// a total the client sends — api/bookings.js recomputes it from these
// here, the same way this file's frontend twin computes what's shown on
// screen. The monthly rate and gym membership fee are never global —
// they come from the specific trainer's and gym's own rate cards,
// looked up by the caller and passed in.
const SESSION_PACKAGES = {
  one_day: { label: 'One Day Session', durationMonths: 1 / 12, requiresGymMembership: false, discountPercent: 0 },
  weekly: { label: 'Weekly Sessions', durationMonths: 1 / 4, requiresGymMembership: false, discountPercent: 0.1 },
  monthly: { label: 'Monthly Sessions', durationMonths: 1, requiresGymMembership: true, discountPercent: 0 },
  yearly: { label: 'Yearly Commitment', durationMonths: 10, requiresGymMembership: true, discountPercent: 0 },
};

// Returns null for an unknown package/location combination, or when the
// trainer has no rate set for that location — the caller treats either
// as a validation error rather than guessing a price.
function priceBooking({ location, packageId, monthlyRate, gymMembershipFee = 0 }) {
  const pkg = SESSION_PACKAGES[packageId];
  if (!pkg || !monthlyRate) return null;

  const trainingCost = monthlyRate * pkg.durationMonths;
  const discountAmount = trainingCost * pkg.discountPercent;
  const trainingCostAfterDiscount = trainingCost - discountAmount;

  const requiresGymMembership = pkg.requiresGymMembership && location === 'Gym';
  const gymMembershipCost = requiresGymMembership ? gymMembershipFee * pkg.durationMonths : 0;

  return {
    packageLabel: pkg.label,
    durationMonths: pkg.durationMonths,
    monthlyRate,
    discountAmount,
    gymMembershipFee: gymMembershipCost,
    totalCost: trainingCostAfterDiscount + gymMembershipCost,
  };
}

export { SESSION_PACKAGES, priceBooking };
