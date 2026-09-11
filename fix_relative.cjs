const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /width: 320,/,
  'position: "relative",\n                    width: 320,'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
