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

  // scroll down to scale section (which is PROOF in infrastructure mode)
  await page.evaluate(() => {
    const el = document.querySelector('#scale');
    if (el) el.scrollIntoView();
  });
  
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  // capture screenshot
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/395d22e9-7cf1-4042-9e6c-43aa45ecff2a/scratch/fraud_screenshot.png', fullPage: true });

  await browser.close();
})();
