import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('TV Box size')) console.log(msg.text());
  });
  
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/channels');
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const tvTab = tabs.find(t => t.textContent.includes('OEM'));
    if (tvTab) tvTab.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('button.format-copy__dot'));
    if (dots.length >= 4) {
      dots[3].click();
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Also log the size.y!
  await page.evaluate(() => {
    // We already modified Tv3D to log the size, but the object stringifies as [object Vector3].
    // I will modify the Tv3D.tsx to log size.y directly!
  });
  await browser.close();
})();
