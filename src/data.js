// Dữ liệu câu hỏi. Độ khó (tier) 1 → 5:
//   1 = từ 2 tiếng · 2 = cụm 3-4 tiếng · 3 = câu ngắn · 4 = câu dài · 5 = đoạn 2 câu
// Quy ước:
//   SPEAK : câu cần đọc to
//   BLANK : "...[đúng|sai|sai]..." chọn từ đúng điền vào chỗ trống (đáp án đứng ĐẦU)
//   FIND  : "...{từ sai|từ đúng}..." bấm vào từ viết sai

export const SOUND_GROUPS = [
  { id: 'ln', label: 'l / n' },
  { id: 'sx', label: 's / x' },
  { id: 'chtr', label: 'ch / tr' },
  { id: 'rdgi', label: 'r / d / gi' },
  { id: 'dau', label: 'hỏi / ngã' },
];

export const LEVELS = [
  { name: 'Cấp 1 · Tập nói', icon: '🌱', desc: 'Từ 2 tiếng → cụm từ ngắn', ramp: [1, 2] },
  { name: 'Cấp 2 · Chăm chỉ', icon: '🌿', desc: 'Từ ghép → câu ngắn', ramp: [1, 3] },
  { name: 'Cấp 3 · Giỏi giang', icon: '🌳', desc: 'Cụm từ → câu dài', ramp: [2, 4] },
  { name: 'Cấp 4 · Siêu đẳng', icon: '🔥', desc: 'Câu ngắn → đoạn văn', ramp: [3, 5] },
  { name: 'Cấp 5 · Huyền thoại', icon: '👑', desc: 'Câu dài → đoạn văn dài', ramp: [4, 5] },
];

export const MONSTERS = [
  [['🐛', 'Sâu Líu Lưỡi'], ['🐸', 'Ếch Ồm Ồm'], ['🐢', 'Rùa Chậm Chữ']],
  [['👻', 'Ma Lắp Bắp'], ['🦇', 'Dơi Nói Ngọng'], ['🕷️', 'Nhện Giăng Lỗi']],
  [['🦂', 'Bọ Cạp Sai Dấu'], ['🐊', 'Cá Sấu Sai Chữ'], ['🦖', 'Khủng Long Lẫn Lộn']],
  [['👹', 'Quỷ Lộn Âm'], ['🧌', 'Troll Chính Tả'], ['🐲', 'Rồng Ngọng']],
  [['👽', 'Quái Vũ Trụ'], ['🤖', 'Robot Soát Lỗi'], ['🐉', 'Đại Ma Vương Ngọng']],
];

const SPEAK = {
  ln: {
    1: ['lá non', 'nón lá', 'lo lắng', 'nặng nề'],
    2: ['nải chuối non', 'lon nước lạnh', 'nón lá nhẹ nhàng', 'nồi lẩu nóng'],
    3: ['Nam nuôi con lợn nái nâu', 'Lan làm lồng đèn lung linh', 'Nắng lên làm lá non lấp lánh', 'Bà nội nấu nồi cháo nóng'],
    4: [
      'Nắng lên lấp lánh trên những cánh đồng lúa non nơi làng nhỏ',
      'Lan nấu nồi canh nóng để mời nội ăn bữa trưa',
      'Nam lo lắng vì làn nước lũ lên nhanh nên nói nhỏ với mẹ',
      'Chị Nga nâng niu chiếc nón lá nhỏ làm quà tặng bà nội',
    ],
    5: [
      'Sáng nay Nam đi làm nương cùng nội. Nắng lên nóng nực nhưng Nam vẫn nở nụ cười.',
      'Lan nằm nghe tiếng nước chảy lách tách. Lòng Lan nhẹ nhàng, nỗi lo lắng cũng nguôi dần.',
      'Làng Nam có nhiều nhà nuôi lợn. Mỗi lần nghe nội gọi, lũ lợn lại lạch bạch chạy ra.',
    ],
  },
  sx: {
    1: ['sáng sủa', 'xinh xắn', 'xa xôi', 'sạch sẽ'],
    2: ['xe sang xịn', 'sách xếp ngay', 'sân xanh sạch', 'sương sớm xa xa'],
    3: ['Sáo sậu hót suốt sáng', 'Xe buýt xuất phát sớm', 'Chị Xuân xếp sách xong xuôi', 'Sóng xô sát bờ sông'],
    4: [
      'Sáng sớm, sương xuống phủ trắng xóa cả xóm nhỏ bên sông',
      'Chú sóc xinh xắn leo lên cây sồi để tìm hạt sẻ',
      'Bác Sơn xách xô nước ra sân xối cho sạch bụi',
      'Xuân và Sương xếp sách vở ngay ngắn trên giá rồi sang xem tivi',
    ],
    5: [
      'Mùa xuân sắp sang, cây xoan trước sân đã xanh mướt. Sáng nào chim sẻ cũng sà xuống hót vang.',
      'Xa xa, tiếng sáo vang lên theo sóng nước. Sương sớm xuống, cả xóm sông xinh xắn như bức tranh.',
      'Bé Sen sửa soạn đi xem xiếc cùng ba. Xe chạy xa, Sen say sưa ngắm xóm làng.',
    ],
  },
  chtr: {
    1: ['chăm chỉ', 'trẻ trung', 'trung thu', 'chân trời'],
    2: ['chú chim trắng', 'trái chuối chín', 'trời trong trẻo', 'trà chanh chua'],
    3: ['Chú Trung trèo cây chuối', 'Trẻ con chơi trò chạy trốn', 'Chị Trang chăm chút chậu cây', 'Trời chuyển lạnh, trẻ cần chăn ấm'],
    4: [
      'Chú chim chích chòe chuyền cành trong buổi sớm trời trong trẻo',
      'Trung chạy chậm lại để chờ Trang trước cổng trường',
      'Chị Chi trải chăn trên cỏ rồi chia trái cây cho trẻ nhỏ',
      'Cha chở Trung qua chợ để mua trà và trái chín',
    ],
    5: [
      'Trường làng có cây phượng trước cổng. Trung và Chi chơi trốn tìm dưới tán lá, tiếng cười trong trẻo.',
      'Chiều nay trời chuyển mưa, Trang chạy vội về nhà. Cha chờ Trang trước cửa với chiếc chăn trắng.',
      'Chú Trí chở trà ra chợ từ tờ mờ sáng. Trên đường, chú chia trái chín cho trẻ nhỏ.',
    ],
  },
  rdgi: {
    1: ['rực rỡ', 'giàu có', 'dịu dàng', 'giận dữ'],
    2: ['rừng rậm rạp', 'giờ ra chơi', 'dì dặn dò', 'rổ rau giòn'],
    3: ['Dì Giang rửa rau ở ruộng', 'Gió ru đàn dê ra đồng', 'Rồng bay giữa rừng rậm', 'Giang dạy em ra giếng rửa chân'],
    4: [
      'Dì Dung gieo rau ngoài ruộng rồi dắt dê ra bờ rào chăn',
      'Gió reo rì rào trong rừng, rừng rậm rạp rất rực rỡ',
      'Giang rủ Duy ra giếng rửa rau rồi giúp dì giặt đồ',
      'Ra đường gặp dì dạy, Dũng giơ tay chào rất dõng dạc',
    ],
    5: [
      'Giờ ra chơi, Giang rủ Duy ra sân đá cầu. Gió reo rì rào, tiếng cười giòn tan vang khắp trường.',
      'Dì Dung dậy từ rạng sáng để gieo rau. Rau lên xanh rì, dì giao rau ra chợ giá rẻ.',
      'Rừng ra hoa rực rỡ vào dịp giữa hè. Dân làng rủ nhau vào rừng, ai cũng reo vui.',
    ],
  },
  dau: {
    1: ['sửa chữa', 'nghỉ ngơi', 'mỉm cười', 'bữa cỗ'],
    2: ['cổ tích kể lại', 'nghĩ kỹ rồi làm', 'bữa sáng của bé', 'vẽ tranh thật đẹp'],
    3: ['Bé hãy nghỉ ngơi cho khỏe', 'Mẹ sửa lại cổ áo cho bé', 'Cả nhà quây quần bên bữa cỗ', 'Bé mỉm cười khi nghe kể chuyện cổ tích'],
    4: [
      'Bé ngủ dậy, vẫn còn ngỡ ngàng khi thấy mẹ đang sửa cổ áo',
      'Ở chỗ nghỉ, chúng mình sẽ kể chuyện và ăn bữa sáng',
      'Cả nhà quây quần bên mâm cỗ, bé mỉm cười kể chuyện cổ tích',
      'Cô giáo nhắc cả lớp giữ gìn sách vở và nghĩ kỹ trước khi trả lời',
    ],
    5: [
      'Hè về, bé về quê nghỉ ngơi. Bà kể chuyện cổ tích, mẹ sửa lại cổ áo cho bé.',
      'Bữa cỗ tối nay rất vui. Cả nhà quây quần, ai cũng mỉm cười kể chuyện cũ.',
      'Cô giáo dặn cả lớp nghĩ kỹ rồi mới trả lời. Bé nhỏ giọng, sửa lại từ vừa nói sai.',
    ],
  },
};

const BLANK = {
  ln: {
    1: ['[nón|lón] lá', '[lạnh|nạnh] lẽo', '[lo|no] lắng', '[nặng|lặng] nề'],
    2: ['Bé uống [nước|lước] lạnh', 'Con [lợn|nợn] ăn cám', 'Chiếc [lá|ná] vàng rơi', 'Mẹ [nấu|lấu] cơm trưa'],
    3: ['Bà [nội|lội] nấu cơm rất ngon', 'Trời [lạnh|nạnh] nên bé mặc áo ấm', '[Lan|Nan] làm bài tập xong rồi', 'Bé [nằm|lằm] ngủ trưa'],
    4: [
      'Hôm nay Nam giúp mẹ [nấu|lấu] cơm rồi mới đi chơi',
      'Chú bộ đội [nằm|lằm] gác suốt đêm để giữ bình yên cho làng',
      'Mùa [lũ|nũ], nước sông dâng cao khiến cả xóm lo lắng',
      'Chị Lan [làm|nàm] bánh để mừng sinh nhật bà nội',
    ],
    5: [
      'Mưa lớn khiến nước [lũ|nũ] dâng lên. Cả làng lo lắng nên cùng nhau nâng đồ lên cao.',
      'Bà nội nhóm lửa [nấu|lấu] cháo. Lan nằm nghe bà kể chuyện, lòng nhẹ nhàng như lá non.',
      'Làng em nằm bên [lòng|nòng] sông. Mỗi mùa lúa chín, nắng lên lấp lánh trên mặt nước.',
    ],
  },
  sx: {
    1: ['[sáng|xáng] sủa', '[xinh|sinh] xắn', '[xa|sa] xôi', '[sạch|xạch] sẽ'],
    2: ['Con [sông|xông] chảy xa', 'Bé [xem|sem] tivi', 'Chiếc [xe|se] đạp mới', 'Quyển [sách|xách] hay'],
    3: ['Bé [sắp|xắp] xếp sách vở gọn gàng', 'Chim [sẻ|xẻ] hót trên cành', 'Chú [sóc|xóc] leo lên cây sồi', 'Chị [xếp|sếp] quần áo vào tủ'],
    4: [
      'Sáng sớm, [sương|xương] giăng trắng xóa trên cánh đồng làng',
      'Cô giáo [xếp|sếp] cho cả lớp ngồi ngay ngắn',
      'Bác nông dân [xuống|suống] đồng từ lúc trời còn tờ mờ sáng',
      'Mỗi [sáng|xáng], bé đều tập thể dục cùng ông ở ngoài sân',
    ],
    5: [
      'Mùa xuân đến, [xoan|soan] nở tím cả góc sân. Chim sẻ sà xuống hót vang.',
      'Cả nhà [xem|sem] tivi sau bữa cơm tối. Bé say sưa nghe ba kể chuyện.',
      'Ba chở Sen đi xem xiếc. Trên [xe|se], Sen reo vui vì được ngắm xóm làng.',
    ],
  },
  chtr: {
    1: ['[chăm|trăm] chỉ', '[trẻ|chẻ] trung', '[trung|chung] thu', '[chân|trân] trời'],
    2: ['Con [trâu|châu] ăn cỏ', 'Trời [trong|chong] xanh', 'Bé [chơi|trơi] ngoài sân', 'Quả [chuối|truối] chín'],
    3: ['Chú [trâu|châu] chậm chạp đi trên bờ ruộng', 'Bé [trèo|chèo] lên ghế lấy cuốn sách', 'Cả lớp [chăm|trăm] chú nghe cô giảng bài', 'Mẹ [chia|chìa] bánh cho cả nhà'],
    4: [
      '[Trường|Chường] của em nằm cạnh con sông nhỏ',
      'Trời [chuyển|truyển] lạnh nên mẹ nhắc bé mặc thêm áo ấm',
      'Chú chim [chích|trích] chòe hót líu lo từ sáng sớm',
      'Bé luôn [chăm|trăm] chỉ học tập để cha mẹ vui lòng',
    ],
    5: [
      'Chiều nay, [trời|chời] chuyển mưa. Trang chạy vội về nhà vì sợ ướt cặp sách.',
      'Trên đường tới [trường|chường], Chi gặp chú Trí chở trà ra chợ. Chi chào chú thật to.',
      'Cha chở Trung đi [chợ|trợ] mua trái chín. Trung chia cho cả nhà ăn.',
    ],
  },
  rdgi: {
    1: ['[rực|dực|gực] rỡ', '[giàu|ràu|dàu] có', '[dịu|rịu] dàng', '[giận|dận] dữ'],
    2: ['[Rau|Dau|Giau] xanh tươi', '[Giờ|Rờ|Dờ] ra chơi', '[Rổ|Dổ|Giổ] đựng rau', 'Con [dê|rê] trắng'],
    3: ['Mẹ [rửa|giửa] rau ngoài giếng', 'Bé [giúp|dúp] mẹ quét nhà', 'Con [rồng|dồng|giồng] bay giữa rừng', '[Gió|Dó|Ró] thổi nhẹ trên đồng'],
    4: [
      'Dì Dung [gieo|rieo] rau ngoài ruộng rồi dắt dê ra bờ rào',
      'Buổi sáng, [giọt|rọt] sương đọng trên lá lấp lánh như hạt ngọc',
      'Cả nhà [rủ|dủ] nhau ra đồng gặt lúa trước khi trời mưa',
      'Bà [dạy|rạy] cháu cách gấp áo thật gọn gàng',
    ],
    5: [
      'Giờ ra chơi, Giang [rủ|dủ] Duy ra sân đá cầu. Cả hai cười giòn tan.',
      'Dì Dung [dậy|rậy] từ rạng sáng để gieo rau. Rau lên xanh rì, dì giao ra chợ.',
      'Rừng ra hoa [rực|dực] rỡ vào giữa hè. Dân làng rủ nhau vào rừng, ai cũng reo vui.',
    ],
  },
  dau: {
    1: ['[sửa|sữa] chữa', '[nghỉ|nghĩ] ngơi', '[mỉm|mĩm] cười', 'bữa [cỗ|cổ]'],
    2: ['Bé [nghỉ|nghĩ] ngơi', 'Mẹ [sửa|sữa] đồ', 'Ăn [bữa|bửa] sáng', 'Bé [vẽ|vẻ] tranh'],
    3: ['Bé [vẽ|vẻ] một bức tranh thật đẹp', 'Mẹ [nghỉ|nghĩ] ngơi sau giờ làm', 'Cả nhà ăn [bữa|bửa] cơm thật vui', 'Bé [kể|kễ] chuyện cho bà nghe'],
    4: [
      'Bà ngoại thường [kể|kễ] chuyện cổ tích cho cháu nghe mỗi tối',
      'Em [nghĩ|nghỉ] mãi mới tìm ra đáp án của bài toán khó',
      'Cô giáo nhắc cả lớp phải [giữ|giũ] gìn sách vở thật cẩn thận',
      'Anh em [sửa|sữa] lại chiếc xe đạp cũ để đi học',
    ],
    5: [
      'Hè về, bé về quê [nghỉ|nghĩ] ngơi. Bà kể chuyện cổ tích, mẹ sửa lại cổ áo cho bé.',
      'Cô giáo dặn cả lớp [nghĩ|nghỉ] kỹ rồi mới trả lời. Bé giơ tay phát biểu rất tự tin.',
      'Bữa cỗ tối nay rất vui. Cả nhà [quây|quấy] quần, ai cũng mỉm cười kể chuyện cũ.',
    ],
  },
};

const FIND = {
  ln: {
    2: ['Bé uống {lước|nước} lạnh'],
    3: ['Bà nội {lấu|nấu} cơm rất ngon'],
    4: ['Mùa lũ, {lước|nước} sông dâng cao khiến cả xóm lo lắng'],
    5: ['Sáng nay Nam đi làm nương cùng nội. Nắng lên {lóng|nóng} nực nhưng Nam vẫn nở nụ cười.'],
  },
  sx: {
    2: ['Bé {sem|xem} phim'],
    3: ['Chị {sếp|xếp} quần áo vào tủ'],
    4: ['Sáng sớm, {xương|sương} giăng trắng xóa cả cánh đồng làng'],
    5: ['Mùa xuân đến, cây {soan|xoan} nở tím cả sân. Chim sẻ sà xuống hót vang.'],
  },
  chtr: {
    2: ['Con {châu|trâu} ăn cỏ'],
    3: ['Chú Trung {chèo|trèo} cây chuối'],
    4: ['Trời {truyển|chuyển} lạnh nên mẹ nhắc bé mặc thêm áo ấm'],
    5: ['Chiều nay {chời|trời} chuyển mưa. Trang chạy vội về nhà vì sợ ướt cặp sách.'],
  },
  rdgi: {
    2: ['Bé {dúp|giúp} mẹ quét nhà'],
    3: ['Dì Dung {rieo|gieo} rau ngoài ruộng'],
    4: ['Cả nhà {dủ|rủ} nhau ra đồng gặt lúa trước khi trời mưa'],
    5: ['Giờ ra chơi, Giang rủ Duy ra sân đá cầu. Gió reo {dì|rì} rào, tiếng cười giòn tan.'],
  },
  dau: {
    2: ['Bé {nghĩ|nghỉ} ngơi'],
    3: ['Bé {vẻ|vẽ} một bức tranh thật đẹp'],
    4: ['Mẹ {sữa|sửa} lại cổ áo cho bé trước khi đến lớp'],
    5: ['Hè về, bé về quê nghỉ ngơi. Bà {kễ|kể} chuyện cổ tích cho bé nghe.'],
  },
};

// ---- Chuyển dữ liệu thô thành danh sách câu hỏi phẳng ----

function parseBlank(src) {
  const m = src.match(/\[([^\]]+)\]/);
  const opts = m[1].split('|');
  return {
    before: src.slice(0, m.index),
    after: src.slice(m.index + m[0].length),
    answer: opts[0],
    options: opts,
  };
}

function parseFind(src) {
  const tokens = src.split(' ').map((raw) => {
    const m = raw.match(/^(.*?)\{([^|]+)\|([^}]+)\}(.*)$/);
    if (!m) return { text: raw };
    return { text: m[1] + m[2] + m[4], wrong: true, right: m[1] + m[3] + m[4] };
  });
  const bad = tokens.find((t) => t.wrong);
  return {
    tokens,
    answer: bad.right,
    full: tokens.map((t) => (t.wrong ? t.right : t.text)).join(' '),
  };
}

export const ITEMS = [];
for (const [group, tiers] of Object.entries(SPEAK))
  for (const [tier, list] of Object.entries(tiers))
    list.forEach((text, k) => ITEMS.push({ id: `s-${group}-${tier}-${k}`, kind: 'speak', group, tier: +tier, text }));
for (const [group, tiers] of Object.entries(BLANK))
  for (const [tier, list] of Object.entries(tiers))
    list.forEach((src, k) =>
      ITEMS.push({ id: `b-${group}-${tier}-${k}`, kind: 'blank', group, tier: +tier, ...parseBlank(src) }));
for (const [group, tiers] of Object.entries(FIND))
  for (const [tier, list] of Object.entries(tiers))
    list.forEach((src, k) =>
      ITEMS.push({ id: `f-${group}-${tier}-${k}`, kind: 'find', group, tier: +tier, ...parseFind(src) }));

export const QUESTIONS_PER_MATCH = 30;

const rand = (n) => Math.floor(Math.random() * n);
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function tierAt(level, i, count = QUESTIONS_PER_MATCH) {
  const [a, b] = LEVELS[level].ramp;
  return Math.max(1, Math.min(5, Math.round(a + ((b - a) * i) / (count - 1))));
}

function pick(kind, tier, groups, used) {
  const order = [tier, tier - 1, tier + 1, tier - 2, tier + 2].filter((t) => t >= 1 && t <= 5);
  const match = (it, t, g) => it.kind === kind && it.tier === t && (!g || groups.includes(it.group)) && !used.has(it.id);
  for (const t of order) {
    const c = ITEMS.filter((it) => match(it, t, true));
    if (c.length) return c[rand(c.length)];
  }
  for (const t of order) {
    const c = ITEMS.filter((it) => match(it, t, false));
    if (c.length) return c[rand(c.length)];
  }
  const c = ITEMS.filter((it) => it.kind === kind && it.tier === tier);
  return c[rand(c.length)];
}

/** mode: 'both' | 'speak' | 'choose' */
export function buildQuiz(level, groups, mode, count = QUESTIONS_PER_MATCH) {
  const used = new Set();
  const out = [];
  for (let i = 0; i < count; i++) {
    const tier = tierAt(level, i, count);
    const r = Math.random();
    let kind;
    if (mode === 'speak') kind = 'speak';
    else if (mode === 'choose') kind = r < 0.65 ? 'blank' : 'find';
    else kind = r < 0.5 ? 'speak' : r < 0.8 ? 'blank' : 'find';
    if (kind === 'find' && tier < 2) kind = mode === 'choose' ? 'blank' : 'speak';
    const q = pick(kind, tier, groups, used);
    used.add(q.id);
    out.push({ ...q, options: q.options ? shuffle(q.options) : undefined, askTier: tier });
  }
  return out;
}
