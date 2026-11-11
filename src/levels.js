// Mỗi cấp nhiều hơn cấp trước 10 câu (cấp 1 = 20 câu); câu càng về sau càng khó và dài.
// Mở khoá: đạt cấp n thì mở cấp n+1; cấp cuối cần đúng 100% cấp liền trước (unlock: 'perfect').
export const LEVELS = [
  { name: 'Cấp 1 · Tập nói', icon: '🌱', desc: 'Từ 2 tiếng → cụm từ ngắn', ramp: [1, 2], count: 20 },
  { name: 'Cấp 2 · Chăm chỉ', icon: '🌿', desc: 'Từ ghép → câu ngắn', ramp: [1, 3], count: 30 },
  { name: 'Cấp 3 · Giỏi giang', icon: '🌳', desc: 'Cụm từ → câu dài', ramp: [2, 4], count: 40 },
  { name: 'Cấp 4 · Siêu đẳng', icon: '🔥', desc: 'Câu ngắn → đoạn văn', ramp: [3, 5], count: 50 },
  { name: 'Cấp 5 · Huyền thoại', icon: '👑', desc: 'Câu dài → đoạn văn dài', ramp: [4, 6], count: 60 },
  { name: 'Cấp 6 · Thần thoại', icon: '🐉', desc: 'Toàn đoạn văn dài, nhiều lỗi', ramp: [5, 6], count: 70, unlock: 'perfect' },
];

// Mỗi 10 câu gặp một quái vật: cấp n có count/10 quái vật.
export const MONSTERS = [
  [['🐛', 'Sâu Líu Lưỡi'], ['🐸', 'Ếch Ồm Ồm']],
  [['👻', 'Ma Lắp Bắp'], ['🦇', 'Dơi Nói Ngọng'], ['🕷️', 'Nhện Giăng Lỗi']],
  [['🦂', 'Bọ Cạp Sai Dấu'], ['🐊', 'Cá Sấu Sai Chữ'], ['🦈', 'Cá Mập Lẫn Âm'], ['🦖', 'Khủng Long Lẫn Lộn']],
  [['👹', 'Quỷ Lộn Âm'], ['🧌', 'Troll Chính Tả'], ['🧟', 'Thây Ma Lắp Bắp'], ['🦍', 'Khỉ Đột Ngọng'], ['🐲', 'Rồng Ngọng']],
  [['👽', 'Quái Vũ Trụ'], ['🤖', 'Robot Soát Lỗi'], ['🐙', 'Bạch Tuộc Líu Lưỡi'], ['🦑', 'Mực Khổng Lồ'], ['🧛', 'Ma Cà Rồng Sai Dấu'], ['🐉', 'Đại Ma Vương Ngọng']],
  [['💀', 'Bộ Xương Sai Chữ'], ['🧙', 'Phù Thủy Lẫn Âm'], ['🦹', 'Siêu Ác Nhân'], ['🐺', 'Sói Ngọng'], ['🦕', 'Rồng Cổ Đại'], ['😈', 'Quỷ Vương'], ['☠️', 'Chúa Tể Ngọng']],
];

export const STAGE_SIZE = 10; // mỗi 10 câu gặp một quái vật mới

export function tierAt(level, i, count = LEVELS[level].count) {
  const [a, b] = LEVELS[level].ramp;
  return Math.max(1, Math.min(6, Math.round(a + ((b - a) * i) / (count - 1))));
}

/** Các cấp có thể dùng câu hỏi độ khó `tier` (theo ramp của cấp). */
export function levelsForTier(tier) {
  return LEVELS.map((lv, i) => (lv.ramp[0] <= tier && tier <= lv.ramp[1] ? i : -1)).filter((i) => i >= 0);
}
