const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /function applyScreenTexture\(root: Object3D, map: Texture, formatId\?: string\) \{/,
  'function applyScreenTexture(root: Object3D, map: Texture) {'
);

code = code.replace(
  /applyScreenTexture\(rootRef\.current, still, formatId\);/g,
  'applyScreenTexture(rootRef.current, still);'
);

code = code.replace(
  /applyScreenTexture\(rootRef\.current, videoMaps\[videoIndex\], formatId\);/g,
  'applyScreenTexture(rootRef.current, videoMaps[videoIndex]);'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
