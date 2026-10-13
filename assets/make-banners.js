// Generates the README banners in the yousefturk.tech palette.
// node assets/make-banners.js  ->  assets/banner-dark.svg, assets/banner-light.svg
const fs = require('fs');
const path = require('path');

const W = 1200, H = 360;
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>'.split('');
const SANS = "'Inter','Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular','Cascadia Mono',Menlo,Consolas,monospace";

// Deterministic glyph field (same layout in both themes).
function rng(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
function glyphField(color) {
  const r = rng(7);
  const out = [];
  for (let y = 34; y < H; y += 30) {
    for (let x = 18; x < W; x += 26) {
      const v = r();
      if (v > 0.58) continue;
      // keep the text block calm
      if (x > 150 && x < 820 && y > 90 && y < 290) continue;
      // and the yousefturk.tech label in the corner
      if (x > W - 200 && y > H - 60) continue;
      const ch = GLYPHS[Math.floor(r() * GLYPHS.length)];
      const o = (0.06 + r() * 0.22).toFixed(2);
      const d = (r() * 6).toFixed(2);
      out.push(`<text x="${x}" y="${y}" fill="${color}" opacity="${o}" style="animation-delay:-${d}s">${ch.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')}</text>`);
    }
  }
  return out.join('');
}

function banner({ bg, ink, mute, glyph, live, ring }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Yousef Turk</title>
<desc id="d">High-agency AI builder. ML research, AI agents and robotics. Abu Dhabi.</desc>
<style>
  .g text{font-family:${MONO};font-size:15px;animation:flicker 6s ease-in-out infinite}
  @keyframes flicker{50%{fill-opacity:.15}}
  @media (prefers-reduced-motion:reduce){.g text{animation:none}}
</style>
<rect width="${W}" height="${H}" rx="22" fill="${bg}"/>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="21.5" fill="none" stroke="${ring}"/>
<g class="g">${glyphField(glyph)}</g>

<!-- yt monogram, the mark from the resume -->
<g transform="translate(96 180)">
  <ellipse rx="34" ry="45" fill="none" stroke="${ink}" stroke-width="2"/>
  <text y="9" text-anchor="middle" fill="${ink}" font-family="${SANS}" font-size="38" font-style="italic" font-weight="300" letter-spacing="-1">yt</text>
</g>

<text x="172" y="160" fill="${ink}" font-family="${SANS}" font-size="64" font-weight="300" letter-spacing="-2.5">Yousef Turk</text>
<text x="174" y="200" fill="${mute}" font-family="${SANS}" font-size="21" font-weight="400">High-agency builder | ML research, AI agents &amp; robotics | Abu Dhabi</text>
<g transform="translate(174 240)">
  <circle cx="5" cy="-6" r="5" fill="${live}"/>
  <text x="20" y="0" fill="${live}" font-family="${MONO}" font-size="15" letter-spacing=".5">BUILDING THE AI EVERYONE ELSE WILL USE</text>
</g>

<text x="${W - 44}" y="${H - 34}" text-anchor="end" fill="${mute}" font-family="${MONO}" font-size="14">yousefturk.tech</text>
</svg>
`;
}

const dir = __dirname;
fs.writeFileSync(path.join(dir, 'banner-dark.svg'), banner({ bg: '#171717', ink: '#ececec', mute: '#9a9a9a', glyph: '#e4feeb', live: '#43ab92', ring: '#2c2c2c' }));
fs.writeFileSync(path.join(dir, 'banner-light.svg'), banner({ bg: '#f4fef7', ink: '#1b1b1b', mute: '#5f5f5f', glyph: '#0d3d56', live: '#2f8f77', ring: '#c0f8d3' }));
console.log('banners written');
