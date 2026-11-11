// Kiểm tra ngân hàng câu hỏi, cách dựng ván và hàm chấm điểm: chạy bằng `npm run validate`.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LEVELS, MONSTERS, PROVINCES, buildQuiz, useBank, levelsForTier } from '../src/data.js';
import { judge, alignWords } from '../src/speech.js';

const bank = JSON.parse(fs.readFileSync(new URL('../src/bank.json', import.meta.url), 'utf8'));
const items = bank.items;
useBank(bank);

// 1. Quy mô và định dạng
assert.ok(items.length >= 10000, `ngân hàng chỉ có ${items.length} câu (cần ≥ 10.000)`);
const seen = new Set();
for (const it of items) {
  const key = `${it.k}|${it.x}|${it.p || ''}`;
  assert.ok(!seen.has(key), `trùng câu: ${it.x}`);
  seen.add(key);
  assert.ok(['s', 'b', 'f'].includes(it.k) && it.t >= 1 && it.t <= 6 && ['p', 'v'].includes(it.s), `mục sai: ${JSON.stringify(it)}`);
  if (it.k === 'b') {
    const m = it.x.match(/\[([^\]]+)\]/g);
    assert.equal(m?.length, 1, `blank cần đúng 1 chỗ trống: ${it.x}`);
    const opts = it.x.match(/\[([^\]]+)\]/)[1].split('|');
    assert.ok(opts.length >= 2 && new Set(opts).size === opts.length, `lựa chọn không hợp lệ: ${it.x}`);
  }
  if (it.k === 'f') {
    const n = (it.x.match(/\{[^|}]+\|[^}]+\}/g) || []).length;
    assert.ok(n >= 1, `find cần ≥1 từ sai: ${it.x}`);
    if (it.t >= 4 && !it.c) assert.ok(n >= 2, `độ khó ≥4 cần ≥2 từ sai: ${it.x}`);
  }
  if (it.s === 'v') assert.ok(it.r?.length, `câu vùng miền thiếu tỉnh: ${it.x}`);
}

// 2. Mỗi nhóm câu gốc chỉ thuộc một cấp, và cấp đó phải có độ khó của câu trong ramp
const lvOf = new Map();
for (const it of items) {
  if (it.v === -1) continue;
  assert.ok(levelsForTier(it.t).includes(it.v), `câu độ khó ${it.t} không thuộc cấp ${it.v}: ${it.x}`);
  if (lvOf.has(it.g)) assert.equal(lvOf.get(it.g), it.v, `nhóm ${it.g} thuộc nhiều cấp`);
  lvOf.set(it.g, it.v);
}

// 3. Mỗi cấp có đủ câu mỗi dạng ở mỗi độ khó cần dùng (phạm vi phổ thông)
for (let lv = 0; lv < LEVELS.length; lv++) {
  for (let t = LEVELS[lv].ramp[0]; t <= LEVELS[lv].ramp[1]; t++) {
    for (const k of ['s', 'b', ...(t >= 2 ? ['f'] : [])]) {
      const n = items.filter((i) => i.s === 'p' && i.v === lv && i.t === t && i.k === k).length;
      assert.ok(n >= 40, `cấp ${lv + 1}, độ khó ${t}, dạng ${k}: chỉ có ${n} câu`);
    }
  }
}

// 4. Số câu mỗi cấp tăng 10 câu, mỗi 10 câu một quái vật
LEVELS.forEach((lv, i) => {
  assert.equal(lv.count, 20 + 10 * i);
  assert.equal(MONSTERS[i].length, lv.count / 10);
});

// 5. Dựng ván: đủ số câu, độ khó không giảm, không lặp câu gốc, không lặp giữa các cấp
const allIds = [];
for (let lv = 0; lv < LEVELS.length; lv++) {
  for (const mode of ['both', 'speak', 'choose']) {
    const quiz = await buildQuiz(lv, { scope: 'p', mode });
    assert.equal(quiz.length, LEVELS[lv].count);
    assert.equal(new Set(quiz.map((q) => q.g)).size, quiz.length, 'lặp câu gốc trong một ván');
    for (let i = 1; i < quiz.length; i++) assert.ok(quiz[i].askTier >= quiz[i - 1].askTier, 'độ khó giảm');
    if (mode === 'speak') assert.ok(quiz.every((q) => q.kind === 'speak'));
    if (mode === 'choose') assert.ok(quiz.every((q) => q.kind !== 'speak'));
    if (mode === 'both') allIds.push(quiz.map((q) => q.g));
  }
}
const flat = allIds.flat();
assert.equal(new Set(flat).size, flat.length, 'có câu lặp giữa các cấp');

// 6. Vùng miền: từng tỉnh và tất cả, mọi cấp
for (const province of ['all', ...PROVINCES.map((p) => p.id)]) {
  for (const lv of [0, 5]) {
    const quiz = await buildQuiz(lv, { scope: 'v', province, mode: 'both' });
    assert.equal(quiz.length, LEVELS[lv].count);
    for (const q of quiz) {
      const it = items[q.id];
      assert.equal(it.s, 'v');
      if (province !== 'all') assert.ok(it.r.includes(province), `${q.id} không thuộc ${province}`);
    }
  }
}
const mixed = await buildQuiz(2, { scope: 'all', mode: 'both' });
assert.equal(mixed.length, LEVELS[2].count);

// 7. Chấm điểm nói
assert.ok(judge('lá non', ['Lá non.'], 1).ok);
assert.ok(!judge('lá non', ['ná lon'], 1).ok);
assert.ok(!judge('lá non', ['lá'], 1).ok);
assert.ok(judge('Nam nuôi con lợn nái nâu', ['nam nuôi con lợn nái nâu'], 3).ok);
assert.ok(!judge('Nam nuôi con lợn nái nâu', ['lam nuôi con lợn lái lâu'], 3).ok);
assert.deepEqual(alignWords('lá non', 'ná non').matched, [false, true]);
assert.ok(judge('lá non', ['ná lon', 'lá non'], 1).ok, 'phải lấy phương án tốt nhất');

const by = (f) => items.reduce((m, i) => ((m[f(i)] = (m[f(i)] || 0) + 1), m), {});
console.log(`OK · ${items.length} câu hỏi · dạng`, by((i) => i.k), '· phạm vi', by((i) => i.s));
