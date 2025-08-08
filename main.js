import axios from "axios";
import cheerio from "cheerio";

const TELEGRAM_TOKEN = "8496507275:AAFtwUbco8yIPDlzEWdjtvSUqH2fSpvrYRs";
const TELEGRAM_CHAT_ID = "newsvoz"; // hoặc chat_id thật (vd: -1001234567890)

async function getVozDiemBao() {
  try {
    // Gọi qua Apify proxy để tránh bị chặn Cloudflare
    const response = await axios.get("https://voz.vn/f/diem-bao.33/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    let posts = [];

    $(".structItem--thread").each((i, el) => {
      const title = $(el).find(".structItem-title a").first().text().trim();
      const link =
        "https://voz.vn" +
        $(el).find(".structItem-title a").first().attr("href");
      posts.push({ title, link });
    });

    return posts;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu VOZ:", error.message);
    return [];
  }
}

async function sendToTelegram(posts) {
  for (let post of posts) {
    const text = `📰 *${post.title}*\n${post.link}`;
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      }
    );
  }
}

(async () => {
  const posts = await getVozDiemBao();
  if (posts.length > 0) {
    await sendToTelegram(posts);
    console.log(`✅ Đã gửi ${posts.length} bài mới`);
  } else {
    console.log("⚠️ Không lấy được bài nào");
  }
})();
