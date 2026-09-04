import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 640 });
  
  // Helper to toggle theme
  const toggleTheme = async () => {
    await page.evaluate(() => {
      document.querySelector('button[title="Switch content mode"]')?.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  };

  const capture = async (path, name) => {
    await page.goto(`http://localhost:5173${path}`);
    await new Promise(r => setTimeout(r, 2000)); // wait for anims
    
    // Dark theme (default usually, or wait let's force dark by checking html data-theme)
    await page.evaluate(() => {
      if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.querySelector('button[title="Switch content mode"]')?.click();
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_${name}_dark.png` });

    // Light theme
    await toggleTheme();
    await page.screenshot({ path: `/Users/homeboylebz/.gemini/antigravity/brain/1b293a14-873c-4016-ac3d-ee23bbc8822a/win_${name}_light.png` });
  };

  await capture('/', 'home');
  await capture('/contact', 'contact');

  await browser.close();
})();
