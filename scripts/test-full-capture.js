import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.setViewport({ width: 1280, height: 720 });
  // Let's capture only 5 frames to see if it works quickly
  await page.goto('http://localhost:5173/dev/hero-capture?batch=1&frames=5');
  await new Promise(r => setTimeout(r, 10000));
  await browser.close();
})();
