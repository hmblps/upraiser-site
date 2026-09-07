import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // click toggle to infrastructure mode
  await page.evaluate(() => {
     const toggle = document.querySelector('button[role="switch"]');
     if (toggle) toggle.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // scroll down
  await page.evaluate(() => {
     window.scrollTo(0, 2500);
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'fraud-chart.png' });

  console.log('Screenshots saved');
  await browser.close();
})();
