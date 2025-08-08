import fetch from 'node-fetch';

// Token và chat_id Telegram
const TELEGRAM_TOKEN = '8496507275:AAFtwUbco8yIPDlzEWdjtvSUqH2fSpvrYRs';
const CHAT_ID = '@newsvoz';

// Hàm gửi tin nhắn sang Telegram
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const params = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        const data = await res.json();
        console.log('Telegram response:', data);
    } catch (err) {
        console.error('Error sending to Telegram:', err);
    }
}

// Ví dụ: lấy tin từ 1 RSS feed và gửi
async function main() {
    const newsList = [
        'Tin số 1: Đây là tin test gửi từ Apify/GitHub sang Telegram.',
        'Tin số 2: Bạn có thể thay bằng dữ liệu crawl thực tế.'
    ];

    for (const news of newsList) {
        await sendToTelegram(news);
    }
}

main();
