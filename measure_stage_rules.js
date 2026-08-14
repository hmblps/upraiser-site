import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // ensure hydration
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const res = await page.evaluate(() => {
    const stage = document.querySelector('#promise .accent-scroll-stage');
    
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && stage.matches(rule.selectorText)) {
            rules.push({ selector: rule.selectorText, cssText: rule.cssText });
          }
        }
      } catch (e) {}
    }
    
    // Check media queries as well
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSMediaRule) {
            if (window.matchMedia(rule.conditionText).matches) {
              for (const mRule of rule.cssRules) {
                if (mRule.selectorText && stage.matches(mRule.selectorText)) {
                  rules.push({ selector: mRule.selectorText, cssText: mRule.cssText, media: rule.conditionText });
                }
              }
            }
          }
        }
      } catch (e) {}
    }

    return rules;
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
