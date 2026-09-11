const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// Replace the whole Html block to be sure
const htmlBlockRegex = /<Html[\s\S]*?>/;
code = code.replace(htmlBlockRegex, '<Html transform occlude="blending" distanceFactor={1.42} position={[0, 0.0035, 0]}>');

// Remove screen.visible toggle completely
code = code.replace(/if \(formatId\) screen\.visible = formatId !== "rich";/g, '');

// Also, wait! If I set rotation={[-Math.PI / 2, Math.PI, 0]} on the mesh earlier to fix mirroring...
// If the phone was never actually mirrored (it just looked mirrored because we saw the BACK of it through the hole punch!),
// then I should REVERT the rotation to [-Math.PI / 2, 0, 0]!
code = code.replace(
  /rotation=\{\[-Math\.PI \/ 2, Math\.PI, 0\]\}/,
  'rotation={[-Math.PI / 2, 0, 0]}'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
