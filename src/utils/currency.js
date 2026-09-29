import { MVR_PER_USD } from '../data/marketplaceData.js';

// Maldivian Rufiyaa has no reliable glyph in most mobile fonts, so we
// use the standard "MVR" ISO code instead of a currency symbol.
export const formatMVR = (amount) =>
  `MVR ${Math.round(amount).toLocaleString('en-US')}`;

export const formatUSD = (mvr) =>
  `$${(mvr / MVR_PER_USD).toFixed(2)} USD`;
