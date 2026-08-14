import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const margins = await page.evaluate(() => {
    function getAbsoluteRect(el) {
       if (!el) return null;
       const rect = el.getBoundingClientRect();
       return {
         top: rect.top + window.scrollY,
         bottom: rect.bottom + window.scrollY,
         height: rect.height
       };
    }

    // Distance from Audience text to Process
    const audienceDesc = document.querySelector('#audience .section-description');
    const processSec = document.querySelector('#process');
    const audRect = getAbsoluteRect(audienceDesc);
    const procRect = getAbsoluteRect(processSec);
    const scaleMargin = procRect && audRect ? (procRect.top - audRect.bottom) : null;

    // Distance from Promise text to pilot CTA
    const promiseDesc = document.querySelector('#promise .section-description');
    const pilotSec = document.querySelector('#pilot');
    const promRect = getAbsoluteRect(promiseDesc);
    const pilotRect = getAbsoluteRect(pilotSec);
    const clarityMargin = pilotRect && promRect ? (pilotRect.top - promRect.bottom) : null;

    return {
      scaleMargin,
      clarityMargin,
      audRect, procRect, promRect, pilotRect
    };
  });
  console.log(JSON.stringify(margins, null, 2));
  await browser.close();
})();
