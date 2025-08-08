const Parser = require('rss-parser');
const axios = require('axios');
const sources = require('./sources');

const parser = new Parser();

// ======= CẤU HÌNH TELEGRAM =======
const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // thay token bot
const CHAT_ID = 'YOUR_CHAT_ID'; // thay chat_id Telegram

// ======= THỜI GIAN GIỚI HẠN LẤY TIN MỚI (tính theo phút) =======
const TIME_LIMIT_MINUTES = 60; // lấy tin trong vòng 1 giờ qua

(async () => {
    console.log('Bắt đầu lấy tin...');

    const now = new Date();
    let allNews = [];

    for (const source of sources) {
        try {
            console.log(`Đang lấy RSS từ: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            feed.items.forEach(item => {
                const pubDate = new Date(item.pubDate || item.isoDate || now);
                const diffMinutes = (now - pubDate) / (1000 * 60);

                if (diffMinutes <= TIME_LIMIT_MINUTES) {
                    allNews.push({
                        source: source.name,
                        title: item.title,
                        link: item.link,
                        pubDate: pubDate.toLocaleString('vi-VN')
                    });
                }
            });

        } catch (err) {
            console.error(`❌ Lỗi lấy tin từ ${source.name}: ${err.message}`);
        }
    }

    if (allNews.length === 0) {
        console.log('Không tìm thấy tin mới.');
        return;
    }

    // Gửi từng tin lên Telegram
    for (const news of allNews) {
        const message = `📰 *${news.source}*\n${news.title}\n${news.link}\n🕒 ${news.pubDate}`;
        try {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            });
            console.log(`✅ Đã gửi: ${news.title}`);
        } catch (err) {
            console.error(`❌ Lỗi gửi Telegram: ${err.message}`);
        }
    }

    console.log('Hoàn tất.');
})();
