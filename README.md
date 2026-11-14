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
- **Nội dung**: 📚 Phổ thông (phát âm l/n, s/x, ch/tr, r/d/gi, hỏi/ngã, chính tả, ca dao – tục ngữ) · 🗺️ Vùng miền
  (chọn một tỉnh hoặc tất cả: Nghệ An, Hà Tĩnh, Quảng Bình, Huế, Quảng Nam, Bình Định, TP.HCM, Cần Thơ) · 🌟 Tất cả.
- **Cách chơi**: nói + chọn / chỉ nói / chỉ chọn chính tả.
- **Kho hơn 12.000 câu hỏi**: mỗi cấp dùng bộ câu riêng (không lặp giữa các cấp), mỗi ván lấy ngẫu nhiên theo độ khó,
  và các lần chơi sau ưu tiên câu chưa từng gặp (lưu trong trình duyệt; nút "Chơi lại các câu đã gặp" để xoá lịch sử).
- Cuối ván có danh sách câu sai để nghe mẫu và luyện lại.

Nhận giọng nói dùng Web Speech API (`vi-VN`) nên cần **Chrome hoặc Edge**, có mạng và cho phép micro
(chạy trên `https://` hoặc `localhost`). Trình duyệt không hỗ trợ sẽ tự chuyển sang chế độ chỉ chọn chính tả.

**Mở trong Messenger / Zalo / Facebook**: trình duyệt nhúng của các ứng dụng này hay hỏi quyền micro lại mỗi lần nói. Game tự
nhận ra và hiện nút “Mở bằng Chrome” (kèm sao chép liên kết); khuyến nghị bạn bè mở bằng Chrome để luyện nói.

## Chạy và build

```bash
npm install
npm run dev        # chạy thử tại http://localhost:5173
npm run validate   # kiểm tra dữ liệu câu hỏi + hàm chấm điểm
npm run build      # xuất ra thư mục dist/
```

## Kho câu hỏi

`src/bank.json` được **sinh tự động** (không sửa tay) bằng `npm run build:bank`, từ:

- từ vựng và mẫu câu viết tay trong [scripts/bank/](scripts/bank/) (ghép chủ ngữ + hành động + nơi chốn…);
- từ điển [Viet74K](https://github.com/duyet/vietnamese-wordlist) (GPLv2) chỉ để **kiểm tra từ** khi sinh dữ liệu: lọc từ nhạy cảm,
  kiểm tra đáp án nhiễu không phải từ có thật. Tệp từ điển tự tải về `data/` khi cần và **không** nằm trong repo;
- ca dao, tục ngữ dân gian; từ và câu vùng miền ([scripts/bank/dialect.mjs](scripts/bank/dialect.mjs)).

> Dữ liệu vùng miền do người viết tổng hợp, **cần người bản địa của từng tỉnh rà soát** (đặc biệt từ ít phổ biến như “ram” = cua ở Hà Tĩnh).

Sinh lại: `npm run build:bank` rồi `npm run validate`.

## Thêm câu hỏi

Câu viết tay ban đầu nằm trong [scripts/bank/legacy.mjs](scripts/bank/legacy.mjs), [find-legacy.mjs](scripts/bank/find-legacy.mjs) và [tier6.mjs](scripts/bank/tier6.mjs), chia theo độ khó (1–6); thêm xong chạy `npm run build:bank`:

- `SPEAK`: câu cần đọc.
- `BLANK`: `"Chiếc [lá|ná] vàng"` — từ **đúng đứng đầu**, các từ sau là đáp án nhiễu.
- `FIND`: `"Bé {sem|xem} phim"` — `{từ sai|từ đúng}`; có thể đặt nhiều cặp trong một câu (độ khó ≥ 4 cần ≥ 2 từ sai).

Thêm từ vựng, mẫu câu hoặc từ vùng miền mới: sửa các tệp trong `scripts/bank/`, rồi chạy `npm run build:bank` và `npm run validate`.

## Triển khai GitHub Pages

Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tự build và deploy mỗi lần push lên `main`.
Chỉ cần vào **Settings → Pages → Source: GitHub Actions** một lần.

## Chế độ Thử thách (chạy vô tận)

Từ trang chủ bấm "Vào thử thách": khủng long chạy mãi, mỗi chướng ngại mang một từ/câu cần nói trước khi nó chạm. Nói đúng thì khủng long nhảy qua, hết giờ thì game over. Câu dài dần, thời gian ngắn dần; điểm cao lưu trên máy (`src/runner.js`). Dùng cùng kho câu "nói" và lựa chọn Phổ thông/Vùng miền ở trang chủ.
