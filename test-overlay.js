import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Set dark theme
  await page.evaluate(() => {
    localStorage.setItem('upraiser-theme', 'dark');
  });
  await page.reload();
  await new Promise(r => setTimeout(r, 2000));

  const elAtPoint = await page.evaluate(() => {
    // Check what is at the top right where the theme switcher usually is (e.g. x: 1200, y: 50)
    const el = document.elementFromPoint(1200, 50);
    return el ? { tag: el.tagName, className: el.className, id: el.id, style: el.getAttribute('style') } : null;
  });
  
  console.log('Element at (1200, 50):', elAtPoint);

  const elAtMiddle = await page.evaluate(() => {
    const el = document.elementFromPoint(640, 400);
    return el ? { tag: el.tagName, className: el.className, id: el.id } : null;
  });
  console.log('Element at (640, 400):', elAtMiddle);
  
  await browser.close();
})();
