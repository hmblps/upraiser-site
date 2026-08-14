import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const copy = document.querySelector('#promise .accent-scroll-copy');
    
    return {
      height: getComputedStyle(copy).height,
      minHeight: getComputedStyle(copy).minHeight,
      paddingTop: getComputedStyle(copy).paddingTop,
      paddingBottom: getComputedStyle(copy).paddingBottom,
      children: Array.from(copy.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        h: c.getBoundingClientRect().height,
        marginTop: getComputedStyle(c).marginTop,
        marginBottom: getComputedStyle(c).marginBottom,
      }))
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
