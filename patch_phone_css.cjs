const fs = require('fs');
let code = fs.readFileSync('src/styles/phone-css-3d.css', 'utf8');

code = code.replace(
  /\/\* LOCKED: Rich Media HTML overlay retired(.*?)\.phone-rich-on-glb \{\n  display: none !important;\n\}/s,
  `/* Rich Media HTML overlay */
.phone-rich-on-glb {
  position: absolute;
  z-index: 6;
  pointer-events: auto;
  height: 80%;
  width: auto;
  aspect-ratio: 9 / 19.45;
  left: 50%;
  top: 50%;
  /* Transform is now applied dynamically via Framer Motion in Phone3D.tsx */
  transform-style: preserve-3d;
  border-radius: clamp(1.4rem, 2.8vw, 1.9rem);
  overflow: hidden;
  background: #0b1220;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.55),
    0 10px 30px rgba(0, 0, 0, 0.2);
  touch-action: manipulation;
  user-select: none;
}`
);

fs.writeFileSync('src/styles/phone-css-3d.css', code);
