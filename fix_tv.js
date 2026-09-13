import fs from 'fs';
const file = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(file, 'utf8');

// 1. screenPlaneForHeight
tsx = tsx.replace(/function screenPlaneForHeight\(h: number\) \{[\s\S]*?\}/, `function screenPlaneForHeight(h: number) {
  return {
    w: 3.76,
    h: 2.12,
    y: 0.02,
    z: 0.125,
  };
}`);

// 2. rot limits
tsx = tsx.replace(/rotY\.set\(Math\.max\(-0\.18, Math\.min\(0\.18, rotY\.get\(\) \+ dx \* 0\.004\)\)\);/, 'rotY.set(Math.max(-0.12, Math.min(0.12, rotY.get() + dx * 0.004)));');
tsx = tsx.replace(/rotX\.set\(Math\.max\(-0\.08, Math\.min\(0\.08, rotX\.get\(\) - dy \* 0\.0025\)\)\);/, 'rotX.set(Math.max(-0.06, Math.min(0.06, rotX.get() - dy * 0.0025)));');

// 3. camera Z
tsx = tsx.replace(/camera=\{\{ position: \[0, 0\.05, flat \? 4\.35 : 4\.65\], fov: flat \? 30 : 31, near: 0\.1, far: 100 \}\}/, 'camera={{ position: [0, 0.05, flat ? 4.75 : 5.05], fov: flat ? 30 : 31, near: 0.1, far: 100 }}');

fs.writeFileSync(file, tsx);
console.log('Tv3D re-fixed safely');
