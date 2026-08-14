import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const computed = await page.evaluate(() => {
    const audSticky = document.querySelector('#audience .accent-scroll-sticky');
    const promSticky = document.querySelector('#promise .accent-scroll-sticky');

    return {
      audMinHeight: getComputedStyle(audSticky).minHeight,
      audScrollTop: getComputedStyle(audSticky).getPropertyValue('--scroll-sticky-top'),
      promMinHeight: getComputedStyle(promSticky).minHeight,
      promScrollTop: getComputedStyle(promSticky).getPropertyValue('--scroll-sticky-top'),
    };
  });
  console.log(JSON.stringify(computed, null, 2));
  await browser.close();
})();
