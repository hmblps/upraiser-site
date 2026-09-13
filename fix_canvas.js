import fs from 'fs';

const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

// Update camera to 6.1 (precisely counteracts the 1.3x canvas scale)
tsx = tsx.replace(/camera=\{\{ position: \[0, 0\.02, flat \? 5\.7 : 6\.05\], fov: flat \? 30 : 31, near: 0\.1, far: 100 \}\}/, `camera={{ position: [0, 0.02, flat ? 5.75 : 6.1], fov: flat ? 30 : 31, near: 0.1, far: 100 }}`);

// Update style to foolproof center
tsx = tsx.replace(/style=\{\{ width: "130%", height: "130%", left: "-15%", top: "-15%", position: "absolute", display: "block", background: "transparent", pointerEvents: "none" \}\}/, `style={{ width: "130%", height: "130%", left: "50%", top: "50%", transform: "translate(-50%, -50%)", position: "absolute", display: "block", background: "transparent", pointerEvents: "none" }}`);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed HMR camera zoom bug and centering');
