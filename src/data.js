// Nạp ngân hàng câu hỏi (src/bank.json, sinh bởi `npm run build:bank`) và dựng ván chơi.
//
// Mỗi câu trong ngân hàng: { k: 's'|'b'|'f', t: độ khó 1-6, v: cấp (-1 = dùng cho mọi cấp), s: 'p'|'v',
//   g: mã nhóm (các dạng của cùng một câu gốc), x: nội dung, p: gợi ý (vùng miền), r: tỉnh, c: 'dia'|'prov' }
//   s (nói): x = câu cần đọc      b (điền): "...[đúng|sai|sai]..." (đáp án đứng đầu)
//   f (tìm lỗi): "...{từ sai|từ đúng}..." (có thể nhiều từ sai)
import { LEVELS, MONSTERS, STAGE_SIZE, tierAt, levelsForTier } from './levels.js';
import { PROVINCES } from './provinces.js';
import { loadSeen } from './history.js';

export { LEVELS, MONSTERS, STAGE_SIZE, tierAt, levelsForTier, PROVINCES };

const rand = (n) => Math.floor(Math.random() * n);
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let bankPromise = null;
/** Dùng cho kiểm thử: nạp ngân hàng có sẵn thay vì import bank.json. */
export function useBank(bank) {
  bank.items.forEach((it, i) => (it.id = i));
  bankPromise = Promise.resolve(bank);
}

export function loadBank() {
  bankPromise ||= import('./bank.json').then((m) => {
    const bank = m.default;
    bank.items.forEach((it, i) => (it.id = i));
    return bank;
  });
  return bankPromise;
}

function parseBlank(src) {
  const m = src.match(/\[([^\]]+)\]/);
  const opts = m[1].split('|');
  return { before: src.slice(0, m.index), after: src.slice(m.index + m[0].length), answer: opts[0], options: shuffle(opts) };
}

function parseFind(src) {
  const tokens = src.split(' ').map((raw) => {
    const m = raw.match(/^(.*?)\{([^|]+)\|([^}]+)\}(.*)$/);
    if (!m) return { text: raw };
    return { text: m[1] + m[2] + m[4], wrong: true, right: m[1] + m[3] + m[4] };
  });
  return {
    tokens,
    wrongCount: tokens.filter((t) => t.wrong).length,
    full: tokens.map((t) => (t.wrong ? t.right : t.text)).join(' '),
  };
}

const KIND = { s: 'speak', b: 'blank', f: 'find' };

/** Chuyển một mục ngân hàng thành câu hỏi để hiển thị. */
export function toQuestion(it, askTier) {
  const base = { id: it.id, g: it.g, tier: it.t, askTier, tag: it.c || '', kind: KIND[it.k] };
  if (it.k === 's') return { ...base, text: it.x, prompt: it.p };
  if (it.k === 'b') return { ...base, ...parseBlank(it.x) };
  return { ...base, ...parseFind(it.x) };
}

/**
 * opts: { scope: 'p' | 'v' | 'all', province: 'all' | mã tỉnh, mode: 'both' | 'speak' | 'choose' }
 * Câu hỏi của mỗi cấp tách riêng (không lặp giữa các cấp), không lặp câu gốc trong một ván,
 * và ưu tiên những câu chưa từng gặp ở các lần chơi trước.
 */
export async function buildQuiz(level, { scope = 'p', province = 'all', mode = 'both' } = {}) {
  const bank = await loadBank();
  const seen = loadSeen(bank.version);
  const count = LEVELS[level].count;

  const inProv = (it) => province === 'all' || (it.r && it.r.includes(province));
  const pools = { p: [], v: [] };
  for (const it of bank.items) {
    if (it.s === 'p') pools.p.push(it);
    else if (inProv(it)) pools.v.push(it);
  }

  const usedG = new Set();
  const out = [];
  for (let i = 0; i < count; i++) {
    const tier = tierAt(level, i, count);
    // phạm vi của câu này
    let sc = scope;
    if (scope === 'all') sc = Math.random() < 0.25 && pools.v.length ? 'v' : 'p';
    // dạng câu
    const r = Math.random();
    let kind;
    if (mode === 'speak') kind = 's';
    else if (mode === 'choose') kind = sc === 'v' || r < 0.65 ? 'b' : 'f';
    else if (sc === 'v') kind = r < 0.3 ? 's' : 'b';
    else kind = r < 0.5 ? 's' : r < 0.8 ? 'b' : 'f';
    if (kind === 'f' && (tier < 2 || sc === 'v')) kind = mode === 'speak' ? 's' : 'b';

    const it = pickAny(pools, sc, scope === 'all', kind, tier, level, usedG, seen);
    if (!it) continue;
    usedG.add(it.g);
    out.push(toQuestion(it, tier));
  }
  return out;
}

// Mọi độ khó, gần `t` nhất trước (vùng miền có ít câu độ khó cao nên cần lùi xa hơn).
const NEAR = (t) => [1, 2, 3, 4, 5, 6].sort((x, y) => Math.abs(x - t) - Math.abs(y - t) || x - y);

function pickItem(pool, kind, tier, level, usedG, seen) {
  const levelOk = (it) => it.v === level || it.v === -1;
  const attempts = [
    // [đúng cấp?, chưa gặp?, độ khó gần đúng?]
    [true, true, false], [true, true, true], [false, true, false], [false, true, true],
    [true, false, false], [true, false, true], [false, false, false], [false, false, true],
  ];
  for (const [lvl, unseen, nearTier] of attempts) {
    for (const t of nearTier ? NEAR(tier).slice(1) : [tier]) {
      const c = pool.filter(
        (it) => it.k === kind && it.t === t && !usedG.has(it.g) && (!lvl || levelOk(it)) && (!unseen || !seen.has(it.g)),
      );
      if (c.length) return c[rand(c.length)];
    }
  }
  return null;
}

// Thứ tự thử: đúng dạng/phạm vi trước; hết câu mới (vd. một tỉnh ít câu) thì đổi dạng, rồi cho phép lặp trong ván.
function pickAny(pools, sc, crossScope, kind, tier, level, usedG, seen) {
  const kinds = [kind, ...['b', 's'].filter((k) => k !== kind)];
  const scopes = crossScope ? [sc, sc === 'p' ? 'v' : 'p'] : [sc];
  for (const used of [usedG, new Set()]) {
    for (const k of kinds) {
      for (const sp of scopes) {
        const it = pickItem(pools[sp], k, tier, level, used, seen);
        if (it) return it;
      }
    }
  }
  return null;
}
