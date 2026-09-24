import crypto from 'crypto';

function stamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10) + ' ' + d.toTimeString().slice(0, 5);
}

function newId(prefix) {
  return prefix + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
}

function sendJson(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json').send(JSON.stringify(body));
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  sendJson(res, 405, { error: 'Method not allowed' });
}

// Wraps a handler so an uncaught error becomes a clean 500 JSON body
// instead of a stack trace leaking to the client or a half-written
// response. Postgres 42P01 (undefined_table) gets its own clearer
// message — it means db/schema.sql hasn't been applied to this
// database yet, which is a much more useful thing to tell whoever
// is looking at the error than "Server error".
function withHandler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err && err.code === '42P01') {
        return sendJson(res, 503, { error: 'Database not set up yet — run db/schema.sql and db/seed.js against DATABASE_URL.' });
      }
      console.error(err);
      if (!res.headersSent) sendJson(res, 500, { error: 'Server error' });
    }
  };
}

export { stamp, newId, sendJson, methodNotAllowed, withHandler };
