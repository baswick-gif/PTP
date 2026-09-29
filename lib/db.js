import { Pool } from 'pg';

let pool;
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set — add it in Vercel Project Settings → Environment Variables, or in your local .env.');
    }
    const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
    pool = new Pool({ connectionString, ssl: isLocal ? false : { rejectUnauthorized: false } });
  }
  return pool;
}

function query(text, params) {
  return getPool().query(text, params);
}

// Runs fn(client) inside BEGIN/COMMIT, rolling back on any error. Booking
// creation needs this: marking the slot 'booked' and inserting the
// bookings row must both succeed or neither should, otherwise a slot
// could be lost with no booking to show for it (or vice versa).
async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export { getPool, query, withTransaction };
