import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5175');
  await new Promise(r => setTimeout(r, 2000));
  
  // Find the exact coordinates of the first case card
  const coords = await page.evaluate(() => {
    const el = document.querySelector('.case-preview-card');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  
  if (!coords) {
    console.log("No case card found");
    process.exit(1);
  }
  
  console.log(`Clicking at ${coords.x}, ${coords.y}`);
  
  // What element is at that point?
  const elAtPoint = await page.evaluate(({x, y}) => {
    const el = document.elementFromPoint(x, y);
    return el ? { tag: el.tagName, className: el.className, id: el.id } : null;
  }, coords);
  
  console.log('Element at point:', elAtPoint);
  
  await browser.close();
})();
