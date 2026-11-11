# Đấu Quái Vật · Nói đúng, viết chuẩn

Game luyện **phát âm** (l/n, s/x, ch/tr, r/d/gi, hỏi/ngã) và **chính tả** bằng cách đấu quái vật:
nói đúng hoặc chọn đúng từ thì nhân vật đấm/đá quái một cái; sai thì quái đánh lại.

## Cách chơi

- Mỗi ván **30 câu**, chia **3 màn**, mỗi màn một quái vật (10 câu). Đúng ≥ 70% là **đạt** (1–3 sao).
- 3 dạng câu hỏi:
  - 🎤 **Nói**: đọc to câu hiện trên màn hình (được thử 2 lần, từ nào sai sẽ tô đỏ).
  - ✍️ **Điền từ**: chọn từ viết đúng chính tả.
  - 🔍 **Tìm lỗi**: bấm vào từ viết sai trong câu.
- **5 cấp độ**; độ dài tăng dần trong từng ván: từ 2 tiếng → cụm từ → câu ngắn → câu dài → đoạn văn.
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

Mọi nội dung nằm trong [src/data.js](src/data.js), chia theo nhóm âm và độ khó (1–5):

- `SPEAK`: câu cần đọc.
- `BLANK`: `"Chiếc [lá|ná] vàng"` — từ **đúng đứng đầu**, các từ sau là đáp án nhiễu.
- `FIND`: `"Bé {sem|xem} phim"` — `{từ sai|từ đúng}`.

Thêm nhóm âm mới: bổ sung vào `SOUND_GROUPS` và 3 danh sách trên, rồi chạy `npm run validate`.

## Triển khai GitHub Pages

Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tự build và deploy mỗi lần push lên `main`.
Chỉ cần vào **Settings → Pages → Source: GitHub Actions** một lần.
