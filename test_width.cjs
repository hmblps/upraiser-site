const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
app.use(express.static('public'));
const server = app.listen(0, async () => {
  const port = server.address().port;
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Logical size 780x1688
  await page.setViewport({ width: 780, height: 1688, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/rich-media-ad.html`, { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) meta.content = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no";
    
    document.body.style.transform = 'scale(2)';
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = '390px';
    document.body.style.height = '844px';
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  const widths = await page.evaluate(() => {
    return {
      windowInnerWidth: window.innerWidth,
      bodyClientWidth: document.body.clientWidth,
      adWidth: document.querySelector('.ad').clientWidth
    };
  });
  console.log(widths);
  
  await page.screenshot({ path: 'test_scale.png' });
  
  await browser.close();
  server.close();
});
