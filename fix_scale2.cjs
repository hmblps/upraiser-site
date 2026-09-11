const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /scale=\{0\.063\}/,
  'scale={0.045}'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
