const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Fix applyScreenTexture signature and logic
code = code.replace(
  /function applyScreenTexture\(root: Object3D, map: Texture\) \{/,
  'function applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {'
);

code = code.replace(
  /applyScreenTexture\(rootRef\.current, still\);/g,
  'applyScreenTexture(rootRef.current, still, formatId);'
);

code = code.replace(
  /applyScreenTexture\(rootRef\.current, videoMaps\[videoIndex\]\);/g,
  'applyScreenTexture(rootRef.current, videoMaps[videoIndex], formatId);'
);

const screenMatLogic = `    const screen = mat as MeshStandardMaterial;
    if (formatId === "rich") {
      screen.map = null;
      screen.emissiveMap = null;
      screen.color.set("#0b1220");
    } else {
      screen.map = map;
      screen.emissiveMap = map;
      screen.color.set("#ffffff");
    }
    screen.emissive = new Color(0xffffff);`;

code = code.replace(
  /const screen = mat as MeshStandardMaterial;[\s\S]*?screen\.emissive = new Color\(0xffffff\);/,
  screenMatLogic
);

// 2. Update Html props and wrapper sizes
// Look for the mesh and Html block
const htmlBlockRegex = /<mesh position=\{\[0, -0\.0035, 0\]\} rotation=\{\[-Math\.PI \/ 2, Math\.PI, 0\]\} scale=\{0\.049\}>[\s\S]*?<div\s*style=\{\{([\s\S]*?width: 320,[\s\S]*?height: 700,[\s\S]*?borderRadius: 38,[\s\S]*?)\}\}/;

code = code.replace(htmlBlockRegex, (match, p1) => {
  let newStyles = p1
    .replace('width: 320,', 'width: 390,')
    .replace('height: 700,', 'height: 844,')
    .replace('borderRadius: 38,', 'borderRadius: 48,');
  return `<mesh position={[0, -0.0035, 0]} rotation={[-Math.PI / 2, Math.PI, 0]} scale={0.038}>\n              <Html transform occlude="blending" distanceFactor={1.42}>\n                <div\n                  style={{${newStyles}}}`;
});

// Update the CSS dynamic island to fit the new 390 width
code = code.replace(
  /width: 100,\s*height: 28,\s*background: "#000",\s*borderRadius: 14,/g,
  'width: 120,\n                    height: 35,\n                    background: "#000",\n                    borderRadius: 17,'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
