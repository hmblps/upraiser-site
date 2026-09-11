const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// The current mesh is:
// <mesh position={[0, -0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1/7.0}>
code = code.replace(
  /<mesh position=\{\[0, -0\.0035, 0\]\} rotation=\{\[-Math\.PI \/ 2, 0, 0\]\} scale=\{1\/7\.0\}>/,
  '<mesh position={[0, -0.0035, 0]} rotation={[-Math.PI / 2, Math.PI, 0]} scale={0.094}>'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
