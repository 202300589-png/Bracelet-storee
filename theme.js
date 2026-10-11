/* Shared by the store page and the admin panel:
   ready-made palettes, font pairs, and how a theme is applied to a page (or to one box). */
(function () {
  var PRESETS = {
    midnight: { label: 'ليلي',    bg: '#0b1426', ink: '#ede8dc', accent: '#d2ae5c', btn: '#d2ae5c' },
    sand:     { label: 'رملي',    bg: '#ece9e3', ink: '#0e1a33', accent: '#9a7424', btn: '#0e1a33' },
    blush:    { label: 'وردي',    bg: '#f6e9e6', ink: '#3b1f2b', accent: '#b0586b', btn: '#3b1f2b' },
    olive:    { label: 'زيتوني',  bg: '#14231c', ink: '#efebdd', accent: '#c9a24d', btn: '#c9a24d' },
    noir:     { label: 'أسود',    bg: '#0a0a0a', ink: '#f5f5f2', accent: '#e0c27a', btn: '#f5f5f2' },
    pearl:    { label: 'لؤلؤي',   bg: '#ffffff', ink: '#1c1c1e', accent: '#b76e79', btn: '#1c1c1e' }
  };
  var FONTS = {
    classic:   { label: 'كلاسيك', display: "'Gilda Display',Georgia,serif",       body: "'Jost','Helvetica Neue',Arial,sans-serif", dw: 400, url: 'Gilda+Display&family=Jost:wght@400;500;600' },
    editorial: { label: 'مجلات',  display: "'Playfair Display',Georgia,serif",    body: "'Lato','Helvetica Neue',Arial,sans-serif", dw: 500, url: 'Playfair+Display:wght@500&family=Lato:wght@400;700' },
    refined:   { label: 'راقي',   display: "'Cormorant Garamond',Georgia,serif",  body: "'Montserrat','Helvetica Neue',Arial,sans-serif", dw: 600, url: 'Cormorant+Garamond:wght@500;600&family=Montserrat:wght@400;500;600' },
    soft:      { label: 'ناعم',   display: "'DM Serif Display',Georgia,serif",    body: "'DM Sans','Helvetica Neue',Arial,sans-serif", dw: 400, url: 'DM+Serif+Display&family=DM+Sans:wght@400;500;600' },
    minimal:   { label: 'بسيط',   display: "'Jost','Helvetica Neue',Arial,sans-serif", body: "'Jost','Helvetica Neue',Arial,sans-serif", dw: 500, url: 'Jost:wght@400;500;600' }
  };
  var RADII = { sharp: '2px', soft: '8px', round: '16px' };

  var isHex = function (v) { return /^#[0-9a-f]{6}$/i.test(String(v || '')); };
  function rgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function lum(h) {
    var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  // Readable text color to put on top of the given color.
  function on(h) { return lum(h) > 0.179 ? '#111111' : '#ffffff'; }
  // Blend a toward b by p (0..1).
  function mix(a, b, p) {
    var x = rgb(a), y = rgb(b);
    return '#' + [0, 1, 2].map(function (i) {
      var v = Math.round(x[i] * (1 - p) + y[i] * p);
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }

  function normalize(t) {
    t = t || {};
    var d = PRESETS.midnight;
    var cols = Number(t.cols);
    return {
      preset: t.preset && PRESETS[t.preset] ? t.preset : '',
      bg: isHex(t.bg) ? t.bg.toLowerCase() : d.bg,
      ink: isHex(t.ink) ? t.ink.toLowerCase() : d.ink,
      accent: isHex(t.accent) ? t.accent.toLowerCase() : d.accent,
      btn: isHex(t.btn) ? t.btn.toLowerCase() : d.btn,
      font: FONTS[t.font] ? t.font : 'classic',
      corners: RADII[t.corners] ? t.corners : 'sharp',
      cols: cols === 2 || cols === 3 || cols === 4 ? cols : 3
    };
  }

  function ensureFont(key) {
    if (!FONTS[key]) return;
    var id = 'font-' + key;
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[key].url + '&display=swap';
    document.head.appendChild(l);
  }

  // Sets the page variables on `el` (the whole page by default, or one preview box).
  function apply(theme, el) {
    var t = normalize(theme), f = FONTS[t.font], root = !el;
    el = el || document.documentElement;
    var s = el.style;
    s.setProperty('--bg', t.bg);
    s.setProperty('--ink', t.ink);
    s.setProperty('--gold', t.accent);
    s.setProperty('--accent-fill', t.accent);
    s.setProperty('--accent-fg', on(t.accent));
    s.setProperty('--btn-bg', t.btn);
    s.setProperty('--btn-fg', on(t.btn));
    s.setProperty('--card', mix(t.bg, t.ink, 0.07));
    s.setProperty('--line', mix(t.bg, t.ink, 0.2));
    s.setProperty('--mute', mix(t.ink, t.bg, 0.32));
    s.setProperty('--display', f.display);
    s.setProperty('--body', f.body);
    s.setProperty('--dw', String(f.dw));
    s.setProperty('--radius', RADII[t.corners]);
    s.setProperty('--cols', String(t.cols));
    if (root) s.colorScheme = lum(t.bg) < 0.4 ? 'dark' : 'light';
    ensureFont(t.font);
    return t;
  }

  window.Theme = { PRESETS: PRESETS, FONTS: FONTS, RADII: RADII, normalize: normalize, apply: apply, ensureFont: ensureFont, on: on };
})();
