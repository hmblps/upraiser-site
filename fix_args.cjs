const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(/applyScreenTexture\((rootRef\.current|root), (still|videoTex), formatId\)/g, 'applyScreenTexture($1, $2)');

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
