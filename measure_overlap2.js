import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    function getRect(el) { 
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    }
    
    const texts = Array.from(document.querySelectorAll('#promise .section-stack > p'));
    const metrics = Array.from(document.querySelectorAll('#promise .fold-chart-ghost-value'));
    
    return {
      texts: texts.map(t => getRect(t)),
      metrics: metrics.map(m => getRect(m.parentElement))
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
