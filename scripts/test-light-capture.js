import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/dev/hero-capture?shot=home&theme=light&frames=2');
  
  await new Promise(r => setTimeout(r, 6000));
  
  await page.screenshot({ path: 'test-light-capture.png' });
  
  await browser.close();
})();
