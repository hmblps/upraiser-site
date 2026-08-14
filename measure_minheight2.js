import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const sticky = document.querySelector('#promise .accent-scroll-sticky');
    return {
      cssText: Array.from(document.styleSheets).flatMap(s => {
        try {
          return Array.from(s.cssRules).filter(r => r.selectorText && r.selectorText.includes('.accent-scroll-section--fold-pair .accent-scroll-sticky')).map(r => r.cssText);
        } catch(e) { return []; }
      })
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
