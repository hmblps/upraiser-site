import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // scroll down to promise section
  await page.evaluate(() => {
    const el = document.querySelector('#promise');
    if (el) el.scrollIntoView();
  });
  
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  // capture screenshot
  await page.screenshot({ path: 'ghost_numbers.png', fullPage: true });

  await browser.close();
})();
