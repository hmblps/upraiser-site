import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 720 });
  
  // Set theme to dark in localStorage before loading
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('upraiser-theme', 'dark');
  });
  
  await page.goto('http://localhost:5173/');
  
  await new Promise(r => setTimeout(r, 6000));
  
  await page.screenshot({ path: 'test-dark-real.png' });
  
  await browser.close();
})();
