import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const text = document.querySelector('#promise .section-description');
    const footer = document.querySelector('footer');
    const promSticky = document.querySelector('#promise .accent-scroll-sticky');
    
    return {
      textBottom: text ? text.getBoundingClientRect().bottom : null,
      promStickyBottom: promSticky ? promSticky.getBoundingClientRect().bottom : null,
      footerTop: footer ? footer.getBoundingClientRect().top : null,
      footerMarginTop: footer ? getComputedStyle(footer).marginTop : null
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
