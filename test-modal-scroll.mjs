import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // scroll to Clients
  await page.evaluate(() => {
     window.scrollTo(0, 4000);
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // click any client logo
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('button'));
     const clientBtn = btns.find(b => b.classList.contains('partner-logo-slot'));
     if (clientBtn) clientBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'modal-open.png' });
  
  // attempt to scroll modal
  await page.evaluate(() => {
     const modal = document.querySelector('.case-detail-modal__panel');
     if (modal) modal.scrollTo(0, 1000);
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'modal-scrolled.png' });

  console.log('Screenshots saved');
  await browser.close();
})();
