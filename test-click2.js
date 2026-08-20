import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5175');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => { window.scrollTo(0, 1500); });
  await new Promise(r => setTimeout(r, 1000));

  const coords = await page.evaluate(() => {
    const el = document.querySelector('.partner-logo-slot');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  
  if (!coords) {
    console.log("No logo found");
    process.exit(1);
  }
  
  console.log(`Clicking at ${coords.x}, ${coords.y}`);
  
  const elAtPoint = await page.evaluate(({x, y}) => {
    const el = document.elementFromPoint(x, y);
    return el ? { tag: el.tagName, className: el.className, id: el.id } : null;
  }, coords);
  
  console.log('Element at point:', elAtPoint);
  
  await browser.close();
})();
