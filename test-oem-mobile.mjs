import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('http://localhost:5173/solutions', { waitUntil: 'networkidle0' });
  
  // click OEM Seat tab
  await page.evaluate(() => {
     const tabs = Array.from(document.querySelectorAll('button'));
     const oemTab = tabs.find(t => t.textContent.includes('OEM'));
     if (oemTab) oemTab.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // scroll down
  await page.evaluate(() => {
     window.scrollTo(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'oem-mobile.png' });
  console.log('Screenshots saved');
  await browser.close();
})();
