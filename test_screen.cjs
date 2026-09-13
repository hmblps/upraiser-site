const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /const screen = screenPlaneForScale\(xf\.scale\);/,
  `const screen = screenPlaneForScale(xf.scale); console.log("SCREEN IS", screen, "XF.SCALE", xf.scale);`
);

fs.writeFileSync(file, code);
