// Câu hỏi viết tay ban đầu (độ khó 1–5); độ khó 6 ở tier6.mjs, tìm lỗi ở find-legacy.mjs.
export const SPEAK = {
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

export const BLANK = {
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

