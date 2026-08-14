import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    return {
      audSecClass: document.querySelector('#audience').className,
      audStickyClass: document.querySelector('#audience .accent-scroll-sticky').className,
      promSecClass: document.querySelector('#promise').className,
      promStickyClass: document.querySelector('#promise .accent-scroll-sticky').className
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
