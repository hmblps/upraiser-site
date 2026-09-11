const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /scale=\{0\.054\}/,
  'scale={0.048}'
);

code = code.replace(
  /height: 655,/,
  'height: 693,'
);

code = code.replace(
  /borderRadius: 45,/,
  'borderRadius: 38,'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
