const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /scale=\{0\.058\}/,
  'scale={0.054}'
);

code = code.replace(
  /height: 693,/,
  'height: 655,'
);

code = code.replace(
  /borderRadius: 38,/,
  'borderRadius: 45,'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
