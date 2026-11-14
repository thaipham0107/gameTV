// Chế độ Thử thách: khủng long chạy vô tận, nói đúng từ trước khi chướng ngại tới thì khủng long nhảy qua.
// Sai nhịp (hết giờ) thì chết. Câu càng về sau càng dài, càng nhanh.
import { loadBank } from './data.js';
import { hasSpeechRecognition, primeMic, listen, judge } from './speech.js';
import { sfx } from './audio.js';

const W = 800;
const H = 220;
const GROUND = 176; // y của mặt đất
const DX = 70; // x của khủng long
const PX = 2; // kích thước một ô điểm ảnh của khủng long
const JUMP_TIME = 0.7;
const JUMP_H = 78;
const BEST_KEY = 'dau-quai-vat.run.v1';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ----- Hình khủng long (vẽ bằng ô điểm ảnh) -----
const DINO_BODY = [
  '..............#########.',
  '.............###########',
  '.............###.#######',
  '.............###########',
  '.............###########',
  '.............#####......',
  '.............#######....',
  '#...........#####.......',
  '#..........######.......',
  '##.........######..#....',
  '###.......#######.##....',
  '####.....##########.....',
  '.###################....',
  '..##################....',
  '...################.....',
  '....###############.....',
  '.....#############......',
  '......###########.......',
];
const LEGS = [
  ['.......####..###.......', '.......###....##........', '.......##.....###.......', '.......###....####......'],
  ['.......###..####.......', '.......##....###........', '.......###...##.........', '.......####..###........'],
];
const LEGS_STAND = ['.......####..####......', '.......###...###.......', '.......###...###.......', '.......####..####......'];
const DINO_W = 24 * PX;
const DINO_H = (DINO_BODY.length + 4) * PX;

function drawBitmap(ctx, rows, x, y, color) {
  ctx.fillStyle = color;
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') ctx.fillRect(x + c * PX, y + r * PX, PX, PX);
    }
  });
}

function drawDino(ctx, y, frame, dead, air, color, bg) {
  drawBitmap(ctx, DINO_BODY, DX, y, color);
  const legs = air || dead ? LEGS_STAND : LEGS[frame % 2];
  drawBitmap(ctx, legs, DX, y + DINO_BODY.length * PX, color);
  if (dead) {
    // mắt nhắm lại khi chết
    ctx.fillStyle = color;
    ctx.fillRect(DX + 16 * PX, y + 2 * PX, PX, PX);
  }
}

function drawCactus(ctx, ob, color) {
  const x = ob.x;
  const base = GROUND;
  ctx.fillStyle = color;
  for (let k = 0; k < ob.n; k++) {
    const cx = x + k * (ob.cw + 6);
    const h = ob.h - (k % 2) * 8;
    ctx.fillRect(cx + ob.cw / 2 - 4, base - h, 8, h); // thân
    ctx.fillRect(cx, base - h * 0.62, 6, 14); // tay trái
    ctx.fillRect(cx, base - h * 0.62 - 12, 6, 6);
    ctx.fillRect(cx + 6, base - h * 0.62 + 8, 4, 6);
    ctx.fillRect(cx + ob.cw - 6, base - h * 0.5, 6, 14); // tay phải
    ctx.fillRect(cx + ob.cw - 6, base - h * 0.5 - 12, 6, 6);
    ctx.fillRect(cx + ob.cw - 10, base - h * 0.5 + 8, 4, 6);
  }
}

// ----- Chọn câu theo độ khó tăng dần -----
function tierFor(cleared) {
  let t;
  if (cleared < 4) t = 1;
  else if (cleared < 9) t = 2;
  else if (cleared < 15) t = 3;
  else if (cleared < 22) t = 4;
  else if (cleared < 30) t = 5;
  else t = Math.random() < 0.5 ? 5 : 6;
  if (t > 1 && Math.random() < 0.2) t--; // thỉnh thoảng nhẹ tay một chút
  return t;
}

function makePicker(bank, scope, province) {
  const speak = bank.items.filter((it) => it.k === 's');
  const inProv = (it) => province === 'all' || (it.r && it.r.includes(province));
  const pools = { p: {}, v: [] };
  for (const it of speak) {
    if (it.s === 'p') (pools.p[it.t] ||= []).push(it);
    else if (inProv(it)) pools.v.push(it);
  }
  const used = new Set();
  const near = (t) => [1, 2, 3, 4, 5, 6].sort((a, b) => Math.abs(a - t) - Math.abs(b - t) || a - b);
  const take = (list) => {
    if (!list.length) return null;
    for (let k = 0; k < 8; k++) {
      const it = list[Math.floor(Math.random() * list.length)];
      if (!used.has(it.g)) return it;
    }
    return list[Math.floor(Math.random() * list.length)];
  };
  return (tier) => {
    let it = null;
    const wantV = scope === 'v' || (scope === 'all' && Math.random() < 0.25);
    if (wantV && pools.v.length) {
      const near3 = pools.v.filter((x) => Math.abs(x.t - tier) <= 1);
      it = take(near3.length ? near3 : pools.v);
    }
    for (const t of near(tier)) {
      if (it) break;
      it = take(pools.p[t] || []);
    }
    used.add(it.g);
    return { text: it.x, prompt: it.p, tier: it.t, words: it.x.split(' ').length };
  };
}

export function getRunBest() {
  try {
    return +localStorage.getItem(BEST_KEY) || 0;
  } catch {
    return 0;
  }
}
function setRunBest(v) {
  try {
    localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* bỏ qua */
  }
}

/** Mở màn hình Thử thách trong `root`. onExit() được gọi khi bấm thoát. */
export function startRunner({ root, scope, province, onExit }) {
  let best = getRunBest();
  let G = null; // trạng thái một ván
  let raf = 0;
  let alive = true; // false khi đã thoát khỏi màn hình này

  root.innerHTML = `
  <main class="runner">
    <header class="rn-top">
      <button class="icon-btn" id="rn-quit" aria-label="Thoát">✕</button>
      <div class="rn-title">🦖 Thử thách</div>
      <div class="rn-score" id="rn-score">00000</div>
    </header>
    <section class="rn-word" id="rn-word"></section>
    <div class="rn-stage" id="rn-stage"><canvas id="rn-cv"></canvas><div class="rn-over" id="rn-over" hidden></div></div>
    <div class="rn-heard" id="rn-heard">&nbsp;</div>
    <div class="rn-timebar" aria-hidden="true"><span id="rn-time"></span></div>
  </main>`;
  const $ = (id) => document.getElementById(id);
  const cv = $('rn-cv');
  const ctx = cv.getContext('2d');

  function fit() {
    const dpr = window.devicePixelRatio || 1;
    const cssW = cv.clientWidth || W;
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round((cssW * H * dpr) / W);
    ctx.setTransform(cv.width / W, 0, 0, cv.width / W, 0, 0);
  }
  window.addEventListener('resize', fit);
  fit();

  const exit = () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', fit);
    try {
      G?.rec?.stop();
    } catch {
      /* bỏ qua */
    }
    onExit();
  };
  $('rn-quit').onclick = exit;

  const palette = () => (G?.night ? { bg: '#202124', fg: '#c8c8c8' } : { bg: '#f7f7f7', fg: '#535353' });

  // ---------- Màn hình chờ ----------
  function drawIdle() {
    const c = palette();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c.fg;
    ctx.fillRect(0, GROUND, W, 2);
    drawDino(ctx, GROUND - DINO_H, 0, false, false, c.fg, c.bg);
  }

  function showIntro(extra = '') {
    drawIdle();
    $('rn-word').innerHTML = `<div class="rn-hint">Nói đúng từ hiện ra <b>trước khi</b> xương rồng tới để khủng long nhảy qua.<br>Hết giờ là… game over!</div>`;
    const over = $('rn-over');
    over.hidden = false;
    over.innerHTML = `${extra}<button class="btn big" id="rn-start">▶ Bắt đầu</button>${best ? `<div class="rn-best">Kỷ lục: ${String(best).padStart(5, '0')}</div>` : ''}`;
    $('rn-start').onclick = begin;
  }

  // ---------- Ván chơi ----------
  async function begin() {
    if (!hasSpeechRecognition) {
      $('rn-over').innerHTML = '<div class="rn-hint">Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy mở bằng Chrome, Edge hoặc Safari.</div>';
      return;
    }
    const over = $('rn-over');
    over.innerHTML = '<div class="rn-hint">⏳ Đang chuẩn bị…</div>';
    let pick;
    try {
      const bank = await loadBank();
      pick = makePicker(bank, scope, province);
    } catch (e) {
      console.error(e);
      over.innerHTML = '<div class="rn-hint">Không tải được kho câu hỏi. Kiểm tra mạng rồi thử lại.</div><button class="btn" id="rn-start">Thử lại</button>';
      $('rn-start').onclick = begin;
      return;
    }
    const denied = await primeMic();
    if (denied) {
      over.innerHTML = `<div class="rn-hint">${esc(denied)}</div><button class="btn" id="rn-start">Thử lại</button>`;
      $('rn-start').onclick = begin;
      return;
    }
    if (!alive) return;
    over.hidden = true;
    G = {
      pick,
      cleared: 0,
      dist: 0,
      ob: null,
      nextAt: 0.6, // giây tới lúc có chướng ngại đầu tiên
      t: 0,
      v: 150,
      speed: 150,
      jump: -1,
      frame: 0,
      frameT: 0,
      dead: false,
      night: false,
      tok: 0,
      rec: null,
      groundOff: 0,
      clouds: [
        { x: 120, y: 40 },
        { x: 420, y: 70 },
        { x: 700, y: 30 },
      ],
      flash: 0,
    };
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function spawn() {
    const q = G.pick(tierFor(G.cleared));
    const f = Math.max(0.55, 1 - 0.015 * G.cleared);
    const T = Math.max(1.8, (2.2 + 0.5 * q.words) * f); // số giây người chơi có để nói
    const n = q.tier >= 4 && Math.random() < 0.5 ? 2 : 1;
    const cw = 16 + Math.floor(Math.random() * 6);
    const ob = { ...q, x: W + 10, n, cw, h: 40 + Math.floor(Math.random() * 16), w: n * (cw + 6) - 6, solved: false, jumped: false, T };
    ob.v = (ob.x - (DX + DINO_W)) / T;
    G.ob = ob;
    G.startGap = ob.x - (DX + DINO_W);
    $('rn-word').innerHTML = q.prompt
      ? `<div class="rn-label">🗺️ Nói bằng tiếng phổ thông</div><div class="rn-say dia">${esc(q.prompt)}</div>`
      : `<div class="rn-say ${q.words > 12 ? 'long' : q.words > 5 ? 'mid' : ''}">${esc(q.text)}</div>`;
    $('rn-heard').innerHTML = '&nbsp;';
    startListen();
  }

  function startListen() {
    const ob = G.ob;
    if (!ob || ob.solved || G.dead || !alive) return;
    const tok = ++G.tok;
    G.rec = listen({
      onInterim: (t) => {
        if (tok !== G.tok || G.dead) return;
        $('rn-heard').textContent = `“${t}”`;
        const r = judge(ob.text, [t], ob.tier);
        if (r?.ok) solve(ob);
      },
      onDone: ({ alternatives, error }) => {
        if (tok !== G.tok || G.dead || !alive || ob.solved) return;
        if (alternatives.length) {
          const r = judge(ob.text, alternatives, ob.tier);
          if (r?.ok) return solve(ob);
          if (r) $('rn-heard').textContent = `Nghe được “${r.heard}” — thử lại!`;
        } else if (error) {
          $('rn-heard').textContent = error;
        }
        setTimeout(startListen, error ? 400 : 100);
      },
    });
  }

  function solve(ob) {
    if (ob.solved) return;
    ob.solved = true;
    G.tok++;
    try {
      G.rec?.stop();
    } catch {
      /* bỏ qua */
    }
    $('rn-word').firstElementChild?.classList.add('ok');
    $('rn-heard').textContent = '✔ Đúng rồi!';
  }

  function die() {
    G.dead = true;
    G.tok++;
    try {
      G.rec?.stop();
    } catch {
      /* bỏ qua */
    }
    sfx.lose();
    $('rn-heard').innerHTML = '&nbsp;';
    const score = scoreOf();
    const isBest = score > best;
    if (isBest) {
      best = score;
      setRunBest(best);
    }
    const over = $('rn-over');
    over.hidden = false;
    over.innerHTML = `<div class="rn-gameover">GAME OVER</div>
      <div class="rn-final">${isBest && score > 0 ? '🏆 Kỷ lục mới! ' : ''}Điểm: <b>${String(score).padStart(5, '0')}</b> · Vượt ${G.cleared} chướng ngại</div>
      <div class="rn-best">Kỷ lục: ${String(best).padStart(5, '0')}</div>
      <div class="actions"><button class="btn big" id="rn-again">↻ Chơi lại</button><button class="btn ghost" id="rn-share">Chia sẻ</button></div>`;
    $('rn-again').onclick = begin;
    $('rn-share').onclick = async () => {
      const text = `Mình chạy được ${score} điểm, vượt ${G.cleared} chướng ngại ở Thử thách 🦖 Đấu Quái Vật! Bạn đọc được bao nhiêu?`;
      try {
        if (navigator.share) await navigator.share({ text, url: location.href });
        else {
          await navigator.clipboard.writeText(`${text} ${location.href}`);
          $('rn-share').textContent = 'Đã sao chép ✓';
        }
      } catch {
        /* người dùng huỷ */
      }
    };
  }

  const scoreOf = () => G.cleared * 10 + Math.floor(G.dist / 100);

  let last = 0;
  function loop(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    if (!G.dead) raf = requestAnimationFrame(loop);
  }

  function update(dt) {
    G.t += dt;
    const ob = G.ob;
    // tốc độ cuộn nền bám theo tốc độ chướng ngại hiện tại
    const target = ob ? ob.v : 150;
    G.speed += (target - G.speed) * Math.min(1, dt * 3);
    G.dist += G.speed * dt;
    G.groundOff = (G.groundOff + G.speed * dt) % 40;
    G.frameT += dt;
    if (G.frameT > 0.1) {
      G.frameT = 0;
      G.frame++;
    }
    for (const c of G.clouds) {
      c.x -= G.speed * dt * 0.15;
      if (c.x < -60) c.x = W + 40 + Math.random() * 100;
    }

    // nhảy
    if (G.jump >= 0) {
      G.jump += dt;
      if (G.jump >= JUMP_TIME) G.jump = -1;
    }

    if (!ob) {
      if (G.t >= G.nextAt) spawn();
    } else {
      ob.x -= ob.v * dt;
      const gap = ob.x - (DX + DINO_W);
      // nói đúng rồi: tính thời điểm nhảy sao cho đỉnh nhảy trùng lúc đi qua chướng ngại
      const trig = Math.max(0, ob.v * (JUMP_TIME / 2) - (DINO_W * 0.7 + ob.w) / 2);
      if (ob.solved && !ob.jumped && gap <= trig) {
        ob.jumped = true;
        G.jump = 0;
        sfx.hit();
      }
      // va chạm
      const overlap = ob.x < DX + DINO_W - 10 && ob.x + ob.w > DX + 10;
      if (overlap && jumpY() < ob.h - 4) return die();
      // qua rồi
      if (ob.x + ob.w < DX - 10 && ob.jumped) {
        G.cleared++;
        G.ob = null;
        G.nextAt = G.t + 0.5;
        if (G.cleared % 10 === 0) G.night = !G.night; // đổi ngày/đêm như trò gốc
        if (G.cleared % 10 === 0) G.flash = 0.5;
        $('rn-word').innerHTML = '<div class="rn-hint">…</div>';
      }
    }
    $('rn-score').textContent = String(scoreOf()).padStart(5, '0');
    const gapNow = G.ob ? Math.max(0, G.ob.x - (DX + DINO_W)) : 0;
    $('rn-time').style.width = G.ob && !G.ob.solved ? `${(gapNow / G.startGap) * 100}%` : '0%';
    $('rn-time').classList.toggle('low', gapNow / (G.startGap || 1) < 0.3);
  }

  function jumpY() {
    if (G.jump < 0) return 0;
    const u = G.jump / JUMP_TIME;
    return 4 * JUMP_H * u * (1 - u);
  }

  function render() {
    const c = palette();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    // mây
    ctx.fillStyle = c.fg;
    ctx.globalAlpha = 0.25;
    for (const cl of G.clouds) {
      ctx.fillRect(cl.x, cl.y, 44, 8);
      ctx.fillRect(cl.x + 10, cl.y - 8, 24, 8);
    }
    ctx.globalAlpha = 1;
    // mặt đất
    ctx.fillStyle = c.fg;
    ctx.fillRect(0, GROUND, W, 2);
    for (let x = -G.groundOff; x < W; x += 40) {
      ctx.fillRect(x + 8, GROUND + 8, 10, 2);
      ctx.fillRect(x + 28, GROUND + 15, 4, 2);
    }
    if (G.ob) drawCactus(ctx, G.ob, c.fg);
    const y = GROUND - DINO_H - jumpY() + 2;
    drawDino(ctx, y, G.frame, G.dead, G.jump >= 0, c.fg, c.bg);
    // điểm cao
    ctx.fillStyle = c.fg;
    ctx.font = '700 16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HI ${String(best).padStart(5, '0')}`, W - 12, 22);
    if (G.flash > 0) {
      G.flash -= 0.016;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, G.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  showIntro();
}
