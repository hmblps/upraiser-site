const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /pointerEvents: isCssFormat \? "none" : "auto",/g,
  'pointerEvents: "auto",'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
