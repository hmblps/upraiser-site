import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 1280 });
  
  let done = false;
  page.on('console', msg => {
    const text = msg.text();
    console.log(text);
    if (text.includes("All sequences written")) {
      done = true;
    }
  });

  await page.goto('http://localhost:5173/dev/hero-capture?batch=1&frames=150&mobile=1');
  
  // Wait up to 5 minutes
  for (let i = 0; i < 300; i++) {
    if (done) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  await browser.close();
})();
