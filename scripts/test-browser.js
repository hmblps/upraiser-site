import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAIL:', req.url(), req.failure()?.errorText));
  
  await page.goto('http://localhost:5173/dev/hero-capture?batch=1&frames=150', { waitUntil: 'networkidle2' });
  
  setTimeout(async () => {
    await browser.close();
  }, 3000);
})();
