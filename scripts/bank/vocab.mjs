// Kho từ vựng viết tay để ghép câu. Mỗi mục đều là cụm tự nhiên, có thể ghép với chủ ngữ bất kỳ.

export const MALE = 'Nam Dũng Duy Sơn Lâm Phúc Long Lộc Trí Dương Huy Quân Bình Hiếu Khoa Đạt Tuấn Nguyên Sáng Trung Lương Nhân Vũ Hải Thịnh'.split(' ');
export const FEMALE = 'Lan Sen Trang Nga Chi Giang Xuân Nhung Liên Thảo Hà Linh Nhi Loan Ngân Sương Hạnh Mai Châu Ngọc Thu Vy Trúc Diệu Nụ Lụa Nhàn'.split(' ');

export const SUBJECTS_MALE = (n) => [`Bé ${n}`, `Anh ${n}`, `Chú ${n}`, `Bác ${n}`, `Cậu ${n}`, n];
export const SUBJECTS_FEMALE = (n) => [`Bé ${n}`, `Chị ${n}`, `Cô ${n}`, `Dì ${n}`, n];
export const SUBJECTS_FIXED = [
  'Bà nội', 'Ông nội', 'Bà ngoại', 'Ông ngoại', 'Mẹ', 'Bố', 'Cô giáo', 'Thầy giáo', 'Chú bộ đội', 'Bác nông dân',
  'Cả lớp', 'Các bạn nhỏ', 'Hai chị em', 'Hai anh em', 'Cả nhà', 'Dân làng', 'Lũ trẻ', 'Cô bé', 'Cậu bé', 'Bác thợ',
];

export const TIMES = [
  'Sáng nay', 'Chiều nay', 'Sáng sớm', 'Buổi trưa', 'Chiều qua', 'Tối qua', 'Cuối tuần', 'Mùa hè', 'Mùa xuân',
  'Mỗi buổi sáng', 'Hôm qua', 'Hôm nay', 'Sáng hôm qua', 'Mỗi cuối tuần', 'Trưa nay', 'Chiều muộn', 'Sớm mai',
];

// "động từ | tân ngữ... | bổ ngữ/nơi chốn..."  →  <động từ> <tân ngữ> <bổ ngữ>
export const VERB_ROWS = `
nấu|cơm,canh chua,cháo,chè,xôi,lẩu,cháo lòng|trong bếp,từ sớm,cho cả nhà,thật ngon
rửa|rau,bát,tay,chân,mặt,xe đạp,trái cây,nải chuối|ngoài giếng,bên bờ sông,ở sân,thật sạch
nhặt|rau,lá non,quả na,lúa,sỏi,rau muống|ngoài vườn,trên sân,bên ruộng,thật kỹ
xếp|sách vở,quần áo,chén bát,đồ chơi,giày dép|vào tủ,lên giá,ngay ngắn,thật gọn
xem|phim,xiếc,tivi,tranh,bóng đá,múa rối|cùng ba,sau bữa cơm,ở nhà nội,say sưa
sửa|xe đạp,cổ áo,cái ghế,cái đèn,mái nhà,chiếc quạt|cho bà,giúp mẹ,ngoài sân,thật khéo
chăm sóc|luống rau,cây xoan,chậu hoa,đàn gà,đàn lợn,vườn nhãn|mỗi sáng,cùng ông,thật cẩn thận
trồng|rau,cây chuối,cây xoài,cây nhãn,hoa sen,ngô,lúa|ngoài vườn,bên bờ ao,trước sân,sau nhà
trèo|cây ổi,cây sấu,cây nhãn,cây xoan,lên ghế,lên mái|thật nhanh,cùng bạn,rất khéo
chạy|ra sân,vào lớp,ra chợ,ra bờ sông,về nhà,qua cầu|thật nhanh,rất chậm rãi,cùng các bạn
chở|trà,rau,lúa,sách vở,trái cây,bắp|ra chợ,về làng,bằng xe đạp,qua cầu
lau|bàn,nhà,cửa sổ,bảng,giày|sạch sẽ,thật kỹ,cho sáng
quét|sân,nhà,lá,lớp học|sạch sẽ,mỗi sáng,thật gọn
gieo|hạt,rau,lúa,ngô,hoa|ngoài ruộng,trên luống,đầu mùa
gặt|lúa,ngô,đậu|ngoài đồng,trong nắng sớm,cùng làng xóm
giặt|áo,quần,khăn,chăn,rèm cửa|bên giếng,ở sân,thật sạch
vẽ|tranh,con rồng,bông sen,ngôi nhà,cánh đồng,con chim|thật đẹp,trên giấy,cho lớp
kể|chuyện cổ tích,chuyện vui,chuyện xưa,chuyện làng|cho bé nghe,bên bếp lửa,trước khi ngủ
đọc|sách,truyện,báo,bài thơ,thư|thật to,trong thư viện,dưới gốc cây,cho bà nghe
hát|bài ru,bài ca,bài dân ca|thật vang,trong lớp,cho bà nghe
chơi|đá cầu,trốn tìm,cờ,ô ăn quan,kéo co,nhảy dây|ngoài sân,sau giờ học,dưới gốc đa,cùng lũ trẻ
nuôi|gà,lợn,cá,trâu,dê,vịt,chó nhỏ|ở nhà,sau vườn,bên bờ ao
mua|rau,trà,sách,xoài,nón lá,bánh,sữa,nước|ở chợ,gần trường,cho mẹ,từ sớm
bán|rau,trà,trái cây,xoài,sách cũ,nón lá|ngoài chợ,trước cổng,từ sớm
mang|nón lá,sách vở,nước,bánh,xô nước|ra đồng,đến lớp,về nhà,giúp bà
làm|bài tập,lồng đèn,bánh,diều,thiệp,bài toán|ở lớp,cùng bạn,thật chăm chỉ,xong sớm
gói|bánh,quà,nem,xôi|cho bà,thật khéo,cho ngày Tết
xách|xô nước,giỏ rau,làn cá,túi sách|ra sân,về nhà,ra giếng
ngắm|sao,trăng,sóng nước,cánh đồng,xóm làng,hoa sen|từ xa,bên sông,say sưa
nghe|chuyện cổ tích,tiếng sáo,tiếng chim,tiếng sóng,bài ru,tiếng trống|bên bếp lửa,say sưa,từ xa
dắt|trâu,dê,bê,em|ra đồng,ra bờ rào,qua cầu,về chuồng
dạy|em,bạn,cháu|đọc chữ,làm toán,vẽ tranh,hát
lội|suối,ruộng,sông|thật nhanh,cùng bạn,qua bãi
chia|bánh,quà,trái chín,kẹo,sách|cho bạn,cho em,cho cả lớp
trải|chăn,chiếu,khăn,thảm|ra sân,trên cỏ,dưới tán cây
tưới|cây,rau,hoa,vườn|mỗi sáng,thật đều,sau giờ học
cắt|giấy,tóc,cỏ,bánh,rau|thật khéo,ngoài sân,cho đều
gọt|xoài,táo,lê,na|thật mỏng,cho cả nhà,bên hiên
nặn|bánh,con trâu,con chim,tò he|thật khéo,cùng em,thật xinh
treo|lồng đèn,tranh,áo,nón lá,chuông|lên cửa,trên tường,thật cao
dựng|lều,nhà,cột cờ,sạp hàng|bên bờ sông,ngoài sân,thật chắc
đổ|nước,cát,xô nước|ra sân,vào chậu,vào xô
lấy|nước,sách,nón lá,chổi,xô|ở giếng,trong tủ,giúp mẹ
nhóm|lửa,bếp|từ sớm,bên hiên,cho ấm
đun|nước,ấm trà,nồi canh|trong bếp,thật lâu,cho nóng
phơi|lúa,áo,chăn,ngô,rơm|ngoài sân,dưới nắng,trên giàn
sắp|bàn ăn,bát đũa,sách vở|thật gọn,ngay ngắn,cho cả nhà
nhổ|cỏ,rau,củ cải|ngoài vườn,trên luống,thật sạch
thả|diều,cá,đèn lồng,thuyền giấy|bên sông,trên đồi,thật cao
hái|chè,quả sấu,hoa,rau,nhãn,lá non|trên đồi,ngoài vườn,từ sớm
xới|đất,luống rau|ngoài vườn,thật đều,từ sớm
`.trim().split('\n').map((line) => {
  const [verb, objs, places] = line.split('|');
  return { verb, objs: objs.split(','), places: places.split(',') };
});

// Cụm danh từ (độ khó 2): [loại từ, danh từ[], tính từ/bổ ngữ[]]
export const NP_GROUPS = [
  ['con', 'sâu ếch rùa sóc sẻ nai nhện sên rắn rồng trâu dê lợn gà vịt chó mèo ngựa cá cua tôm ốc chim ong kiến nhím hươu bò voi cáo sói chuột bướm cò sáo cú quạ lươn tằm'.split(' '),
    ['nhỏ', 'to', 'xinh xắn', 'chậm chạp', 'nhanh nhẹn', 'lười biếng', 'siêng năng', 'hiền lành', 'lanh lợi', 'sạch sẽ', 'trắng', 'đen', 'nâu', 'vàng', 'xám', 'béo', 'ngoan', 'nhút nhát', 'sặc sỡ', 'non']],
  ['quả', 'xoài na nhãn sấu lê nho sung chuối cam quýt bưởi ổi dưa lựu mận mơ dừa đào táo vải chanh'.split(' '),
    ['chín', 'xanh', 'ngọt', 'chua', 'tròn', 'to', 'nhỏ', 'thơm', 'mọng nước', 'rụng', 'ngon', 'chát', 'sai trĩu']],
  ['cây', 'xoan sấu sồi đa nhãn ổi chuối tre trúc dừa cau liễu bưởi xoài phượng bàng lim sung'.split(' '),
    ['xanh', 'to', 'cao', 'già', 'non', 'nhỏ', 'rậm rạp', 'xanh tốt', 'nở hoa', 'sai quả', 'trước sân', 'sau nhà', 'bên sông']],
  ['cái', 'nón lược nồi xô rổ chổi ghế ô áo giỏ chăn chiếu gương cặp bút lọ lò sổ thước xẻng liềm'.split(' '),
    ['nhỏ', 'to', 'mới', 'cũ', 'sạch', 'đẹp', 'nhẹ', 'nặng', 'xinh xắn', 'sáng', 'tròn', 'chắc chắn', 'của bà', 'của em']],
  ['chiếc', 'nón lồng đèn thuyền bàn đèn quạt xe áo ô cặp giường lá diều xô rổ'.split(' '),
    ['nhỏ', 'to', 'mới', 'cũ', 'sạch', 'đẹp', 'nhẹ', 'xinh xắn', 'sáng', 'lung linh', 'của mẹ', 'của bé', 'rất xinh']],
  ['bát', 'canh cháo chè cơm bún phở miến'.split(' '),
    ['nóng', 'lạnh', 'ngon', 'thơm', 'ngọt', 'chua', 'mặn', 'nhạt', 'nghi ngút khói', 'đầy ắp', 'của nội']],
  ['đĩa', 'rau nem gỏi xôi trứng'.split(' '),
    ['nóng', 'ngon', 'thơm', 'giòn', 'tươi', 'đầy ắp', 'còn nóng', 'của mẹ']],
  ['món', 'lẩu nem gỏi canh chè bún'.split(' '),
    ['nóng', 'ngon', 'thơm', 'cay', 'chua', 'ngọt', 'lạ', 'quen thuộc', 'của miền núi']],
  ['bông', 'sen súng sim hồng cúc mai đào huệ'.split(' '),
    ['đỏ', 'trắng', 'tím', 'vàng', 'thơm', 'nở rộ', 'xinh xắn', 'rực rỡ', 'dịu dàng', 'trên cành']],
  ['chú', 'chim sáo sẻ chích chòe cò sóc nai ong'.split(' '),
    ['nhỏ', 'xinh xắn', 'nhanh nhẹn', 'hiền lành', 'lanh lợi', 'ngoan', 'sặc sỡ', 'rất vui']],
];

// Cụm cố định tả cảnh vật, đồ vật, món ăn (độ khó 2)
export const NATURE_PHRASES = `
trời trong trẻo|nắng sớm|sương sớm|gió nhẹ|mưa rào|sóng nước|bầu trời xanh|cánh đồng lúa|dòng sông xanh|đường làng
xóm nhỏ|lá non|nắng lên|trăng sáng|sao sáng|mây trắng|nước trong|suối nhỏ|núi cao|rừng xanh
đồi chè|bãi cát|mùa xuân|tiếng sáo|tiếng chim|tiếng suối|tiếng trống|nón lá|áo dài|lồng đèn
bánh chưng|nem rán|canh chua|rau răm|rau muống|giò lụa|chè xanh|xôi đỗ|cá rô|lúa non
hạt lúa|lá sen|giọt sương|ánh nắng|làn gió|cơn mưa|vầng trăng|ngôi sao|cánh chim|bờ sông
bến đò|chợ quê|ngõ nhỏ|giếng nước|mái nhà|sân đình|cổng làng|gốc đa|hàng cau|luống rau
vườn nhãn|ao sen|bờ ruộng|đồng lúa|nương ngô|bãi sông|cầu tre|thuyền nan|xe đạp|nồi cơm
bếp lửa|ấm trà|đĩa xôi|bát canh|rổ rau|giỏ nhãn|thúng lúa|chum nước|lu nước|sọt rau
lớp học|sân trường|giờ ra chơi|giờ học|cô giáo|thầy giáo|bạn thân|trống trường|bảng đen|cặp sách
rừng rậm rạp|dòng suối trong|nắng sớm lung linh|sương sớm xuống|trời xanh lạnh|mưa nhẹ nhàng|gió reo rì rào|lá rơi lặng lẽ|làng quê yên bình|xóm núi xinh xắn
chim chích chòe|chú sóc nhỏ|sáo sậu hót|cò trắng bay|sên nâu chậm chạp|nhện giăng tơ|ếch kêu ộp oạp|rùa nhỏ lười|trâu chậm rãi|dê trắng non
giày dép sạch|sách vở gọn|đồ chơi mới|quần áo sạch|chén bát sạch|rau sạch giòn|nước sạch trong|nhà sạch sẽ|sân sạch bong|lớp sạch đẹp
`.trim().split(/[|\n]/).filter(Boolean);

// Câu miêu tả hoàn chỉnh (độ khó 3-4), dùng làm câu lẻ hoặc câu nối
export const NATURE_SENTENCES = `
Sương sớm phủ trắng xóm nhỏ.|Nắng lên làm lá non lấp lánh.|Gió reo rì rào trong rừng rậm.|Trăng sáng soi xuống dòng sông.|Mưa rào làm sân sạch bong.
Chim sáo hót líu lo trên cành sấu.|Chú sóc nhỏ nhảy lên cây sồi.|Con trâu chậm rãi đi trên bờ ruộng.|Cánh đồng lúa chín vàng rực rỡ.|Làng quê sáng lên trong nắng sớm.
Nước sông chảy lững lờ qua xóm.|Lá sen xanh nở rộ trên ao.|Cây xoan trước sân nở tím cả góc trời.|Tiếng sáo vang xa trên đồi chè.|Bầu trời xanh trong không một gợn mây.
Mùa xuân đến, cây cối xanh tươi.|Nắng chiều trải vàng trên mặt sông.|Rừng xanh rì rào trong gió sớm.|Giọt sương long lanh trên lá non.|Trời chuyển lạnh, lá bàng rụng đầy sân.
Con đường làng sạch sẽ và rợp bóng cây.|Ngôi nhà nhỏ nằm bên bờ suối.|Dòng suối trong veo chảy qua rừng.|Lũ chim sẻ sà xuống sân tìm hạt thóc.|Chiếc thuyền nan lững lờ trôi trên sông.
Lúa non xanh mướt trải dài đến chân trời.|Hoa sen nở thơm ngát cả ao làng.|Trăng rằm tròn và sáng trên sân đình.|Cơn mưa rào làm mát cả xóm nhỏ.|Gió nhẹ đưa lá chuối đung đưa trước sân.
Nồi canh chua nghi ngút khói thơm lừng.|Bát cháo nóng làm ấm cả buổi sáng.|Mâm cơm chiều rộn ràng tiếng nói cười.|Đĩa xôi đỗ dẻo thơm trên mâm cỗ.|Rổ rau xanh giòn nằm cạnh giếng nước.
`.trim().split(/[|\n]/).filter(Boolean);

// Câu kết (độ khó 5-6)
export const CLOSERS = `
Ai cũng rất vui.|Cả nhà cùng cười thật tươi.|Mọi người đều vui vẻ.|Không khí thật rộn ràng.|Ai nấy đều hăng say.
Lòng ai cũng nhẹ nhàng.|Trời hôm nay thật đẹp.|Cả xóm nô nức hẳn lên.|Ngày hôm ấy thật đáng nhớ.|Ai cũng nở nụ cười rạng rỡ.
Tiếng cười giòn tan vang xa.|Mọi thứ đều sạch sẽ gọn gàng.|Nắng sớm trải vàng khắp sân.|Gió mát làm ai cũng dễ chịu.|Cả lớp cùng reo vui.
`.trim().split(/[|\n]/).filter(Boolean);

// Vài trăm âm tiết thông dụng (bổ sung cho kho từ ở trên) để lọc từ điển: chỉ dùng từ quen thuộc với trẻ.
export const COMMON_SYLLABLES = `
ăn uống ngủ nghỉ học hành chơi đùa chạy nhảy hát múa vẽ viết đọc nói nghe nhìn thấy ngắm xem cười khóc vui buồn yêu thương nhớ quên biết hiểu nghĩ mơ ước mong chờ đợi
đi đến về ra vào lên xuống qua lại tới sang đứng ngồi nằm bước trèo leo bơi lội bay rơi rụng nở tàn héo tươi xanh đỏ vàng trắng đen tím hồng nâu xám cam
nhà cửa sân vườn ao hồ sông suối biển đảo núi đồi rừng đồng ruộng làng xóm phố phường chợ trường lớp thầy cô bạn anh chị em bố mẹ ông bà cha má con cháu chú bác cậu dì
người trẻ già nhỏ to cao thấp dài ngắn rộng hẹp nặng nhẹ nhanh chậm sớm muộn lâu mau gần xa trong ngoài trên dưới trước sau giữa bên cạnh đầu cuối
sáng trưa chiều tối đêm ngày tháng năm xuân hạ thu đông nắng mưa gió sương mây trời đất sao trăng lửa nước cây lá hoa quả cành rễ gốc cỏ rau lúa gạo thóc ngô khoai sắn đậu
trâu bò dê lợn heo gà vịt ngan ngỗng chó mèo chuột ngựa voi hổ sư gấu khỉ nai hươu cáo sói thỏ sóc chim cò sáo sẻ quạ cú bướm ong kiến nhện sâu ếch rùa rắn cá tôm cua ốc sên
cơm canh cháo chè xôi bánh bún phở miến nem gỏi thịt trứng sữa đường muối mắm tương dầu mỡ kẹo bát đũa thìa muỗng chén đĩa nồi chảo ấm cốc ly bình lọ chai
áo quần váy mũ nón giày dép tất khăn túi cặp sách vở bút thước tẩy bảng phấn bàn ghế giường tủ chiếu chăn gối nệm đèn quạt gương lược xà bông
tay chân đầu mặt mắt mũi miệng tai tóc răng lưỡi cổ vai lưng bụng ngực tim gan
tốt xấu đẹp hay dở ngoan hư giỏi kém sạch bẩn khỏe yếu ấm lạnh nóng mát khô ướt mềm cứng ngọt chua cay mặn đắng thơm hôi
một hai ba bốn năm sáu bảy tám chín mười trăm nghìn mấy nhiều ít hết cả mọi các những này kia đó ấy nào đâu gì sao thế vậy rất lắm quá hơn nhất cũng đã đang sẽ vẫn còn chưa không
làm nấu rửa giặt quét lau lấy cho mang xách chở đưa nhận trao mua bán đổi trả tìm thấy giữ cất bỏ vứt đặt để treo dựng xây trồng tưới gieo gặt hái nhổ cắt gọt nặn gói
thương nhớ giúp đỡ dạy bảo khen chê hỏi đáp gọi kêu reo la hò hét thì thầm
chăm chỉ siêng năng cần cù thật thà hiền lành dũng cảm thông minh lanh lợi vui vẻ hạnh phúc bình yên
lễ phép ngay thẳng khéo léo tử tế chu đáo nhẹ nhàng dịu dàng rực rỡ lung linh lấp lánh long lanh óng ánh
`.trim().split(/\s+/);
