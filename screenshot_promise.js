import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const el = document.getElementById('promise');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_promise.png' });
  await browser.close();
})();
