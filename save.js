// Admin only: saves the whole store (settings + products) after cleaning every field.
const { auth, readBody } = require('./_lib');

const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
// Only our own images (img/...) or https links are accepted.
const img = (v) => {
  v = str(v, 600);
  return /^(img\/|https:\/\/)/.test(v) ? v : '';
};

const num = (v, max) => Math.min(max, Math.max(0, Math.round(Number(v) || 0)));
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

// Delivery fee per governorate id. null means "we do not deliver there".
function cleanShipping(s) {
  const out = {};
  if (s && typeof s === 'object') {
    Object.keys(s).slice(0, 40).forEach((k) => {
      if (!/^[a-z-]{2,24}$/.test(k)) return;
      out[k] = s[k] === null || s[k] === '' || s[k] === false ? null : num(s[k], 100000);
    });
  }
  return out;
}

const PAY = [['cash', 'Cash on delivery'], ['visa', 'Visa / bank card'], ['instapay', 'InstaPay']];
function cleanPayments(list) {
  const by = {};
  (Array.isArray(list) ? list : []).forEach((p) => { if (p && typeof p.id === 'string') by[p.id] = p; });
  return PAY.map(([id, label]) => {
    const p = by[id] || {};
    return { id, enabled: p.enabled !== false, label: str(p.label, 30) || label, note: str(p.note, 200), handle: id === 'instapay' ? str(p.handle, 80) : '' };
  });
}

function cleanCategories(list) {
  const seen = new Set();
  const out = [];
  (Array.isArray(list) ? list : []).slice(0, 20).forEach((c) => {
    const name = str(c && typeof c === 'object' ? c.name : c, 30);
    if (!name || seen.has(name.toLowerCase())) return;
    seen.add(name.toLowerCase());
    out.push({ name, show: !(c && c.show === false) });
  });
  return out;
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
    announcement: str(s.announcement, 120),
    freeShippingOver: num(s.freeShippingOver, 1000000),
    categories: cleanCategories(s.categories),
    shipping: cleanShipping(s.shipping),
    payments: cleanPayments(s.payments),
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
    const price = num(p.price, 10000000);
    const sale = num(p.salePrice, 10000000);
    return {
      id,
      name: str(p.name, 80),
      category: str(p.category, 30) || 'Other',
      price,
      salePrice: sale > 0 && sale < price ? sale : 0,
      images,
      image: images[0] || '',
      desc: str(p.desc, 200),
      includes: str(p.includes, 120),
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
