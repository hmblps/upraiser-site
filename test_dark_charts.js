import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    localStorage.setItem('theme', 'infrastructure');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  // scroll to PROOF (scale id in DOM)
  await page.evaluate(() => {
    const el = document.querySelector('#scale');
    if (el) el.scrollIntoView();
  });
  
  // wait for scroll animations
  await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

  // capture screenshot of FraudScrollChart
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/395d22e9-7cf1-4042-9e6c-43aa45ecff2a/scratch/fraud_glowing.png', fullPage: true });

  // scroll to PROMISE
  await page.evaluate(() => {
    const el = document.querySelector('#promise');
    if (el) el.scrollIntoView();
  });
  
  await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

  // capture screenshot of InfrastructureGrid
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/395d22e9-7cf1-4042-9e6c-43aa45ecff2a/scratch/grid_glowing.png', fullPage: true });

  await browser.close();
})();
