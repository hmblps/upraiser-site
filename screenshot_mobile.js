import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // iPhone 14 Pro sizing
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:5173/');
  // wait for animations
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/mobile_home.png', fullPage: false });

  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/mobile_scroll.png', fullPage: false });

  await browser.close();
})();
