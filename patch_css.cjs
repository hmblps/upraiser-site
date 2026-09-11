const fs = require('fs');
let code = fs.readFileSync('src/styles/phone-css-3d.css', 'utf8');

code = code.replace(
  /transform-style: preserve-3d;/g,
  '/* transform-style removed to prevent Safari WebGL z-fighting */'
);

fs.writeFileSync('src/styles/phone-css-3d.css', code);
