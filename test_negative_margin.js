import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  // apply negative margin to promise section
  await page.evaluate(() => {
    document.querySelector('#promise').style.marginBottom = '-14px';
  });

  const res = await page.evaluate(() => {
    const text = document.querySelector('#promise .section-description');
    const pilot = document.querySelector('#pilot');
    return {
      textBottom: text.getBoundingClientRect().bottom,
      pilotTop: pilot.getBoundingClientRect().top,
      gap: pilot.getBoundingClientRect().top - text.getBoundingClientRect().bottom
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
