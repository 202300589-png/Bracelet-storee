// Admin only: stores one product photo and returns its public URL.
const { auth, readBody } = require('./_lib');

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ['jpg', 'image/jpeg'];
  if (buf[0] === 0x89 && buf.toString('latin1', 1, 4) === 'PNG') return ['png', 'image/png'];
  if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return ['webp', 'image/webp'];
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!(await auth(req, res))) return;
  try {
    const b = readBody(req);
    const buf = Buffer.from(String(b.data || ''), 'base64');
    if (!buf.length) return res.status(400).json({ error: 'No image received' });
    if (buf.length > 3.5 * 1024 * 1024) return res.status(413).json({ error: 'Image is too large' });
    const kind = sniff(buf);
    if (!kind) return res.status(400).json({ error: 'Only JPG, PNG or WEBP images are accepted' });
    const slug =
      String(b.name || 'photo').toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'photo';
    const { put } = await import('@vercel/blob');
    const out = await put('images/' + slug + '.' + kind[0], buf, {
      access: 'public',
      contentType: kind[1],
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
    });
    return res.status(200).json({ url: out.url });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
