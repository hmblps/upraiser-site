import fs from 'fs';

// 1. Fix CSS
const cssFile = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/\.prog-device-slot--tv \.tv-glb-canvas \{[\s\S]*?\n\}/, `.prog-device-slot--tv .tv-glb-canvas {
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
}`);
fs.writeFileSync(cssFile, css);

// 2. Fix TSX
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

tsx = tsx.replace(/function getTargetHeight\(\) \{\n  return [\d.]+;\n\}/, `function getTargetHeight() {\n  return 1.65;\n}`);

tsx = tsx.replace(/function screenPlaneForHeight\(h: number\) \{\n  return \{\n    w: 3\.44,[^\}]+\n  \};\n\}/, `function screenPlaneForHeight(h: number) {
  const ratio = h / 2.15;
  return {
    w: 3.44 * ratio,
    h: 1.94 * ratio,
    y: 0.048 * ratio,
    z: 0.088 * ratio,
  };
}`);

tsx = tsx.replace(/camera=\{\{ position: \[0, 0\.02, flat \? 5\.75 : 6\.1\], fov: flat \? 30 : 31, near: 0\.1, far: 100 \}\}/, `camera={{ position: [0, 0.02, flat ? 4.4 : 4.65], fov: flat ? 30 : 31, near: 0.1, far: 100 }}`);
tsx = tsx.replace(/style=\{\{ width: "130%", height: "130%", left: "50%", top: "50%", transform: "translate\(-50%, -50%\)", position: "absolute", display: "block", background: "transparent", pointerEvents: "none" \}\}/, `style={{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" }}`);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed final');
