const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /<mesh position=\{\[0, -0.0035, 0\]\} rotation=\{\[-Math.PI \/ 2, 0, 0\]\}>/,
  '<mesh position={[0, -0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1/7.0}>'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
