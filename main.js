import axios from "axios";
import Parser from "rss-parser";

const TELEGRAM_TOKEN = "8496507275:AAFtwUbco8yIPDlzEWdjtvSUqH2fSpvrYRs";
const TELEGRAM_CHAT_ID = "-1002855732895";

// Danh sách RSS feed (nguồn tin bạn muốn lấy)
const RSS_FEEDS = [
  "https://vnexpress.net/rss/tin-moi-nhat.rss",
  "https://thanhnien.vn/rss/home.rss",
  "https://tuoitre.vn/rss/tin-moi-nhat.rss"
];

async function fetchRSS() {
  const parser = new Parser();
  let allItems = [];

  for (const url of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      allItems = allItems.concat(feed.items);
    } catch (err) {
      console.error(`Lỗi khi lấy RSS từ ${url}:`, err.message);
    }
  }

  return allItems;
}

async function sendToTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML"
    });
  } catch (err) {
    console.error("Lỗi gửi Telegram:", err.message);
  }
}

(async () => {
  console.log("Đang lấy tin...");
  const items = await fetchRSS();

  if (!items.length) {
    console.log("Không tìm thấy tin nào.");
    return;
  }

  for (const item of items.slice(0, 5)) { // chỉ gửi 5 tin mới nhất
    const message = `<b>${item.title}</b>\n${item.link}`;
    await sendToTelegram(message);
  }

  console.log("Đã gửi xong!");
})();
