import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    function getRect(el) { return el ? el.getBoundingClientRect() : null; }
    
    const promSticky = document.querySelector('#promise .accent-scroll-sticky');
    
    return Array.from(promSticky.children).map(c => ({
      tag: c.tagName,
      className: c.className,
      rect: getRect(c),
      h: c.getBoundingClientRect().height,
      marginTop: getComputedStyle(c).marginTop,
      marginBottom: getComputedStyle(c).marginBottom,
      position: getComputedStyle(c).position
    }));
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
