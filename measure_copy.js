import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const rects = await page.evaluate(() => {
    function getRect(el) { 
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height };
    }
    function getMargin(el) { return el ? getComputedStyle(el).margin : null; }

    const audCopy = document.querySelector('#audience .accent-scroll-copy');
    const audDesc = document.querySelector('#audience .section-description');
    
    const promCopy = document.querySelector('#promise .accent-scroll-copy');
    const promDesc = document.querySelector('#promise .section-description');

    return {
      aud: {
        copy: getRect(audCopy),
        desc: getRect(audDesc),
        descMargin: getMargin(audDesc)
      },
      prom: {
        copy: getRect(promCopy),
        desc: getRect(promDesc),
        descMargin: getMargin(promDesc)
      }
    };
  });
  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
