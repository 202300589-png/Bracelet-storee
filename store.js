// Public: returns the saved store settings and products (or 404 if nothing was saved yet).
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'store.json', limit: 5 });
    const hit = blobs.find((b) => b.pathname === 'store.json');
    if (!hit) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ empty: true });
    }
    const r = await fetch(hit.url + '?t=' + Date.now());
    if (!r.ok) throw new Error('Could not read store.json (' + r.status + ')');
    const data = await r.json();
    const fresh = req.query && req.query.fresh;
    res.setHeader('Cache-Control', fresh ? 'no-store' : 's-maxage=15, stale-while-revalidate=120');
    return res.status(200).json(data);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
