const { auth } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!(await auth(req, res))) return;
  return res.status(200).json({ ok: true });
};
