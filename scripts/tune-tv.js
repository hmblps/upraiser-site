import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/channels');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Click "OEM & CTV" tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const tvTab = tabs.find(t => t.textContent.includes('OEM'));
    if (tvTab) tvTab.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click 3rd dot
  await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('button.format-copy__dot'));
    if (dots.length >= 3) {
      dots[2].click();
    }
  });
  
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'tv-slide3.png' });
  
  // Click 4th dot
  await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('button.format-copy__dot'));
    if (dots.length >= 4) {
      dots[3].click();
    }
  });
  
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'tv-slide4.png' });
  
  await browser.close();
})();
