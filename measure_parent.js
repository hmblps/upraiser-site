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
    return {
      promiseParent: promise.parentElement.tagName,
      promiseParentId: promise.parentElement.id,
      promiseParentClassName: promise.parentElement.className,
      promiseParentBottom: promise.parentElement.getBoundingClientRect().bottom,
      footerTop: document.querySelector('footer').getBoundingClientRect().top
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
