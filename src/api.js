// Thin fetch wrappers around /api/*. Both dev (via vite.config.js's
// proxy to api-server.js) and production (Vercel's own /api routing)
// serve these at the same relative path, so no base URL is needed.

export async function fetchMarketplace() {
  const res = await fetch('/api/marketplace');
  if (!res.ok) throw new Error('Could not load trainers right now.');
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Booking failed. Please try again.');
  return data.booking;
}
