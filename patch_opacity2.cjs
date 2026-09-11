const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /"opacity-100",/g,
  'meshReady ? "opacity-100" : "opacity-0",'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
