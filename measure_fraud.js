import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // switch to infrastructure theme
  await page.evaluate(() => {
    localStorage.setItem('theme', 'infrastructure');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  // ensure hydration and animation
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    function getRect(el) { 
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
    }
    
    // Scale section is the Audience section (which becomes PROOF in infrastructure mode)
    const text = document.querySelector('#scale .section-description');
    const ghosts = Array.from(document.querySelectorAll('#scale .fold-chart-ghost-value')).map(el => getRect(el));
    
    return {
      text: getRect(text),
      ghosts
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
