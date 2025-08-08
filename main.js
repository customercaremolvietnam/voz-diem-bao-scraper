import { PlaywrightCrawler } from 'crawlee';

export default async function main() {
    const crawler = new PlaywrightCrawler({
        requestHandler: async ({ page, enqueueLinks, log }) => {
            await page.waitForSelector('.structItem--thread', { timeout: 15000 });
            const items = await page.$$eval('.structItem--thread .structItem-title a', els => 
                els.map(a => ({
                    title: a.textContent.trim(),
                    url: a.href.startsWith('http') ? a.href : `https://voz.vn${a.getAttribute('href')}`
                }))
            );
            for (const it of items) {
                await apify.pushData(it);
            }
        },
        maxRequestsPerCrawl: 1,
    });
    await crawler.run(['https://voz.vn/f/diem-bao.33/']);
}
