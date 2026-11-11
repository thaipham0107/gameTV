# Đấu Quái Vật · Nói đúng, viết chuẩn

Game luyện **phát âm** (l/n, s/x, ch/tr, r/d/gi, hỏi/ngã) và **chính tả** bằng cách đấu quái vật:
nói đúng hoặc chọn đúng từ thì nhân vật đấm/đá quái một cái; sai thì quái đánh lại.

## Cách chơi

- Mỗi 10 câu gặp một quái vật mới. Đúng ≥ 70% số câu là **đạt** (1–3 sao).
- 3 dạng câu hỏi:
  - 🎤 **Nói**: đọc to câu hiện trên màn hình (được thử 2 lần, từ nào sai sẽ tô đỏ).
  - ✍️ **Điền từ**: chọn từ viết đúng chính tả.
  - 🔍 **Tìm lỗi**: bấm chọn **tất cả** từ viết sai trong câu (câu càng khó càng nhiều từ sai), rồi bấm Kiểm tra.
- **6 cấp độ**, số câu tăng dần: Cấp 1 = 20 câu, mỗi cấp sau thêm 10 câu (Cấp 6 = 70 câu). Câu càng về sau càng khó và dài:
  từ 2 tiếng → cụm từ → câu ngắn → câu dài → đoạn 2–3 câu.
- **Mở khoá**: đạt cấp nào thì mở cấp kế tiếp. **Cấp 6** chỉ mở khi đúng **100% ở Cấp 5**.
- Câu chọn chính tả đúng vẫn hiện lại câu chuẩn ~2,5 giây (hoặc bấm "Tiếp") để kịp nhìn kết quả.
- Chọn được nhóm âm cần luyện và chế độ (nói + chọn / chỉ nói / chỉ chọn chính tả).
- Cuối ván có danh sách câu sai để nghe mẫu và luyện lại.

Nhận giọng nói dùng Web Speech API (`vi-VN`) nên cần **Chrome hoặc Edge**, có mạng và cho phép micro
(chạy trên `https://` hoặc `localhost`). Trình duyệt không hỗ trợ sẽ tự chuyển sang chế độ chỉ chọn chính tả.

## Chạy và build

```bash
npm install
npm run dev        # chạy thử tại http://localhost:5173
npm run validate   # kiểm tra dữ liệu câu hỏi + hàm chấm điểm
npm run build      # xuất ra thư mục dist/
```

## Thêm câu hỏi

Nội dung nằm trong [src/data.js](src/data.js), [src/find-data.js](src/find-data.js) và [src/tier6.js](src/tier6.js), chia theo nhóm âm và độ khó (1–6):

- `SPEAK`: câu cần đọc.
- `BLANK`: `"Chiếc [lá|ná] vàng"` — từ **đúng đứng đầu**, các từ sau là đáp án nhiễu.
- `FIND`: `"Bé {sem|xem} phim"` — `{từ sai|từ đúng}`; có thể đặt nhiều cặp trong một câu (độ khó ≥ 4 cần ≥ 2 từ sai).

Thêm nhóm âm mới: bổ sung vào `SOUND_GROUPS` và 3 danh sách trên, rồi chạy `npm run validate`.

## Triển khai GitHub Pages

Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tự build và deploy mỗi lần push lên `main`.
Chỉ cần vào **Settings → Pages → Source: GitHub Actions** một lần.
