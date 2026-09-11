const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /scale=\{0\.048\}/,
  'scale={0.049}'
);

code = code.replace(
  /height: 693,/,
  'height: 700,'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
