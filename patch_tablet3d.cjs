const fs = require('fs');
let code = fs.readFileSync('src/components/channel-visuals/Tablet3D.tsx', 'utf8');

code = code.replace(
  /<TabletModel screenMap=\{screenMap\} \/>/,
  `<TabletModel screenMap={screenMap} contentScaleX={formatId === "system-ui" ? 0.90 : 1} />`
);

fs.writeFileSync('src/components/channel-visuals/Tablet3D.tsx', code);
