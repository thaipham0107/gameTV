// Nhân vật tự vẽ bằng SVG (phong cách hoạt hình, không dùng nhân vật có bản quyền).
// Mỗi nhân vật đổi được màu trang phục.

export const COLORS = ['#e63946', '#1d7bd8', '#2fb36a', '#f4a62a', '#9b5de5', '#ec5fa3'];

export const HEROES = [
  { id: 'nhen', g: 'm', name: 'Siêu nhân Nhện', color: 0 },
  { id: 'lego', g: 'm', name: 'Khủng long Lego', color: 2 },
  { id: 'robot', g: 'm', name: 'Người máy', color: 1 },
  { id: 'sieu', g: 'm', name: 'Siêu nhân Bay', color: 3 },
  { id: 'bang', g: 'f', name: 'Công chúa Băng', color: 1 },
  { id: 'hoa', g: 'f', name: 'Công chúa Hoa', color: 5 },
  { id: 'phuthuy', g: 'f', name: 'Phù thủy nhí', color: 4 },
  { id: 'nusieu', g: 'f', name: 'Nữ siêu nhân', color: 0 },
];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const SKIN = '#ffd5b0';
const INK = '#2b2d42';

const face = (eyeY = 40) => `
  <ellipse cx="42" cy="${eyeY}" rx="2.8" ry="3.4" fill="${INK}"/><ellipse cx="58" cy="${eyeY}" rx="2.8" ry="3.4" fill="${INK}"/>
  <circle cx="43" cy="${eyeY - 1.2}" r="1" fill="#fff"/><circle cx="59" cy="${eyeY - 1.2}" r="1" fill="#fff"/>
  <path d="M43 ${eyeY + 9} Q50 ${eyeY + 15} 57 ${eyeY + 9}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="37" cy="${eyeY + 7}" r="3.2" fill="#ff9aa2" opacity=".6"/><circle cx="63" cy="${eyeY + 7}" r="3.2" fill="#ff9aa2" opacity=".6"/>`;

// thân + tay chân dùng chung: tay phải duỗi về phía trước (hướng quái vật)
function bodyParts({ main, alt, boots = INK, skirt = false, gloves = SKIN }) {
  return `
  <rect x="38" y="92" width="10" height="26" rx="4" fill="${alt}"/><rect x="52" y="92" width="10" height="26" rx="4" fill="${alt}"/>
  <rect x="35" y="116" width="15" height="9" rx="4" fill="${boots}"/><rect x="51" y="116" width="15" height="9" rx="4" fill="${boots}"/>
  ${skirt ? `<path d="M34 78 L66 78 L82 118 L18 118 Z" fill="${main}"/><path d="M26 108 Q50 122 74 108" stroke="${shade(main, 0.5)}" stroke-width="3" fill="none"/>` : `<rect x="32" y="60" width="36" height="40" rx="12" fill="${main}"/>`}
  <rect x="22" y="62" width="11" height="28" rx="5.5" fill="${skirt ? main : alt}" transform="rotate(10 27 64)"/>
  <circle cx="23" cy="92" r="6" fill="${gloves}"/>
  <rect x="60" y="63" width="30" height="11" rx="5.5" fill="${skirt ? main : alt}"/>
  <circle cx="92" cy="69" r="7.5" fill="${gloves}"/>`;
}

const head = (extra = '') => `<circle cx="50" cy="38" r="23" fill="${SKIN}"/>${extra}`;

const BUILD = {
  nhen: (c) => {
    const red = c, blue = shade(c, -0.55);
    return `
    ${bodyParts({ main: red, alt: blue, boots: blue, gloves: red })}
    <path d="M50 62 L50 98 M38 70 L62 70 M36 82 L64 82 M40 62 L50 76 L60 62" stroke="${shade(c, -0.4)}" stroke-width="1.6" fill="none" opacity=".8"/>
    <circle cx="50" cy="38" r="23" fill="${red}"/>
    <path d="M50 15 L50 61 M30 28 L70 28 M27 38 L73 38 M30 49 L70 49 M36 20 Q50 40 36 56 M64 20 Q50 40 64 56" stroke="${shade(c, -0.4)}" stroke-width="1.5" fill="none" opacity=".75"/>
    <path d="M30 38 Q40 24 46 38 Q40 47 30 40 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <path d="M70 38 Q60 24 54 38 Q60 47 70 40 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <circle cx="40" cy="38" r="1.8" fill="${INK}"/><circle cx="60" cy="38" r="1.8" fill="${INK}"/>
    <circle cx="50" cy="82" r="5" fill="${blue}"/>`;
  },
  robot: (c) => `
    <line x1="50" y1="8" x2="50" y2="16" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="7" r="4" fill="#ffd166" stroke="${INK}" stroke-width="2"/>
    ${bodyParts({ main: c, alt: '#8d99ae', boots: INK, gloves: '#d9dee7' })}
    <rect x="42" y="68" width="16" height="14" rx="3" fill="#ffd166" stroke="${INK}" stroke-width="2"/><circle cx="50" cy="75" r="3" fill="${c}"/>
    <rect x="28" y="16" width="44" height="40" rx="10" fill="#d9dee7" stroke="${INK}" stroke-width="2.5"/>
    <rect x="33" y="26" width="34" height="16" rx="6" fill="${INK}"/>
    <circle cx="42" cy="34" r="4.5" fill="#3dd6d0"/><circle cx="58" cy="34" r="4.5" fill="#3dd6d0"/>
    <path d="M40 49 H60" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  sieu: (c) => `
    <path d="M36 62 L10 112 L46 100 L62 100 Z" fill="${shade(c, -0.3)}"/>
    ${bodyParts({ main: c, alt: shade(c, -0.5), boots: '#c1121f', gloves: SKIN })}
    <circle cx="50" cy="80" r="8" fill="#ffd166" stroke="${INK}" stroke-width="2"/><path d="M45 80 L50 74 L55 80 L50 87 Z" fill="${c}"/>
    ${head(`<path d="M27 36 Q50 -2 73 36 Q60 22 50 24 Q40 22 27 36 Z" fill="#2b2d42"/><path d="M28 36 H72 V44 H28 Z" fill="${shade(c, -0.5)}" opacity=".0"/>`)}
    <path d="M30 37 Q50 32 70 37 L68 46 Q50 42 32 46 Z" fill="${shade(c, -0.5)}"/>
    <circle cx="42" cy="40" r="3" fill="#fff"/><circle cx="58" cy="40" r="3" fill="#fff"/><circle cx="43" cy="40" r="1.4" fill="${INK}"/><circle cx="59" cy="40" r="1.4" fill="${INK}"/>
    <path d="M43 52 Q50 58 57 52" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  bang: (c) => `
    <path d="M30 56 Q10 90 22 112 L46 100 Z" fill="#cfefff" opacity=".7"/>
    ${bodyParts({ main: c, alt: shade(c, 0.4), boots: shade(c, -0.3), skirt: true })}
    <path d="M34 70 L66 70 L62 80 L38 80 Z" fill="${shade(c, 0.45)}"/>
    <path d="M30 98 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6" stroke="#fff" stroke-width="2.4" fill="none" opacity=".85"/>
    ${head(`<path d="M26 40 Q22 8 50 12 Q78 8 74 40 Q70 22 50 24 Q30 22 26 40 Z" fill="#f4f1de"/><path d="M26 38 Q14 70 28 96 Q30 78 34 50 Z" fill="#f4f1de"/><circle cx="26" cy="96" r="5" fill="${shade(c, 0.4)}"/>`)}
    ${face()}
    <path d="M38 14 L42 4 L46 12 L50 2 L54 12 L58 4 L62 14 Z" fill="#ffd166" stroke="#e0a800" stroke-width="1.5"/>`,
  hoa: (c) => `
    ${bodyParts({ main: c, alt: shade(c, 0.4), boots: shade(c, -0.4), skirt: true })}
    <path d="M30 98 Q50 108 70 98" stroke="#ffe6f0" stroke-width="3" fill="none"/><circle cx="50" cy="76" r="4" fill="#ffd166"/>
    ${head(`<path d="M25 40 Q20 8 50 11 Q80 8 75 40 Q70 22 50 24 Q30 22 25 40 Z" fill="#6b3f2a"/><path d="M25 38 Q14 72 30 100 Q32 78 33 50 Z" fill="#6b3f2a"/><path d="M75 38 Q86 72 70 100 Q68 78 67 50 Z" fill="#6b3f2a"/>`)}
    ${face()}
    <g transform="translate(70 18)"><circle r="3" fill="#ffd166"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-7" rx="3.4" ry="5" fill="#fff" stroke="#f79ac0" stroke-width="1" transform="rotate(${a})"/>`).join('')}</g>`,
  phuthuy: (c) => `
    ${bodyParts({ main: c, alt: shade(c, -0.4), boots: INK, skirt: true })}
    <circle cx="50" cy="80" r="4" fill="#ffd166"/>
    ${head(`<path d="M25 40 Q22 26 50 22 Q78 26 75 40 Q70 30 50 32 Q30 30 25 40 Z" fill="#3d2c8d"/><path d="M24 38 Q16 62 26 80 Q30 62 32 46 Z" fill="#3d2c8d"/><path d="M76 38 Q84 62 74 80 Q70 62 68 46 Z" fill="#3d2c8d"/>`)}
    ${face(42)}
    <path d="M16 22 Q50 34 84 22 L82 16 Q50 26 18 16 Z" fill="${shade(c, -0.3)}"/><path d="M30 20 L52 -8 L72 20 Z" fill="${c}"/><rect x="30" y="16" width="42" height="6" rx="2" fill="#ffd166"/><circle cx="60" cy="-2" r="0" fill="#fff"/>
    <g fill="#ffd166"><path d="M92 40 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 z" transform="scale(.9) translate(8 2)"/></g>`,
  nusieu: (c) => `
    <path d="M36 62 L8 110 L46 100 L62 100 Z" fill="${shade(c, -0.3)}"/>
    ${bodyParts({ main: c, alt: shade(c, -0.45), boots: '#ffd166', gloves: SKIN })}
    <path d="M34 90 H66 V98 H34 Z" fill="#ffd166"/><circle cx="50" cy="76" r="7" fill="#ffd166"/><path d="M50 71 l2 4 l4 .5 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -.5 z" fill="${c}"/>
    ${head(`<path d="M25 40 Q22 8 50 11 Q78 8 75 40 Q70 22 50 24 Q30 22 25 40 Z" fill="#2b2d42"/><circle cx="80" cy="30" r="10" fill="#2b2d42"/><path d="M72 22 Q90 20 90 44 Q86 36 80 40 Z" fill="#2b2d42"/>`)}
    <path d="M29 38 Q50 30 71 38 L69 47 Q50 42 31 47 Z" fill="${c}"/>
    <circle cx="42" cy="40" r="3" fill="#fff"/><circle cx="58" cy="40" r="3" fill="#fff"/><circle cx="43" cy="40" r="1.4" fill="${INK}"/><circle cx="59" cy="40" r="1.4" fill="${INK}"/>
    <path d="M43 52 Q50 58 57 52" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
};

// khủng long lắp ghép: các khối vuông có núm tròn
function lego(c) {
  const dk = shade(c, -0.3), lt = shade(c, 0.35);
  const stud = (x, y, col = c) => `<rect x="${x}" y="${y}" width="9" height="5" rx="2" fill="${shade(col, 0.2)}" stroke="${shade(col, -0.35)}" stroke-width="1"/>`;
  return `
  <path d="M20 84 L2 100 L2 112 L24 106 Z" fill="${dk}" stroke="${shade(c, -0.5)}" stroke-width="1.5"/>
  <rect x="20" y="62" width="48" height="38" rx="3" fill="${c}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  ${stud(24, 57)}${stud(36, 57)}${stud(48, 57)}
  <rect x="26" y="98" width="14" height="22" rx="2" fill="${dk}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  <rect x="48" y="98" width="14" height="22" rx="2" fill="${dk}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  <rect x="23" y="116" width="20" height="9" rx="2" fill="#2b2d42"/><rect x="45" y="116" width="20" height="9" rx="2" fill="#2b2d42"/>
  <rect x="26" y="74" width="30" height="20" rx="2" fill="${lt}" opacity=".6"/>
  <rect x="58" y="70" width="24" height="9" rx="3" fill="${c}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  <rect x="44" y="20" width="52" height="44" rx="4" fill="${c}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  ${stud(48, 15)}${stud(60, 15)}${stud(72, 15)}
  <rect x="62" y="48" width="34" height="16" rx="3" fill="${lt}" stroke="${shade(c, -0.5)}" stroke-width="2"/>
  <path d="M68 48 v5 M76 48 v5 M84 48 v5 M92 48 v5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="68" cy="34" r="6" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="70" cy="34" r="2.8" fill="${INK}"/>
  <path d="M30 62 l6 -8 l6 8 M44 62 l6 -8 l6 8" fill="${dk}" stroke="${shade(c, -0.5)}" stroke-width="1.5"/>`;
}

export function heroSvg(id, colorIdx) {
  const hero = HEROES.find((h) => h.id === id) || HEROES[0];
  const c = COLORS[colorIdx ?? hero.color] || COLORS[hero.color];
  const art = id === 'lego' ? lego(c) : (BUILD[hero.id] || BUILD.nhen)(c);
  return `<svg viewBox="-4 -12 112 142" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${hero.name}">${art}</svg>`;
}
