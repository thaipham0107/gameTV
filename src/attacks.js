// Đòn tấn công riêng của từng nhân vật: bắn tơ, tia sét, đạn, gạch lego, băng, cánh hoa, chớp phép, sao.
import { fxState, burst } from './fx.js';

export const ATTACK_WORD = {
  web: 'TƠ NHỆN!',
  bolt: 'ĐÙNG!',
  bullet: 'PẰNG!',
  brick: 'BỐP!',
  ice: 'ĐÓNG BĂNG!',
  petal: 'HOA NỞ!',
  magic: 'RẦM!',
  star: 'LẤP LÁNH!',
};
export const IMPACT = {
  web: ['🕸️', '✨', '💫'],
  bolt: ['⚡', '💥', '✨'],
  bullet: ['💥', '✨', '🔸'],
  brick: ['🧱', '💥', '⭐'],
  ice: ['❄️', '💎', '✨'],
  petal: ['🌸', '🌺', '✨'],
  magic: ['⚡', '🔮', '✨'],
  star: ['⭐', '🌟', '✨'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function add(host, html, style, ms) {
  const el = document.createElement('div');
  el.innerHTML = html;
  el.style.cssText = `position:absolute;z-index:6;pointer-events:none;${style}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), ms);
  return el;
}

/** Bay một món đồ từ a tới b, có thể cong lên (arc px) và xoay. */
function fly(host, glyph, a, b, { size = 24, dur = 260, delay = 0, arc = 0, spin = 0, spreadY = 0 } = {}) {
  const el = add(host, glyph, `left:${a.x}px;top:${a.y}px;font-size:${size}px;line-height:1;opacity:0`, dur + delay + 120);
  const mx = (b.x - a.x) / 2;
  const my = (b.y - a.y + spreadY) / 2 - arc;
  el.animate(
    [
      { transform: 'translate(-50%,-50%) rotate(0deg) scale(.6)', opacity: 0 },
      { transform: 'translate(-50%,-50%) rotate(0deg) scale(.8)', opacity: 1, offset: 0.12 },
      { transform: `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px)) rotate(${spin / 2}deg) scale(1)`, opacity: 1, offset: 0.55 },
      { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y + spreadY}px)) rotate(${spin}deg) scale(1)`, opacity: 1 },
    ],
    { duration: dur, delay, easing: 'ease-in', fill: 'both' },
  );
}

function line(host, a, b, { color = '#fff', width = 4, glow = '#78909c', dur = 260, offset = 0 } = {}) {
  const dx = b.x - a.x;
  const dy = b.y - a.y + offset;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const el = add(host, '', `left:${a.x}px;top:${a.y}px;width:${len}px;height:${width}px;background:${color};border-radius:99px;box-shadow:0 0 8px ${glow};transform-origin:0 50%`, dur + 400);
  el.animate(
    [
      { transform: `rotate(${ang}deg) scaleX(0)`, opacity: 1 },
      { transform: `rotate(${ang}deg) scaleX(1)`, opacity: 1, offset: 0.6 },
      { transform: `rotate(${ang}deg) scaleX(1)`, opacity: 0 },
    ],
    { duration: dur + 250, easing: 'ease-out', fill: 'both' },
  );
}

function zigzag(host, a, b, color, core) {
  const W = host.clientWidth;
  const H = host.clientHeight;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts = [];
  const n = 8;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const j = k === 0 || k === n ? 0 : (Math.random() - 0.5) * 48;
    pts.push(`${(a.x + dx * t + nx * j).toFixed(1)},${(a.y + dy * t + ny * j).toFixed(1)}`);
  }
  const p = pts.join(' ');
  const el = add(
    host,
    `<svg width="${W}" height="${H}" style="display:block;overflow:visible"><polyline points="${p}" fill="none" stroke="${color}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/><polyline points="${p}" fill="none" stroke="${core}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    `left:0;top:0;filter:drop-shadow(0 0 6px ${color})`,
    560,
  );
  el.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0.3, offset: 0.45 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 440, fill: 'both' });
}

const capsule = '<i style="display:block;width:16px;height:6px;border-radius:4px;background:#ffd23f;box-shadow:0 0 6px #ff9f1c"></i>';
const brickEl = (col) => `<i style="display:block;width:22px;height:14px;border-radius:3px;background:${col};box-shadow:inset 0 -3px 0 #0003,0 -4px 0 -1px ${col}"></i>`;

/** Phóng đòn của nhân vật từ `from` tới `to` (toạ độ theo host). Trả về Promise khi đòn trúng. */
export async function shoot(host, type, from, to) {
  if (!fxState.on || !host) return sleep(160);
  switch (type) {
    case 'web':
      line(host, from, to, { offset: -10 });
      line(host, from, to, { width: 3 });
      line(host, from, to, { offset: 10 });
      return sleep(260);
    case 'bolt':
      zigzag(host, from, to, '#43d9ff', '#ffffff');
      zigzag(host, { x: from.x, y: from.y + 6 }, to, '#ffe066', '#fffbe0');
      return sleep(240);
    case 'magic':
      zigzag(host, from, to, '#b45cff', '#f3e0ff');
      return sleep(240);
    case 'bullet':
      burst(host, from.x + 6, from.y, { items: ['💥'], n: 2, spread: 22 });
      for (let k = 0; k < 4; k++) fly(host, capsule, from, to, { dur: 170, delay: k * 70, size: 12, spreadY: (k - 1.5) * 5 });
      return sleep(330);
    case 'brick':
      ['#e63946', '#ffd166', '#2f80ed'].forEach((col, k) => fly(host, brickEl(col), from, to, { dur: 300, delay: k * 80, arc: 40, spin: 360, size: 14, spreadY: (k - 1) * 10 }));
      return sleep(430);
    case 'ice':
      line(host, from, to, { color: 'linear-gradient(90deg,#fff,#8ee3ff)', width: 10, glow: '#7bd3ff' });
      for (let k = 0; k < 5; k++) fly(host, '❄️', from, to, { dur: 300, delay: k * 40, size: 20, spin: 240, spreadY: (k - 2) * 14 });
      return sleep(380);
    case 'petal':
      for (let k = 0; k < 7; k++) fly(host, k % 2 ? '🌸' : '🌺', from, to, { dur: 340, delay: k * 45, size: 22, arc: k % 2 ? 36 : -16, spin: 300, spreadY: (k - 3) * 6 });
      return sleep(480);
    case 'star':
      fly(host, '⭐', from, to, { dur: 300, size: 40, spin: 540 });
      for (let k = 0; k < 4; k++) fly(host, '✨', from, to, { dur: 300, delay: 40 + k * 40, size: 18 });
      return sleep(340);
    default:
      return sleep(300);
  }
}
