const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /visibility: isCssFormat \? "hidden" : "visible",/g,
  'visibility: "visible",'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
