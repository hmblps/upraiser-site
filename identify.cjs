const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = '/Users/homeboylebz/.gemini/antigravity/brain/395d22e9-7cf1-4042-9e6c-43aa45ecff2a/.user_uploaded/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('media_17861055'));

for (const f of files) {
  const p = path.join(dir, f);
  const size = fs.statSync(p).size;
  // Get average color using ImageMagick
  try {
    const avg = execSync(`magick "${p}" -scale 1x1\\! -format "%[pixel:p{0,0}]" info:`).toString().trim();
    console.log(`${f} (${size} bytes): ${avg}`);
  } catch(e) {
    console.log(`${f} (${size} bytes): ImageMagick failed`);
  }
}
