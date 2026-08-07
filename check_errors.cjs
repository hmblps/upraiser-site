const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('http://localhost:5174/solutions', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
  console.log("Screenshot saved.");
})();
