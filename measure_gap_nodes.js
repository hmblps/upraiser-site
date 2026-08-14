import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const promise = document.querySelector('#promise');
    let node = promise.nextElementSibling;
    let gapNodes = [];
    while (node && node.tagName !== 'FOOTER') {
      gapNodes.push({
        tag: node.tagName,
        id: node.id,
        className: node.className,
        rect: node.getBoundingClientRect()
      });
      node = node.nextElementSibling;
    }
    return gapNodes;
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
