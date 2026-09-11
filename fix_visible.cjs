const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /if \(formatId === "rich"\) \{\s*screen\.visible = false;\s*\}/,
  'screen.visible = formatId !== "rich";'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
