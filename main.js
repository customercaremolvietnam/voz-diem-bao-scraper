import axios from 'axios';
import cheerio from 'cheerio';

const TELEGRAM_TOKEN = '8496507275:AAFtwUbco8yIPDlzEWdjtvSUqH2fSpvrYRs';
const CHAT_ID = '-1002855732895';

async function scrapeNews() {
    try {
        const { data } = await axios.get('https://voz.vn/forums/diem-bao.33/');
        const $ = cheerio.load(data);

        const posts = [];
        $('.structItem--thread').each((_, el) => {
            const title = $(el).find('.structItem-title').text().trim();
            const link = 'https://voz.vn' + $(el).find('.structItem-title a').attr('href');
            if (title && link) posts.push({ title, link });
        });
        return posts.slice(0, 5); // Chọn 5 bài mới nhất
    } catch (err) {
        console.error('Error scraping VOZ:', err.message);
        return [];
    }
}

async function sendToTelegram(newsList) {
    for (const news of newsList) {
        const text = `📰 *${news.title}*\n${news.link}`;
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        });
    }
}

(async () => {
    const newsList = await scrapeNews();
    if (newsList.length) {
        await sendToTelegram(newsList);
        console.log(`Sent ${newsList.length} news items to Telegram.`);
    } else {
        console.log('No news found.');
    }
})();
