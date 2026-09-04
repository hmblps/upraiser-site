import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 640 });
  
  await page.goto('http://localhost:5173/');
  // wait for animations
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_home.png' });

  await page.goto('http://localhost:5173/company');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_company.png' });

  await page.goto('http://localhost:5173/solutions');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_solutions.png' });

  await browser.close();
})();
