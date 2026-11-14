// Nhân vật chibi tự vẽ bằng SVG (không dùng nhân vật có bản quyền). Mỗi nhân vật đổi được màu trang phục
// và có kiểu tấn công riêng (xem ATTACKS, dùng trong fx.js).

export const COLORS = ['#e63946', '#1d7bd8', '#2fb36a', '#f4a62a', '#9b5de5', '#ec5fa3'];

export const HEROES = [
  { id: 'nhen', g: 'm', name: 'Siêu nhân Nhện', color: 0, attack: 'web' },
  { id: 'sat', g: 'm', name: 'Người Sắt', color: 0, attack: 'bolt' },
  { id: 'robot', g: 'm', name: 'Người máy', color: 1, attack: 'bullet' },
  { id: 'lego', g: 'm', name: 'Khủng long Lego', color: 2, attack: 'brick' },
  { id: 'bang', g: 'f', name: 'Công chúa Băng', color: 1, attack: 'ice' },
  { id: 'hoa', g: 'f', name: 'Công chúa Hoa', color: 5, attack: 'petal' },
  { id: 'phuthuy', g: 'f', name: 'Phù thủy nhí', color: 4, attack: 'magic' },
  { id: 'nusieu', g: 'f', name: 'Nữ siêu nhân', color: 5, attack: 'star' },
];

/** Vị trí bàn tay (tỉ lệ theo khung SVG) để bắn đòn ra từ đó. */
export const HAND = { x: 0.77, y: 0.655 };

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const SKIN = '#ffdcb8';
const INK = '#2b2d42';
const OUT = (c) => `stroke="${shade(c, -0.45)}" stroke-width="2" stroke-linejoin="round"`;

// ---- mặt chibi: mắt to long lanh, má hồng, miệng cười nhỏ ----
const eyes = (y = 45, col = INK) => `
  <ellipse cx="39" cy="${y}" rx="6" ry="7.6" fill="${col}"/><ellipse cx="61" cy="${y}" rx="6" ry="7.6" fill="${col}"/>
  <circle cx="37" cy="${y - 2.6}" r="2.6" fill="#fff"/><circle cx="59" cy="${y - 2.6}" r="2.6" fill="#fff"/>
  <circle cx="41.5" cy="${y + 2.8}" r="1.2" fill="#fff"/><circle cx="63.5" cy="${y + 2.8}" r="1.2" fill="#fff"/>`;
const blush = (y = 56) => `<ellipse cx="30" cy="${y}" rx="4.5" ry="3" fill="#ff8fa3" opacity=".55"/><ellipse cx="70" cy="${y}" rx="4.5" ry="3" fill="#ff8fa3" opacity=".55"/>`;
const smile = (y = 58) => `<path d="M45 ${y} Q50 ${y + 5.5} 55 ${y}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
const face = (o = {}) => `${eyes(o.eyeY, o.eyeCol)}${blush()}${smile()}`;

// ---- thân chibi: đầu to, thân nhỏ, tay phải giơ về phía quái ----
function body({ main, alt, shoe = INK, hand = SKIN, skirt = false, arm = alt, sleeveOnly = false }) {
  return `
  <rect x="38" y="98" width="10" height="13" rx="4.5" fill="${alt}" ${OUT(alt)}/><rect x="52" y="98" width="10" height="13" rx="4.5" fill="${alt}" ${OUT(alt)}/>
  <ellipse cx="42" cy="112.5" rx="8" ry="5" fill="${shoe}"/><ellipse cx="58" cy="112.5" rx="8" ry="5" fill="${shoe}"/>
  ${
    skirt
      ? `<path d="M37 84 L63 84 L78 108 Q50 118 22 108 Z" fill="${main}" ${OUT(main)}/>`
      : `<rect x="35" y="70" width="30" height="33" rx="12" fill="${main}" ${OUT(main)}/>`
  }
  <rect x="27" y="76" width="11" height="19" rx="5.5" fill="${arm}" ${OUT(arm)} transform="rotate(14 32 78)"/>
  <circle cx="30" cy="96" r="5.5" fill="${hand}"/>
  <rect x="60" y="75" width="26" height="11.5" rx="5.7" fill="${arm}" ${OUT(arm)}/>
  <circle cx="88.5" cy="81" r="6.8" fill="${hand}"/>`;
}

const head = (fill = SKIN, stroke = true) => `<circle cx="50" cy="40" r="31" fill="${fill}" ${stroke ? OUT(fill) : ''}/>`;

const eyePatch = `<path d="M24 44 Q36 24 48 44 Q36 58 24 48 Z" fill="#fff" stroke="${INK}" stroke-width="2.6"/><path d="M76 44 Q64 24 52 44 Q64 58 76 48 Z" fill="#fff" stroke="${INK}" stroke-width="2.6"/>`;

const BUILD = {
  nhen: (c) => `
    ${body({ main: c, alt: shade(c, -0.55), shoe: shade(c, -0.55), hand: c, arm: c })}
    <ellipse cx="50" cy="85" rx="3.6" ry="4.6" fill="${INK}"/><path d="M46 82 L40 78 M54 82 L60 78 M46 88 L40 92 M54 88 L60 92" stroke="${INK}" stroke-width="1.6"/>
    <circle cx="74" cy="82" r="3" fill="#cfd8dc" stroke="${INK}" stroke-width="1.4"/>
    ${head(c)}
    <path d="M50 9 V70 M20 40 H80 M26 18 Q50 38 24 62 M74 18 Q50 38 76 62" stroke="${shade(c, -0.5)}" stroke-width="1.6" fill="none" opacity=".7"/>
    ${eyePatch}
    <circle cx="36" cy="40" r="3" fill="${INK}" opacity=".0"/>
    <ellipse cx="29" cy="58" rx="4.5" ry="3" fill="#ff8fa3" opacity=".6"/><ellipse cx="71" cy="58" rx="4.5" ry="3" fill="#ff8fa3" opacity=".6"/>
    <path d="M45 61 Q50 66 55 61" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,

  sat: (c) => {
    const gold = '#f4c542';
    return `
    ${body({ main: c, alt: gold, shoe: gold, hand: gold, arm: c })}
    <circle cx="50" cy="84" r="7.5" fill="#bdf4ff" stroke="${gold}" stroke-width="2.4"/><circle cx="50" cy="84" r="3.4" fill="#fff"/>
    <circle cx="88.5" cy="81" r="3.4" fill="#bdf4ff"/>
    ${head(c)}
    <path d="M22 40 Q50 4 78 40 Z" fill="${shade(c, 0.1)}"/>
    <path d="M26 36 Q50 30 74 36 L70 62 Q50 72 30 62 Z" fill="${gold}" ${OUT(gold)}/>
    <path d="M31 43 Q39 38 47 45 L45 49 Q38 46 32 49 Z" fill="#e8fdff" stroke="${INK}" stroke-width="1.6"/><path d="M69 43 Q61 38 53 45 L55 49 Q62 46 68 49 Z" fill="#e8fdff" stroke="${INK}" stroke-width="1.6"/>
    <path d="M44 61 Q50 65 56 61" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="33" cy="55" rx="4" ry="2.6" fill="#ff8fa3" opacity=".5"/><ellipse cx="67" cy="55" rx="4" ry="2.6" fill="#ff8fa3" opacity=".5"/>`;
  },

  robot: (c) => `
    <line x1="50" y1="2" x2="50" y2="14" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="3" r="4.5" fill="#ff5d73" stroke="${INK}" stroke-width="2"/>
    ${body({ main: c, alt: '#8d99ae', shoe: INK, hand: '#d9dee7', arm: '#8d99ae' })}
    <rect x="76" y="76" width="22" height="10" rx="4" fill="#4a5568" ${OUT('#4a5568')}/><rect x="94" y="78" width="9" height="6" rx="2" fill="${INK}"/>
    <rect x="43" y="77" width="14" height="14" rx="4" fill="#fff3b0" stroke="${INK}" stroke-width="2"/><circle cx="50" cy="84" r="3.6" fill="${c}"/>
    <rect x="19" y="11" width="62" height="56" rx="22" fill="#e8edf3" ${OUT('#c9d2de')}/>
    <circle cx="19" cy="40" r="5" fill="#8d99ae"/><circle cx="81" cy="40" r="5" fill="#8d99ae"/>
    <rect x="26" y="25" width="48" height="30" rx="14" fill="${INK}"/>
    <circle cx="40" cy="40" r="8" fill="#3dd6d0"/><circle cx="60" cy="40" r="8" fill="#3dd6d0"/>
    <circle cx="37.5" cy="37" r="2.8" fill="#fff"/><circle cx="57.5" cy="37" r="2.8" fill="#fff"/>
    <path d="M44 61 Q50 66 56 61" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,

  bang: (c) => `
    <path d="M30 62 Q4 92 14 114 L44 104 Z" fill="#d6f1ff" opacity=".8"/>
    <path d="M26 40 Q6 60 20 100 Q30 80 36 56 Z" fill="#f4efdc" ${OUT('#f4efdc')}/>
    ${body({ main: c, alt: shade(c, 0.45), shoe: shade(c, -0.3), skirt: true, arm: shade(c, 0.55) })}
    <path d="M30 100 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0" stroke="#fff" stroke-width="2.4" fill="none" opacity=".85"/>
    <path d="M50 74 v12 M44 80 h12 M45.5 75.5 l9 9 M54.5 75.5 l-9 9" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
    ${head()}
    <path d="M19 42 Q16 6 50 8 Q84 6 81 42 Q76 22 62 22 Q50 30 38 22 Q24 22 19 42 Z" fill="#f4efdc" ${OUT('#f4efdc')}/>
    <path d="M30 58 Q22 74 30 92" stroke="#f4efdc" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="94" r="5" fill="#8ecbff"/>
    ${face({ eyeCol: '#2f6fd6' })}
    <path d="M38 12 L41 3 L46 10 L50 0 L54 10 L59 3 L62 12 Z" fill="#bdeaff" stroke="#5aa9e6" stroke-width="1.6" stroke-linejoin="round"/>`,

  hoa: (c) => `
    <path d="M20 44 Q8 70 22 98 Q30 78 34 54 Z" fill="#7a4a2b" ${OUT('#7a4a2b')}/><path d="M80 44 Q92 70 78 98 Q70 78 66 54 Z" fill="#7a4a2b" ${OUT('#7a4a2b')}/>
    ${body({ main: c, alt: shade(c, 0.4), shoe: shade(c, -0.4), skirt: true, arm: shade(c, 0.5) })}
    <path d="M26 104 Q50 118 74 104" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/><circle cx="50" cy="80" r="4.4" fill="#ffd166" stroke="#e0a800" stroke-width="1.4"/>
    ${head()}
    <path d="M19 44 Q14 6 50 8 Q86 6 81 44 Q76 22 62 20 Q50 28 38 20 Q24 22 19 44 Z" fill="#7a4a2b" ${OUT('#7a4a2b')}/>
    ${face({ eyeCol: '#6b3f2a' })}
    ${[24, 37, 50, 63, 76].map((x, i) => `<g transform="translate(${x} ${i % 2 ? 11 : 14})"><circle r="3" fill="#ffd166"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5.6" rx="3" ry="4.4" fill="${i % 2 ? '#fff' : '#ffc2d9'}" stroke="#f08cb4" stroke-width=".8" transform="rotate(${a})"/>`).join('')}</g>`).join('')}`,

  phuthuy: (c) => {
    const dk = shade(c, -0.45);
    return `
    <path d="M20 44 Q10 70 24 92 Q30 72 34 54 Z" fill="${dk}"/><path d="M80 44 Q90 70 76 92 Q70 72 66 54 Z" fill="${dk}"/>
    ${body({ main: c, alt: dk, shoe: INK, skirt: true, arm: c })}
    <path d="M44 80 a7 7 0 1 0 8 8 a5.5 5.5 0 1 1 -8 -8 z" fill="#ffd166"/>
    <line x1="90" y1="86" x2="106" y2="48" stroke="#8d5524" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M106 38 l2.6 5.6 l6 .8 l-4.4 4.2 l1.2 6 l-5.4 -3 l-5.4 3 l1.2 -6 l-4.4 -4.2 l6 -.8 z" fill="#ffe066" stroke="#e0a800" stroke-width="1.2" transform="translate(-6 -6) scale(.9)"/>
    ${head()}
    <path d="M19 46 Q16 18 50 16 Q84 18 81 46 Q76 28 62 28 Q50 34 38 28 Q24 28 19 46 Z" fill="${dk}"/>
    ${face({ eyeY: 47, eyeCol: '#4b2c82' })}
    <path d="M10 26 Q50 40 90 26 L88 18 Q50 30 12 18 Z" fill="${dk}" ${OUT(dk)}/>
    <path d="M26 24 L54 -10 L78 24 Z" fill="${c}" ${OUT(c)}/>
    <rect x="26" y="19" width="52" height="7" rx="3" fill="#ffd166"/>
    <path d="M56 6 l2 4.6 l5 .6 l-3.6 3.4 l1 5 l-4.4 -2.5 l-4.4 2.5 l1 -5 l-3.6 -3.4 l5 -.6 z" fill="#ffe066"/>`;
  },

  nusieu: (c) => `
    <path d="M34 66 L10 112 L46 102 L58 102 Z" fill="${shade(c, -0.3)}" ${OUT(c)}/>
    <path d="M72 18 Q96 14 92 46 Q88 34 80 38 Z" fill="#3b2a2a" ${OUT('#3b2a2a')}/><circle cx="76" cy="22" r="7" fill="${c}"/>
    ${body({ main: c, alt: '#fff', shoe: shade(c, -0.35), arm: c, hand: SKIN })}
    <path d="M35 96 H65" stroke="#ffd166" stroke-width="4"/>
    <path d="M50 74 l3 6 l6.5 .8 l-4.8 4.5 l1.3 6.4 l-6 -3.2 l-6 3.2 l1.3 -6.4 l-4.8 -4.5 l6.5 -.8 z" fill="#ffe066" stroke="#e0a800" stroke-width="1.2"/>
    ${head()}
    <path d="M19 44 Q14 6 50 8 Q86 6 81 44 Q76 22 62 20 Q50 28 38 20 Q24 22 19 44 Z" fill="#3b2a2a" ${OUT('#3b2a2a')}/>
    <path d="M24 38 Q50 30 76 38 L74 52 Q50 46 26 52 Z" fill="${c}" opacity=".95"/>
    <ellipse cx="39" cy="43" rx="6" ry="6.4" fill="#fff"/><ellipse cx="61" cy="43" rx="6" ry="6.4" fill="#fff"/>
    <circle cx="40" cy="44" r="3.8" fill="${INK}"/><circle cx="62" cy="44" r="3.8" fill="${INK}"/><circle cx="38.8" cy="42.6" r="1.4" fill="#fff"/><circle cx="60.8" cy="42.6" r="1.4" fill="#fff"/>
    ${blush(58)}${smile(60)}`,
};

// khủng long lắp ghép: đầu to tròn, thân nhỏ, có núm lego
function lego(c) {
  const dk = shade(c, -0.3), lt = shade(c, 0.4), ol = shade(c, -0.5);
  const stud = (x, y) => `<rect x="${x}" y="${y}" width="10" height="6" rx="2.4" fill="${lt}" stroke="${ol}" stroke-width="1.4"/>`;
  return `
  <path d="M30 94 L6 98 Q2 108 12 112 L36 106 Z" fill="${dk}" ${OUT(c)}/>
  <rect x="36" y="98" width="11" height="14" rx="4" fill="${dk}" ${OUT(c)}/><rect x="54" y="98" width="11" height="14" rx="4" fill="${dk}" ${OUT(c)}/>
  <rect x="33" y="110" width="17" height="7" rx="3" fill="${INK}"/><rect x="52" y="110" width="17" height="7" rx="3" fill="${INK}"/>
  <rect x="32" y="68" width="38" height="36" rx="10" fill="${c}" ${OUT(c)}/>
  <rect x="40" y="76" width="22" height="22" rx="7" fill="${lt}" opacity=".7"/>
  ${stud(38, 63)}${stud(52, 63)}
  <rect x="62" y="76" width="22" height="11" rx="5.5" fill="${c}" ${OUT(c)}/><circle cx="86" cy="81" r="6.5" fill="${lt}" stroke="${ol}" stroke-width="2"/>
  <path d="M24 66 l6 -9 l6 9 M70 66 l6 -9 l6 9" fill="${dk}" stroke="${ol}" stroke-width="1.6" stroke-linejoin="round"/>
  <rect x="16" y="8" width="72" height="58" rx="26" fill="${c}" ${OUT(c)}/>
  ${stud(26, 2)}${stud(42, 2)}${stud(58, 2)}
  <rect x="50" y="42" width="44" height="22" rx="10" fill="${lt}" ${OUT(c)}/>
  <circle cx="86" cy="50" r="2" fill="${ol}"/>
  <path d="M60 58 Q72 66 84 58" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M62 60 l3 5 l3 -5 M72 62 l3 5 l3 -5" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
  <circle cx="52" cy="30" r="10" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="55" cy="31" r="5.6" fill="${INK}"/><circle cx="53" cy="28.4" r="2.2" fill="#fff"/>
  <circle cx="30" cy="30" r="7" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="32" cy="31" r="4" fill="${INK}"/><circle cx="30.6" cy="29" r="1.6" fill="#fff"/>
  <ellipse cx="42" cy="52" rx="5" ry="3.2" fill="#ff8fa3" opacity=".55"/>`;
}

export function heroSvg(id, colorIdx) {
  const hero = HEROES.find((h) => h.id === id) || HEROES[0];
  const c = COLORS[colorIdx ?? hero.color] || COLORS[hero.color];
  const art = hero.id === 'lego' ? lego(c) : BUILD[hero.id](c);
  return `<svg viewBox="-2 -12 118 142" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${hero.name}">${art}</svg>`;
}
