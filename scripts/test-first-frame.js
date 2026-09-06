import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5173/dev/hero-capture?batch=1&frames=150');
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
