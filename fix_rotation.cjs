const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /rotation=\{\[-Math\.PI \/ 2, 0, 0\]\}/,
  'rotation={[-Math.PI / 2, Math.PI, 0]}'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
