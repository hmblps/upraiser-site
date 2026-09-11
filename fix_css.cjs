const fs = require('fs');
let code = fs.readFileSync('src/styles/phone-css-3d.css', 'utf8');

const replacement = `.phone-rich-on-glb {
  position: absolute;
  z-index: 6;
  pointer-events: auto;
  height: 89%;
  width: auto;
  aspect-ratio: 9 / 19.45;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -48.2%) rotateX(-2.86deg) rotateY(6.87deg);
  border-radius: 44px;
  clip-path: inset(0 round 44px);
  -webkit-clip-path: inset(0 round 44px);
  overflow: hidden;
  background: #0b1220;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.55);
}

.phone-rich-on-glb iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}`;

// Find the existing block and replace it
code = code.replace(
  /\.phone-rich-on-glb\s*\{[\s\S]*?(?=\n\n|\Z)/,
  replacement
);

fs.writeFileSync('src/styles/phone-css-3d.css', code);
