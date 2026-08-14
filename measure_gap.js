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
    const footer = document.querySelector('footer');
    
    return {
      promiseBottom: promise ? promise.getBoundingClientRect().bottom : null,
      promisePaddingBottom: getComputedStyle(promise).paddingBottom,
      footerTop: footer ? footer.getBoundingClientRect().top : null,
      footerMarginTop: getComputedStyle(footer).marginTop
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
