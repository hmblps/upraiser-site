import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  console.log("Capturing home light...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  let done = false;
  page.on('console', msg => { if (msg.text().includes("Done ")) done = true; });
  await page.goto(`http://localhost:5173/dev/hero-capture?shot=home&theme=light&frames=150`);
  for (let j = 0; j < 300; j++) {
    if (done) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  await browser.close();
})();
