const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /function screenPlaneForHeight\(h: number\) \{[\s\S]*?return \{[\s\S]*?w: 3\.42 \* ratio,[\s\S]*?h: 1\.93 \* ratio,[\s\S]*?y: 0\.045 \* ratio,[\s\S]*?z: 0\.088 \* ratio,[\s\S]*?\};[\s\S]*?\}/,
  `function screenPlaneForScale(scale: number) {
  return {
    w: 148.22 * scale,
    h: 83.64 * scale,
    y: 1.95 * scale,
    z: 3.81 * scale,
  };
}`
);

code = code.replace(
  /const screen = screenPlaneForHeight\(getTargetHeight\(\)\);/,
  `const screen = screenPlaneForScale(xf.scale);`
);

fs.writeFileSync(file, code);
