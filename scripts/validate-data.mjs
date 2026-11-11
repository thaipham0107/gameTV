// Kiểm tra dữ liệu câu hỏi và hàm chấm điểm: chạy bằng `npm run validate`.
import assert from 'node:assert/strict';
import { ITEMS, SOUND_GROUPS, LEVELS, MONSTERS, buildQuiz } from '../src/data.js';
import { judge, alignWords } from '../src/speech.js';

// 1. Mỗi nhóm âm × độ khó phải đủ câu nói và câu chọn từ
for (const g of SOUND_GROUPS) {
  for (let tier = 1; tier <= 6; tier++) {
    const n = (kind) => ITEMS.filter((i) => i.group === g.id && i.tier === tier && i.kind === kind).length;
    assert.ok(n('speak') >= 3, `${g.id} tier ${tier}: thiếu câu nói (${n('speak')})`);
    assert.ok(n('blank') >= 3, `${g.id} tier ${tier}: thiếu câu điền từ (${n('blank')})`);
    if (tier >= 2) assert.ok(n('find') >= 1, `${g.id} tier ${tier}: thiếu câu tìm lỗi`);
    if (tier >= 3) assert.ok(n('find') >= 2, `${g.id} tier ${tier}: cần ≥2 câu tìm lỗi`);
  }
}

// 2. Câu hỏi hợp lệ
const ids = new Set();
for (const it of ITEMS) {
  assert.ok(!ids.has(it.id), `trùng id ${it.id}`);
  ids.add(it.id);
  if (it.kind === 'blank') {
    assert.ok(it.options.length >= 2 && new Set(it.options).size === it.options.length, `${it.id}: lựa chọn không hợp lệ`);
    assert.equal(it.options[0], it.answer);
  }
  if (it.kind === 'find') {
    assert.ok(it.wrongCount >= 1, `${it.id}: cần ít nhất 1 từ sai`);
    if (it.tier >= 4) assert.ok(it.wrongCount >= 2, `${it.id}: độ khó ≥4 cần ≥2 từ sai`);
  }
}

// 3. Số câu tăng 10 câu mỗi cấp, bắt đầu từ 20; mỗi 10 câu có một quái vật
LEVELS.forEach((lv, i) => {
  assert.equal(lv.count, 20 + 10 * i);
  assert.equal(MONSTERS[i].length, lv.count / 10);
});

// 3b. Ván chơi, độ khó không giảm, mọi tổ hợp cấp × chế độ × nhóm đều tạo được
for (let lv = 0; lv < LEVELS.length; lv++) {
  for (const mode of ['both', 'speak', 'choose']) {
    for (const groups of [SOUND_GROUPS.map((g) => g.id), ['ln'], ['dau']]) {
      const quiz = buildQuiz(lv, groups, mode);
      assert.equal(quiz.length, LEVELS[lv].count);
      assert.ok(quiz.every(Boolean), 'câu hỏi rỗng');
      for (let i = 1; i < quiz.length; i++) assert.ok(quiz[i].askTier >= quiz[i - 1].askTier, 'độ khó giảm');
      if (mode === 'speak') assert.ok(quiz.every((q) => q.kind === 'speak'));
      if (mode === 'choose') assert.ok(quiz.every((q) => q.kind !== 'speak'));
    }
  }
}

// 4. Chấm điểm nói
assert.ok(judge('lá non', ['Lá non.'], 1).ok);
assert.ok(!judge('lá non', ['ná lon'], 1).ok);
assert.ok(!judge('lá non', ['lá'], 1).ok);
assert.ok(judge('Nam nuôi con lợn nái nâu', ['nam nuôi con lợn nái nâu'], 3).ok);
assert.ok(!judge('Nam nuôi con lợn nái nâu', ['lam nuôi con lợn lái lâu'], 3).ok);
assert.deepEqual(alignWords('lá non', 'ná non').matched, [false, true]);
assert.ok(judge('lá non', ['ná lon', 'lá non'], 1).ok, 'phải lấy phương án tốt nhất');

console.log(`OK · ${ITEMS.length} câu hỏi`);
