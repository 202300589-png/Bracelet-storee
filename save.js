// Admin only: saves the whole store (settings + products) after cleaning every field.
const { auth, readBody } = require('./_lib');

const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
// Only our own images (img/...) or https links are accepted.
const img = (v) => {
  v = str(v, 600);
  return /^(img\/|https:\/\/)/.test(v) ? v : '';
};

const hex = (v, fallback) => (/^#[0-9a-fA-F]{6}$/.test(String(v)) ? String(v).toLowerCase() : fallback);
const oneOf = (v, list, fallback) => (list.includes(v) ? v : fallback);

function cleanTheme(t) {
  t = t || {};
  const cols = Number(t.cols);
  return {
    preset: oneOf(t.preset, ['midnight', 'sand', 'blush', 'olive', 'noir', 'pearl'], ''),
    bg: hex(t.bg, '#0b1426'),
    ink: hex(t.ink, '#ede8dc'),
    accent: hex(t.accent, '#d2ae5c'),
    btn: hex(t.btn, '#d2ae5c'),
    font: oneOf(t.font, ['classic', 'editorial', 'refined', 'soft', 'minimal'], 'classic'),
    corners: oneOf(t.corners, ['sharp', 'soft', 'round'], 'sharp'),
    cols: [2, 3, 4].includes(cols) ? cols : 3,
  };
}

function clean(d) {
  const s = d.store || {};
  const store = {
    name: str(s.name, 40) || 'Bracelet',
    whatsapp: str(s.whatsapp, 20).replace(/\D/g, ''),
    currency: str(s.currency, 8) || 'EGP',
    heroEyebrow: str(s.heroEyebrow, 60),
    heroTitle: str(s.heroTitle, 90),
    heroLead: str(s.heroLead, 300),
    heroImage: img(s.heroImage),
    heroCaption: str(s.heroCaption, 80),
    theme: cleanTheme(s.theme),
    perks: (Array.isArray(s.perks) ? s.perks : []).slice(0, 3).map((p) => [
      str(p && p[0], 40),
      str(p && p[1], 60),
    ]),
  };
  const seen = new Set();
  const products = (Array.isArray(d.products) ? d.products : []).slice(0, 200).map((p, i) => {
    p = p || {};
    let id = str(p.id, 40) || 'p' + (i + 1);
    while (seen.has(id)) id += 'x';
    seen.add(id);
    let images = (Array.isArray(p.images) ? p.images : []).map(img).filter(Boolean).slice(0, 8);
    if (!images.length && img(p.image)) images = [img(p.image)];
    return {
      id,
      name: str(p.name, 80),
      category: str(p.category, 30) || 'Other',
      price: Math.max(0, Math.round(Number(p.price) || 0)),
      images,
      image: images[0] || '',
      desc: str(p.desc, 200),
      visible: p.visible !== false,
      soldOut: !!p.soldOut,
    };
  });
  return { store, products };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!(await auth(req, res))) return;
  try {
    const data = clean(readBody(req));
    const { put } = await import('@vercel/blob');
    await put('store.json', JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return res.status(200).json({ ok: true, products: data.products.length });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
