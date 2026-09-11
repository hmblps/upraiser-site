const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /<mesh position=\{\[0, -0\.0035, 0\.03\]\} rotation=\{\[-Math\.PI \/ 2, Math\.PI, 0\]\} scale=\{0\.051\}>/,
  '<mesh position={[0, -0.0035, 0.085]} rotation={[-Math.PI / 2, Math.PI, 0]} scale={0.051}>'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
