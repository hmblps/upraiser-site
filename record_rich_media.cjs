const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('public'));

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server running on port ${port}`);
  
  // Create a wrapper HTML file that perfectly emulates the Phone3D iframe scaling
  const wrapperHtml = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    body, html { margin: 0; padding: 0; background: #000; width: 780px; height: 1688px; overflow: hidden; }
    .ad-frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 320px;
      height: 630px;
      transform-origin: top left;
      transform: scale(2.4375); /* 780 / 320 */
      border: none;
    }
  </style>
  </head>
  <body>
    <iframe class="ad-frame" id="adIframe" src="http://localhost:${port}/rich-media-ad.html"></iframe>
  </body>
  </html>
  `;
  fs.writeFileSync('public/record-wrapper.html', wrapperHtml);
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--autoplay-policy=no-user-gesture-required',
      '--force-device-scale-factor=1' // FORCE 1x scale because our viewport is already the physical size!
    ]
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // The viewport is exactly the 3D texture size
  await page.setViewport({ width: 780, height: 1688, deviceScaleFactor: 1 });
  
  const Config = {
    followNewTab: false,
    fps: 60,
    ffmpeg_Path: null,
    videoFrame: { width: 780, height: 1688 }
  };
  
  const recorder = new PuppeteerScreenRecorder(page, Config);
  
  console.log('Loading page...');
  await page.goto(`http://localhost:${port}/record-wrapper.html`, { waitUntil: 'networkidle0' });
  
  console.log('Forcing video play...');
  await page.evaluate(() => {
    // Access the iframe content
    const iframe = document.getElementById('adIframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Prevent navigation in iframe
    iframe.contentWindow.open = function() {}; 
    
    const v = iframeDoc.getElementById('adVideo');
    if (v) {
      v.muted = true;
      v.play().then(() => console.log('Video playing')).catch(e => console.log('Video error:', e.message));
    }
  });
  
  const savePath = path.join(__dirname, 'public/channels/programmatic-feed/formats/rich.mp4');
  await recorder.start(savePath);
  console.log('Recording started...');
  
  await new Promise(r => setTimeout(r, 1500));
  
  for (let i = 1; i <= 5; i++) {
    console.log(`Click ${i}...`);
    await page.evaluate(() => {
      const iframe = document.getElementById('adIframe');
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const btn = iframeDoc.getElementById('ctaBtn');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 3200)); 
  }
  
  await recorder.stop();
  console.log('Recording stopped. Saved to ' + savePath);
  
  fs.unlinkSync('public/record-wrapper.html');
  await browser.close();
  server.close();
});
