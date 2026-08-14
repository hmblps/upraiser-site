import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const rects = await page.evaluate(() => {
    function getH(el) { return el ? el.getBoundingClientRect().height : null; }
    function getMargin(el) { return el ? getComputedStyle(el).margin : null; }
    function getPadding(el) { return el ? getComputedStyle(el).padding : null; }
    function getBottomGap(parent, child) {
      if (!parent || !child) return null;
      return parent.getBoundingClientRect().bottom - child.getBoundingClientRect().bottom;
    }

    const audSticky = document.querySelector('#audience .accent-scroll-sticky');
    const audStack = document.querySelector('#audience .section-stack');
    const audDesc = document.querySelector('#audience .section-description');
    
    const promSticky = document.querySelector('#promise .accent-scroll-sticky');
    const promStack = document.querySelector('#promise .section-stack');
    const promDesc = document.querySelector('#promise .section-description');

    return {
      aud: {
        stackHeight: getH(audStack),
        stackMargin: getMargin(audStack),
        stickyHeight: getH(audSticky),
        stickyPadding: getPadding(audSticky),
        bottomGap: getBottomGap(audSticky, audDesc)
      },
      prom: {
        stackHeight: getH(promStack),
        stackMargin: getMargin(promStack),
        stickyHeight: getH(promSticky),
        stickyPadding: getPadding(promSticky),
        bottomGap: getBottomGap(promSticky, promDesc)
      }
    };
  });
  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
