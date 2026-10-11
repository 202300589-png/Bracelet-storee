// Shared helpers for the API routes. Files starting with "_" are not exposed as routes.
const crypto = require('crypto');

// Returns true when the request carries the right admin password.
// Otherwise it answers the request itself and returns false.
async function auth(req, res) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real) {
    res.status(503).json({ error: 'ADMIN_PASSWORD is not set' });
    return false;
  }
  const given = String(req.headers['x-admin-password'] || '');
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    await new Promise((r) => setTimeout(r, 600)); // slows down password guessing
    res.status(401).json({ error: 'Wrong password' });
    return false;
  }
  return true;
}

function readBody(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = null; }
  }
  return b && typeof b === 'object' ? b : {};
}

module.exports = { auth, readBody };
