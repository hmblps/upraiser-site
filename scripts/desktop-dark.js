import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Click theme toggle
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Toggle theme"]');
    if (btn) btn.click();
    // Alternatively, just click the sun/moon icon
    const icon = document.querySelector('.lucide-sun') || document.querySelector('.lucide-moon');
    if (icon) icon.closest('button').click();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  await page.screenshot({ path: 'desktop-dark.png' });
  
  await browser.close();
})();
