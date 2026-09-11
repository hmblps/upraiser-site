const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /scale=\{0\.045\}/,
  'scale={0.084}'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
