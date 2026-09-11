const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// Ensure isCssFormat is ALWAYS false to force the 3D phone for everything.
code = code.replace(
  /const isCssFormat = .*/,
  'const isCssFormat = false;'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
