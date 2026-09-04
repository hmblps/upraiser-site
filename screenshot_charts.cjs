const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Scroll down smoothly to render charts
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        // Target around 4000px down where charts usually are
        if (totalHeight >= 4000) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'mobile_charts.png' });
  await browser.close();
})();
