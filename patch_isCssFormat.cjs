const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  'const isCssFormat = formatId === "video";',
  'const isCssFormat = false;'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
