const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /function applyScreenTexture\(root: Object3D, map: Texture\) \{/,
  'function applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {'
);

code = code.replace(
  /applyScreenTexture\(rootRef.current, still\);/g,
  'applyScreenTexture(rootRef.current, still, formatId);'
);

code = code.replace(
  /applyScreenTexture\(rootRef.current, videoMaps\[videoIndex\]\);/g,
  'applyScreenTexture(rootRef.current, videoMaps[videoIndex], formatId);'
);

code = code.replace(
  /screen\.visible = formatId !== "rich";/,
  'if (formatId) screen.visible = formatId !== "rich";'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
