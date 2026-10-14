import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, '../preview-windows');

async function captureWindowsPreview() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🚀 Launching headless Chromium with Windows environment emulation...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Emulate Windows 10/11 User Agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  );

  // Typical Windows 15.6" laptop: 1080p with 125% OS Display Scaling (1536x864, DPR 1.25)
  await page.setViewport({
    width: 1536,
    height: 864,
    deviceScaleFactor: 1.25,
  });

  console.log('📡 Navigating to http://localhost:5173/channels?os=windows ...');
  await page.goto('http://localhost:5173/channels?os=windows', { waitUntil: 'networkidle2' });

  // Wait for initial WebGL models & textures to warm up
  await new Promise((r) => setTimeout(r, 2000));

  // Check for horizontal overflow (common Windows bug when scrollbars or wide canvases miscalculate)
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(
    `📏 Viewport check: ${overflow.innerWidth}px | Content width: ${overflow.scrollWidth}px | Horizontal overflow: ${
      overflow.hasOverflow ? '⚠️ YES' : '✓ NO'
    }`
  );

  // 1. Phone screenshot
  console.log('📸 Capturing Windows 125% Phone...');
  const phonePath = path.join(OUTPUT_DIR, 'windows-01-phone.png');
  await page.screenshot({ path: phonePath });
  console.log(`   Saved: ${phonePath}`);

  // 2. Tablet screenshot (Scroll to Tablet stage ~format 5)
  console.log('📸 Scrolling to Tablet stage...');
  await page.evaluate(() => {
    const section = document.getElementById('channels-scroll');
    if (section) {
      const scrollable = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: scrollable * 0.55, behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  const tabletPath = path.join(OUTPUT_DIR, 'windows-02-tablet.png');
  await page.screenshot({ path: tabletPath });
  console.log(`   Saved: ${tabletPath}`);

  // 3. TV screenshot (Scroll to TV stage ~format 8)
  console.log('📸 Scrolling to TV stage...');
  await page.evaluate(() => {
    const section = document.getElementById('channels-scroll');
    if (section) {
      const scrollable = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: scrollable * 0.85, behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  const tvPath = path.join(OUTPUT_DIR, 'windows-03-tv.png');
  await page.screenshot({ path: tvPath });
  console.log(`   Saved: ${tvPath}`);

  // 4. Lite tier (Intel GPU / weak Windows laptop fallback)
  console.log('\n💻 Testing Windows Intel GPU / Lite fallback (?tier=lite)...');
  await page.goto('http://localhost:5173/channels?os=windows&tier=lite', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  const litePhonePath = path.join(OUTPUT_DIR, 'windows-lite-01-phone.png');
  await page.screenshot({ path: litePhonePath });
  console.log(`   Saved: ${litePhonePath}`);

  // 5. Also test 150% scaling (1280x720, popular on 13"-14" compact laptops)
  console.log('\n🔍 Testing compact Windows laptop (1280x720, 150% scale)...');
  await page.goto('http://localhost:5173/channels?os=windows', { waitUntil: 'networkidle2' });
  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1.5,
  });
  await new Promise((r) => setTimeout(r, 800));
  const compactPhonePath = path.join(OUTPUT_DIR, 'windows-compact-150-phone.png');
  await page.screenshot({ path: compactPhonePath });
  console.log(`   Saved: ${compactPhonePath}`);

  await browser.close();
  console.log('\n✨ Windows preview screenshots generated successfully in ./preview-windows/');
}

captureWindowsPreview().catch((err) => {
  console.error('Error generating Windows preview:', err);
  process.exit(1);
});
