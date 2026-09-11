const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /meshReady && !isCssFormat \? "opacity-100" : "opacity-0"/g,
  '"opacity-100"' // force visibility
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
