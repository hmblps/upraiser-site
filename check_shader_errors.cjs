const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const scratchDir = '/Users/homeboylebz/.gemini/antigravity/brain/395d22e9-7cf1-4042-9e6c-43aa45ecff2a/scratch';
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  const screenshotPath = path.join(scratchDir, 'screenshot.png');

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
    if (type === 'error' || text.includes('Shader Error') || text.includes('THREE.WebGLProgram')) {
      consoleErrors.push(`[CONSOLE ${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message || err.toString());
  });

  console.log('Navigating to http://localhost:5173 ...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log('Navigation networkidle0 timed out or finished with note:', e.message);
  }

  console.log('Waiting 5 seconds for page & WebGL to render...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Scroll a bit to trigger any scroll-based shaders/renders
  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Screenshot saved to ${screenshotPath}`);

  await browser.close();

  console.log('=== ALL CONSOLE LOGS ===');
  consoleLogs.forEach(l => console.log(`[${l.type.toUpperCase()}] ${l.text}`));

  console.log('=== CONSOLE ERRORS & SHADER ERRORS ===');
  if (consoleErrors.length === 0) {
    console.log('No console error messages detected.');
  } else {
    consoleErrors.forEach(e => console.log(e));
  }

  console.log('=== PAGE UNCAUGHT ERRORS ===');
  if (pageErrors.length === 0) {
    console.log('No uncaught page errors detected.');
  } else {
    pageErrors.forEach(e => console.log(e));
  }
})();
