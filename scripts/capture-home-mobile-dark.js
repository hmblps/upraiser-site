import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 1280 });
  
  let done = false;
  page.on('console', msg => {
    const text = msg.text();
    console.log(text);
    if (text.includes("CAPTURE STATUS: Done home-mobile dark")) {
      done = true;
    }
  });

  await page.goto('http://localhost:5173/dev/hero-capture?shot=home&theme=dark&frames=150&mobile=1');
  
  for (let i = 0; i < 150; i++) {
    if (done) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();
})();
