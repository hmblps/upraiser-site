import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const main = document.querySelector('main');
    return {
      mainBottom: main.getBoundingClientRect().bottom,
      mainPaddingBottom: getComputedStyle(main).paddingBottom,
      mainMarginBottom: getComputedStyle(main).marginBottom,
      children: Array.from(main.children).map(c => ({
        tag: c.tagName,
        id: c.id,
        className: c.className,
        bottom: c.getBoundingClientRect().bottom,
        height: c.getBoundingClientRect().height
      }))
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
