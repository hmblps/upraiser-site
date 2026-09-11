const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Remove prepend and zIndexRange
code = code.replace(
  /<Html\s+transform\s+prepend\s+zIndexRange=\{\[-100, -10\]\}\s+distanceFactor=\{1\.42\}\s*>/,
  '<Html transform distanceFactor={1.42} position={[0, 0, 0.01]}>' // Added slight Z offset to sit above screen
);

// 2. Adjust scale to fit inside the screen bezels better.
// Previous scale was 0.094 which was exactly the phone chassis bounds.
// The screen is smaller than the chassis. Let's try 0.088.
code = code.replace(
  /scale=\{0\.094\}/,
  'scale={0.088}'
);

// 3. Remove screen.visible = false logic
code = code.replace(
  /if \(formatId\) screen\.visible = formatId !== "rich";/,
  ''
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
