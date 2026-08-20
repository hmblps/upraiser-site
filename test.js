import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5175');
  await page.waitForTimeout(2000);
  console.log('Clicking Case...');
  await page.evaluate(() => {
    const caseCards = document.querySelectorAll('.case-preview-card');
    if(caseCards.length > 0) {
      caseCards[0].click();
    }
  });
  await page.waitForTimeout(1000);
  await browser.close();
})();
