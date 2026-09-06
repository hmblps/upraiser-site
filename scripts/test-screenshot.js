import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/dev/hero-capture?batch=1&frames=150');
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'mountain-check.png' });
  await browser.close();
})();
