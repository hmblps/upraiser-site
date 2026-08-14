import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const rects = await page.evaluate(() => {
    function getAbsoluteRect(el) {
       if (!el) return null;
       const rect = el.getBoundingClientRect();
       return {
         top: rect.top + window.scrollY,
         bottom: rect.bottom + window.scrollY,
         height: rect.height
       };
    }

    const audText = document.querySelector('#audience .section-description');
    const audSticky = document.querySelector('#audience .accent-scroll-sticky');
    const audSec = document.querySelector('#audience');

    const promText = document.querySelector('#promise .section-description');
    const promSticky = document.querySelector('#promise .accent-scroll-sticky');
    const promSec = document.querySelector('#promise');

    return {
      aud: { text: getAbsoluteRect(audText), sticky: getAbsoluteRect(audSticky), sec: getAbsoluteRect(audSec) },
      prom: { text: getAbsoluteRect(promText), sticky: getAbsoluteRect(promSticky), sec: getAbsoluteRect(promSec) }
    };
  });
  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
