const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /<mesh position=\{\[0, -0\.0035, 0\]\} rotation=\{\[-Math\.PI \/ 2, Math\.PI, 0\]\} scale=\{0\.053\}>/,
  '<mesh position={[0, -0.0035, 0.03]} rotation={[-Math.PI / 2, Math.PI, 0]} scale={0.051}>'
);

code = code.replace(
  /borderRadius: 44,/,
  'borderRadius: 48,\n                    clipPath: "inset(0 round 48px)",\n                    WebkitClipPath: "inset(0 round 48px)",'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
