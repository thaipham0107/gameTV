// Sinh ngân hàng câu hỏi → src/bank.json.   Chạy: npm run build:bank
// Dùng từ điển Viet74K (GPLv2, tải về data/viet74k.txt, KHÔNG đưa vào repo) chỉ để kiểm tra từ khi sinh dữ liệu.
// Kết quả xác định (cùng seed → cùng dữ liệu).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { levelsForTier } from '../src/levels.js';
import { canon, decoysOf, isConfusable, capitalize, isCapitalized, mulberry32, splitPunct } from './bank/viet.mjs';
import * as V from './bank/vocab.mjs';
import { PROVERBS } from './bank/proverbs.mjs';
import { PROVINCES, WORDS as DIA_WORDS, PHRASES as DIA_PHRASES } from './bank/dialect.mjs';
import { SPEAK as L_SPEAK, BLANK as L_BLANK } from './bank/legacy.mjs';
import { FIND as L_FIND } from './bank/find-legacy.mjs';
import { SPEAK6, BLANK6 } from './bank/tier6.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DICT_PATH = path.join(root, 'data', 'viet74k.txt');
const DICT_URL = 'https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet74K.txt';

// Số lượng cần sinh (chỉnh để ra tổng ≥ 10.000 câu hỏi)
const TARGET = { words: 1250, t2: 820, t3: 900, t4: 650, t5: 420, t6: 300 };
const SEED = 20261111;
const rng = mulberry32(SEED);
const rand = (n) => Math.floor(rng() * n);
const pick = (a) => a[rand(a.length)];
function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Từ điển ----------
if (!fs.existsSync(DICT_PATH)) {
  console.log('Tải từ điển Viet74K…');
  const res = await fetch(DICT_URL);
  if (!res.ok) throw new Error(`Không tải được từ điển: ${res.status}`);
  fs.mkdirSync(path.dirname(DICT_PATH), { recursive: true });
  fs.writeFileSync(DICT_PATH, Buffer.from(await res.arrayBuffer()));
}
const dictLines = fs.readFileSync(DICT_PATH, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const words = new Set();
const bigrams = new Set();
const twoSyl = [];
for (const line of dictLines) {
  const w = canon(line);
  words.add(w);
  const parts = w.split(/[ -]/);
  if (parts.length === 2 && !w.includes('-')) bigrams.add(w);
  if (line === line.toLowerCase() && /^\p{L}+ \p{L}+$/u.test(line)) twoSyl.push(w);
}

// ---------- Âm tiết quen thuộc (lọc từ điển, tránh từ lạ / nhạy cảm) ----------
const SPLIT = /[\s,.;:?!“”"/|\[\]{}()\-]+/;
const wl = new Set();
const addText = (t) => t.split(SPLIT).filter(Boolean).forEach((s) => wl.add(canon(s)));
V.COMMON_SYLLABLES.forEach((s) => wl.add(canon(s)));
[V.MALE, V.FEMALE, V.SUBJECTS_FIXED, V.TIMES, V.NATURE_PHRASES, V.NATURE_SENTENCES, V.CLOSERS, PROVERBS].forEach((a) => a.forEach(addText));
V.VERB_ROWS.forEach((r) => [r.verb, ...r.objs, ...r.places].forEach(addText));
V.NP_GROUPS.forEach(([c, ns, as]) => [c, ...ns, ...as].forEach(addText));
DIA_WORDS.forEach((w) => addText(w[0]));
DIA_PHRASES.forEach((p) => addText(p[1]));
const NAMES = new Set([...V.MALE, ...V.FEMALE].map(canon));

// Lọc từ nhạy cảm cho trẻ em: theo từng âm tiết và theo cụm.
const BLOCK_SYL = new Set(`ỉa đái cứt đít đẻ nạo thai tinh dục lậu phản tội án giam trói ma quỷ ác hận oán nợ nghèo mồ xác thây tang bậy tục mụ đĩ điếm dâm đụ địt lồn cặc buồi đéo dái hiếp giết chết máu tử ngu đần khùng điên ngốc cút khốn gái nhục bú mông vú ngực cởi rượu bia thuốc súng bom đạn chém đâm đánh đập tù cướp trộm cắp lừa gạt dối bệnh đau ốm dịch hôn ôm tình mất thù khổ mộ sát tàn hại nát bẩn hôi thối dơ tật liệt câm điếc mù què thù`.split(/\s+/));
const BLOCK_PHRASE = /(giang mai|hoa liễu|ăn mày|mại dâm|lăng nhăng|chó đẻ)/;
const blocked = (w) => BLOCK_PHRASE.test(w) || w.split(' ').some((x) => BLOCK_SYL.has(x));

// ---------- Ngân hàng ----------
const items = [];
let gid = 0;
const groupLevel = new Map();
const seenText = new Set();

function levelFor(g, tier) {
  if (!groupLevel.has(g)) groupLevel.set(g, pick(levelsForTier(tier)));
  return groupLevel.get(g);
}

/** extra: { c: 'dia'|'prov', p: prompt, r: [tỉnh] } */
function push(k, tier, scope, g, x, extra = {}, anyLevel = false) {
  const key = `${k}|${x}|${extra.p || ''}`;
  if (seenText.has(key)) return false;
  seenText.add(key);
  items.push({ k, t: tier, v: anyLevel ? -1 : levelFor(g, tier), s: scope, g, x, ...extra });
  return true;
}

const countSyl = (t) => t.split(/\s+/).filter(Boolean).length;

// ----- phân tích câu để tìm chỗ đặt lỗi chính tả -----
function analyze(text, relaxed = false) {
  const toks = text.split(' ').map((raw) => {
    const [core, punct] = splitPunct(raw);
    return { core, punct, low: canon(core), cap: isCapitalized(core) };
  });
  const bg = (a, b) => !!a && !!b && bigrams.has(`${a} ${b}`);
  toks.forEach((t, i) => {
    t.decoys = [];
    if (NAMES.has(t.low) || !/^\p{L}+$/u.test(t.core)) return;
    const L = toks[i - 1]?.low;
    const R = toks[i + 1]?.low;
    const anchored = bg(L, t.low) || bg(t.low, R);
    t.anchored = anchored;
    for (const d of decoysOf(t.low)) {
      if (bg(L, d) || bg(d, R)) continue;
      if (!relaxed && !anchored && wl.has(d)) continue;
      t.decoys.push(t.cap ? capitalize(d) : d);
    }
  });
  return toks;
}

const confCount = (toks) => toks.filter((t) => !NAMES.has(t.low) && isConfusable(t.low)).length;
const render = (toks) => toks.map((t) => (t.out ?? t.core) + t.punct).join(' ');

function blankOf(toks, nOpts) {
  const cand = toks.map((t, i) => (t.decoys.length ? i : -1)).filter((i) => i >= 0);
  if (!cand.length) return null;
  const anchored = cand.filter((i) => toks[i].anchored);
  const i = anchored.length && rng() < 0.7 ? pick(anchored) : pick(cand);
  const t = toks[i];
  const opts = [t.core, ...shuffle(t.decoys).slice(0, nOpts - 1)];
  const copy = toks.map((x) => ({ ...x }));
  copy[i].out = `[${opts.join('|')}]`;
  return render(copy);
}

function findOf(toks, k) {
  const cand = toks.map((t, i) => (t.decoys.length ? i : -1)).filter((i) => i >= 0);
  if (cand.length < k) return null;
  const chosen = new Set();
  for (const i of shuffle(cand)) {
    if (chosen.size >= k) break;
    if (chosen.has(i - 1) || chosen.has(i + 1)) continue; // không chọn hai từ liền kề
    chosen.add(i);
  }
  if (chosen.size < k) return null;
  const copy = toks.map((x) => ({ ...x }));
  for (const i of chosen) copy[i].out = `{${pick(toks[i].decoys)}|${toks[i].core}}`;
  return render(copy);
}

const MIN_CONF = { 2: 2, 3: 3, 4: 5, 5: 8, 6: 11 };
const FIND_K = { 2: () => 1, 3: () => 1 + rand(2), 4: () => 2, 5: () => 2 + rand(2), 6: () => 3 };

/** Từ một câu gốc sinh các dạng: nói / điền từ / tìm lỗi. */
function addBase(text, tier, { relaxed = false, scope = 'p', extra = {}, minConf = MIN_CONF[tier] } = {}) {
  const toks = analyze(text, relaxed);
  if (confCount(toks) < minConf) return 0;
  const g = ++gid;
  let n = 0;
  if (push('s', tier, scope, g, text, extra)) n++;
  const b = blankOf(toks, tier >= 3 ? 3 : 2);
  if (b && push('b', tier, scope, g, b, extra)) n++;
  if (tier >= 2) {
    const k = FIND_K[tier]();
    const f = findOf(toks, k);
    if (f && push('f', tier, scope, g, f, extra)) n++;
  }
  return n;
}

// ---------- Tầng 1: từ ghép trong từ điển ----------
{
  let made = 0;
  for (const w of shuffle(twoSyl)) {
    if (made >= TARGET.words) break;
    const [a, b] = w.split(' ');
    if (a === b || a.length > 6 || b.length > 6) continue;
    if (!wl.has(a) || !wl.has(b) || blocked(w)) continue;
    const byPos = [0, 1].map((pos) => {
      const syl = pos ? b : a;
      return decoysOf(syl).filter((d) => !words.has(pos ? `${a} ${d}` : `${d} ${b}`));
    });
    const pos = byPos[0].length >= byPos[1].length ? 0 : 1;
    if (!byPos[pos].length) continue;
    const opts = [pos ? b : a, ...shuffle(byPos[pos]).slice(0, 2)];
    const text = pos ? `${a} [${opts.join('|')}]` : `[${opts.join('|')}] ${b}`;
    const g = ++gid;
    push('b', 1, 'p', g, text);
    push('s', 1, 'p', g, w);
    made++;
  }
}

// ---------- Ghép câu ----------
const SUBJECTS = [
  ...V.MALE.flatMap((n) => V.SUBJECTS_MALE(n)),
  ...V.FEMALE.flatMap((n) => V.SUBJECTS_FEMALE(n)),
  ...V.SUBJECTS_FIXED,
  ...V.SUBJECTS_FIXED,
];
const isBare = (s) => !s.includes(' ');
const mid = (s) => (isBare(s) ? s : s[0].toLowerCase() + s.slice(1)); // sau dấu phẩy / "và": viết thường danh xưng
const event = () => {
  const row = pick(V.VERB_ROWS);
  return { v: row.verb, o: pick(row.objs), p: pick(row.places) };
};
const full = (e) => `${e.v} ${e.o} ${e.p}`;
const short = (e) => `${e.v} ${e.o}`;
const sent = (s) => `${s}.`;

function genTier2() {
  if (rng() < 0.12) return pick(V.NATURE_PHRASES);
  const [cls, nouns, adjs] = pick(V.NP_GROUPS);
  return `${cls} ${pick(nouns)} ${pick(adjs)}`;
}
function genTier3() {
  if (rng() < 0.2) return pick(V.NATURE_SENTENCES);
  const e = event();
  return sent(`${pick(SUBJECTS)} ${rng() < 0.5 ? short(e) : full(e)}`);
}
function genTier4() {
  const e1 = event();
  const e2 = event();
  const r = rng();
  if (r < 0.45) return sent(`${pick(V.TIMES)}, ${mid(pick(SUBJECTS))} ${full(e1)} rồi ${short(e2)}`);
  if (r < 0.8) return sent(`${pick(V.TIMES)}, ${mid(pick(SUBJECTS))} ${full(e1)} và ${mid(pick(SUBJECTS))} ${full(e2)}`);
  return `${pick(V.NATURE_SENTENCES)} ${sent(`${pick(SUBJECTS)} ${full(e1)}`)}`;
}
function genTier5() {
  const e1 = event();
  const e2 = event();
  const e3 = event();
  const r = rng();
  if (r < 0.5) return `${sent(`${pick(V.TIMES)}, ${mid(pick(SUBJECTS))} ${full(e1)}`)} ${sent(`${pick(SUBJECTS)} ${full(e2)} rồi ${short(e3)}`)}`;
  if (r < 0.8) return `${pick(V.NATURE_SENTENCES)} ${sent(`${pick(SUBJECTS)} ${full(e1)} rồi ${short(e2)}`)}`;
  return `${sent(`${pick(V.TIMES)}, ${mid(pick(SUBJECTS))} ${full(e1)} rồi ${short(e2)}`)} ${pick(V.CLOSERS)}`;
}
function genTier6() {
  const e1 = event();
  const e2 = event();
  const e3 = event();
  const r = rng();
  if (r < 0.5) return `${sent(`${pick(V.TIMES)}, ${mid(pick(SUBJECTS))} ${full(e1)}`)} ${sent(`${pick(SUBJECTS)} ${full(e2)} rồi ${short(e3)}`)} ${pick(V.CLOSERS)}`;
  return `${pick(V.NATURE_SENTENCES)} ${sent(`${pick(SUBJECTS)} ${full(e1)} rồi ${short(e2)}`)} ${pick(V.CLOSERS)}`;
}

const SYL_RANGE = { 2: [3, 5], 3: [4, 9], 4: [10, 19], 5: [18, 34], 6: [28, 60] };
const GEN = { 2: genTier2, 3: genTier3, 4: genTier4, 5: genTier5, 6: genTier6 };
for (const tier of [2, 3, 4, 5, 6]) {
  let bases = 0;
  let guard = 0;
  while (bases < TARGET[`t${tier}`] && guard++ < 400000) {
    const text = GEN[tier]();
    const n = countSyl(text);
    if (n < SYL_RANGE[tier][0] || n > SYL_RANGE[tier][1]) continue;
    if (addBase(text, tier)) bases++;
  }
}

// ---------- Câu hỏi viết tay ban đầu ----------
for (const [, tiers] of Object.entries(L_SPEAK))
  for (const [tier, list] of Object.entries(tiers)) for (const x of list) push('s', +tier, 'p', ++gid, x);
for (const [, tiers] of Object.entries(L_BLANK))
  for (const [tier, list] of Object.entries(tiers)) for (const x of list) push('b', +tier, 'p', ++gid, x);
for (const [, tiers] of Object.entries(L_FIND))
  for (const [tier, list] of Object.entries(tiers)) for (const x of list) push('f', +tier, 'p', ++gid, x);
for (const list of Object.values(SPEAK6)) for (const x of list) push('s', 6, 'p', ++gid, x);
for (const list of Object.values(BLANK6)) for (const x of list) push('b', 6, 'p', ++gid, x);

// ---------- Ca dao, tục ngữ ----------
{
  const lines = PROVERBS.map((p) => {
    const t = p.split(' / ').join(', ');
    return capitalize(t.replace(/[.]$/, '')) + '.';
  });
  const tails = lines.map((l) => {
    const toks = l.split(' ');
    return { n: toks.length, tail: [toks.at(-2), toks.at(-1).replace(/[.]$/, '')].join(' ') };
  });
  lines.forEach((text, idx) => {
    const n = countSyl(text);
    const tier = n <= 7 ? 3 : n <= 12 ? 4 : n <= 24 ? 5 : 6;
    const extra = { c: 'prov' };
    const toks = analyze(text, true);
    const g = ++gid;
    push('s', tier, 'p', g, text, extra);
    const b = blankOf(toks, 3);
    if (b) push('b', tier, 'p', g, b, extra);
    // chọn phần kết đúng của câu
    const others = shuffle(tails.filter((_, j) => j !== idx && tails[j].tail !== tails[idx].tail)).slice(0, 2);
    const head = text.split(' ').slice(0, -2).join(' ');
    push('b', tier, 'p', g, `${head} [${tails[idx].tail}|${others.map((o) => o.tail).join('|')}].`, extra);
    const k = tier >= 4 ? 2 : 1;
    const f = findOf(toks, k);
    if (f) push('f', Math.max(tier, k === 1 ? 2 : 4), 'p', g, f, extra);
  });
}

// ---------- Tiếng vùng miền ----------
{
  const NORTHERN = new Set(['na', 'ht', 'qb', 'hue', 'qn', 'bd']); // Bắc Trung Bộ → Nam Trung Bộ
  const SOUTHERN = new Set(['sg', 'ct']);
  const inN = (provs) => provs.some((x) => NORTHERN.has(x));
  const inS = (provs) => provs.some((x) => SOUTHERN.has(x));
  const allStd = DIA_WORDS.map((w) => w[0]);
  const otherStd = (std, cat, n) => {
    const same = shuffle([...new Set(DIA_WORDS.filter((w) => w[3] === cat && w[0] !== std).map((w) => w[0]))]);
    const rest = shuffle([...new Set(allStd.filter((x) => x !== std && !same.includes(x)))]);
    return [...same, ...rest].slice(0, n);
  };
  for (const prov of PROVINCES) {
    for (const [std, dia, provs, cat] of DIA_WORDS.filter((w) => w[2].includes(prov.id))) {
      const g = ++gid;
      const ex = { c: 'dia', r: [prov.id] };
      push('b', 2, 'v', g, `Ở ${prov.name}, “${dia}” nghĩa là [${std}|${otherStd(std, cat, 2).join('|')}].`, ex, true);
      // đáp án nhiễu: từ địa phương của chữ phổ thông khác, tránh trùng nghĩa với std
      const wrongDia = shuffle([...new Set(DIA_WORDS.filter((w) => w[0] !== std && w[1] !== dia).map((w) => w[1]))]).slice(0, 2);
      push('b', 2, 'v', g, `Ở ${prov.name}, người ta nói “${std}” là [${dia}|${wrongDia.join('|')}].`, ex, true);
      // "Từ nào là tiếng X?": từ nhiễu lấy ở vùng đối lập hẳn (Nam Bộ ↔ Trung Bộ) để không nhầm
      const opposite = DIA_WORDS.filter((w) => (SOUTHERN.has(prov.id) ? inN(w[2]) && !inS(w[2]) : inS(w[2]) && !inN(w[2])));
      if (opposite.length) push('b', 2, 'v', g, `Từ nào là tiếng ${prov.name}? [${dia}|${std}|${pick(opposite)[1]}]`, ex, true);
      // "thuộc vùng nào": chỉ hỏi với từ chỉ có ở một phía, tỉnh nhiễu ở phía đối diện
      if (inN(provs) !== inS(provs)) {
        const wrong = shuffle(PROVINCES.filter((q) => (inN(provs) ? SOUTHERN.has(q.id) : ['na', 'ht', 'qb'].includes(q.id))).map((q) => q.name)).slice(0, 2);
        if (wrong.length === 2) push('b', 3, 'v', g, `Từ “${dia}” là tiếng của [${prov.name}|${wrong.join('|')}].`, ex, true);
      }
    }
  }
  for (const [dia, std, provs] of DIA_PHRASES) {
    const g = ++gid;
    const ex = { c: 'dia', r: provs };
    const n = countSyl(std);
    const tier = n <= 6 ? 3 : n <= 9 ? 4 : 5;
    push('s', tier, 'v', g, std, { ...ex, p: dia }, true);
    const wrong = shuffle(DIA_PHRASES.filter((q) => q[1] !== std).map((q) => q[1])).slice(0, 2);
    push('b', tier, 'v', g, `“${dia}” nghĩa là: [${std}|${wrong.join('|')}]`, ex, true);
  }
}

// ---------- Kiểm tra và ghi ----------
for (const it of items) {
  if (it.k === 'b') {
    const m = it.x.match(/\[([^\]]+)\]/g);
    if (!m || m.length !== 1 || it.x.match(/\[([^\]]+)\]/)[1].split('|').length < 2) throw new Error(`blank lỗi: ${it.x}`);
  }
  if (it.k === 'f' && !/\{[^|}]+\|[^}]+\}/.test(it.x)) throw new Error(`find lỗi: ${it.x}`);
}
const json = JSON.stringify(items);
let h = 5381;
for (let i = 0; i < json.length; i++) h = ((h << 5) + h + json.charCodeAt(i)) >>> 0;
const bank = { version: h.toString(36), items };
fs.writeFileSync(path.join(root, 'src', 'bank.json'), JSON.stringify(bank));

const by = (f) => items.reduce((m, it) => ((m[f(it)] = (m[f(it)] || 0) + 1), m), {});
console.log('Tổng:', items.length, '· phiên bản', bank.version);
console.log('Theo dạng:', by((i) => i.k), '· phạm vi:', by((i) => i.s));
console.log('Theo độ khó:', by((i) => i.t));
console.log('Theo cấp:', by((i) => i.v));
console.log('Kích thước:', (fs.statSync(path.join(root, 'src', 'bank.json')).size / 1024).toFixed(0), 'KB');
