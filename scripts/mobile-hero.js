import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set to mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:5173/');
  
  await new Promise(r => setTimeout(r, 4000)); // wait for video to load
  
  await page.screenshot({ path: 'mobile-hero.png' });
  
  await browser.close();
})();
