# VOZ Điểm Báo → Telegram

Script này sẽ lấy toàn bộ bài mới từ VOZ mục Điểm Báo và gửi về Telegram.

## Cách dùng trên Apify
1. Tạo một repo GitHub và upload toàn bộ file này lên.
2. Trên Apify chọn "Build your own Actor" → Chọn từ GitHub.
3. Cấu hình biến môi trường:
   - `TELEGRAM_TOKEN` = Token bot Telegram của bạn
   - `TELEGRAM_CHAT_ID` = ID nhóm hoặc username bot sẽ gửi tới
4. Deploy và chạy.
