import fs from 'fs';
let css = fs.readFileSync('src/styles/programmatic-scroll-section.css', 'utf8');

const originalBlock = `.prog-device-slot .tablet-glb-canvas,
.prog-device-slot .phone-glb-canvas,
.prog-device-slot .tv-glb-canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
}`;

const newBlock = `.prog-device-slot .tablet-glb-canvas,
.prog-device-slot .phone-glb-canvas,
.prog-device-slot .tv-glb-canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
}

/* Widen actual 3D WebGL canvases to prevent horizontal FOV clipping of the wide models */
.prog-device-slot .tablet-glb-canvas,
.prog-device-slot .phone-glb-canvas {
  width: 150% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  flex-shrink: 0 !important;
  margin-top: 0 !important;
}

/* TV doesn't need 150% because its slot is already very wide. 
   If we use 150%, it overlaps the text on the right. 
   We just give it 115% to stop clipping but prevent heavy overlap. */
.prog-device-slot .tv-glb-canvas {
  width: 110% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  flex-shrink: 0 !important;
  margin-top: 0 !important;
}`;

css = css.replace(originalBlock, newBlock);
fs.writeFileSync('src/styles/programmatic-scroll-section.css', css);
console.log("Canvas fix applied!");
