// Tiện ích tiếng Việt cho bộ sinh ngân hàng câu hỏi.

export const INITIALS = ['ngh', 'ng', 'nh', 'ch', 'tr', 'th', 'ph', 'kh', 'gh', 'gi', 'qu', 'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'];

// Đổi phụ âm đầu dễ nhầm
const INIT_SWAP = { l: ['n'], n: ['l'], s: ['x'], x: ['s'], ch: ['tr'], tr: ['ch'], r: ['d', 'gi'], d: ['r', 'gi'], gi: ['d', 'r'] };

// Đổi dấu hỏi ↔ ngã
const TONE_SWAP = {
  ả: 'ã', ã: 'ả', ẻ: 'ẽ', ẽ: 'ẻ', ỉ: 'ĩ', ĩ: 'ỉ', ỏ: 'õ', õ: 'ỏ', ủ: 'ũ', ũ: 'ủ', ỷ: 'ỹ', ỹ: 'ỷ',
  ở: 'ỡ', ỡ: 'ở', ể: 'ễ', ễ: 'ể', ổ: 'ỗ', ỗ: 'ổ', ử: 'ữ', ữ: 'ử', ẳ: 'ẵ', ẵ: 'ẳ', ẩ: 'ẫ', ẫ: 'ẩ',
};

export const nfc = (s) => s.normalize('NFC');

/** Đưa cách đặt dấu kiểu cũ (hoà, thuỷ) về kiểu mới (hòa, thủy) để so với từ điển. */
export function canon(s) {
  return nfc(s)
    .toLowerCase()
    .replace(/o([àáảãạèéẻẽẹ])/g, (_, v) => ({ à: 'òa', á: 'óa', ả: 'ỏa', ã: 'õa', ạ: 'ọa', è: 'òe', é: 'óe', ẻ: 'ỏe', ẽ: 'õe', ẹ: 'ọe' })[v])
    .replace(/(?<!q)u([ýỳỷỹỵ])/g, (_, v) => ({ ý: 'úy', ỳ: 'ùy', ỷ: 'ủy', ỹ: 'ũy', ỵ: 'ụy' })[v]);
}

export function splitInitial(syl) {
  for (const i of INITIALS) if (syl.startsWith(i)) return [i, syl.slice(i.length)];
  return ['', syl];
}

const startsWithI = (rime) => /^[iíìỉĩị]/.test(rime);

/** Các âm tiết sai chính tả dễ nhầm với `syl` (chữ thường). */
export function decoysOf(syl) {
  const out = new Set();
  const [ini, rime] = splitInitial(syl);
  if (INIT_SWAP[ini] && rime) {
    for (const alt of INIT_SWAP[ini]) {
      if (alt === 'gi' && startsWithI(rime)) continue;
      if (ini === 'gi' && rime.length === 0) continue;
      out.add(alt + rime);
    }
  }
  for (let k = 0; k < syl.length; k++) {
    const sw = TONE_SWAP[syl[k]];
    if (sw) {
      out.add(syl.slice(0, k) + sw + syl.slice(k + 1));
      break;
    }
  }
  out.delete(syl);
  return [...out];
}

/** Âm tiết có dễ nhầm (phụ âm đầu cần luyện hoặc dấu hỏi/ngã)? */
export function isConfusable(syl) {
  return decoysOf(syl).length > 0;
}

export const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
export const isCapitalized = (s) => s && s[0] !== s[0].toLowerCase();

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tách token thành lõi chữ và dấu câu cuối. */
export function splitPunct(tok) {
  const m = tok.match(/^(.*?)([.,!?;:”"]*)$/);
  return [m[1], m[2]];
}
