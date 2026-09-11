const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /<Html transform occlude="blending" distanceFactor=\{1\.42\} position=\{\[0, 0\.0035, 0\]\}>/,
  '<Html transform occlude="blending" distanceFactor={1.42}>'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
