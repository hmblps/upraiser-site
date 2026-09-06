import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  
  for (let i = 1; i <= 4; i++) {
    console.log(`Capturing batch ${i}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    let done = false;
    page.on('console', msg => {
      const text = msg.text();
      // console.log(text);
      if (text.includes("Done ")) {
        console.log("->", text);
        done = true;
      }
    });

    await page.goto(`http://localhost:5173/dev/hero-capture?batch=${i}&frames=150`);
    
    for (let j = 0; j < 300; j++) {
      if (done) break;
      await new Promise(r => setTimeout(r, 1000));
    }
    
    await page.close();
  }
  
  await browser.close();
})();
