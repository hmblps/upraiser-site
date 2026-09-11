const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /occlude="blending"/,
  '/* occlude removed for hole punch */'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
