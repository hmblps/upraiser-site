const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /w: 3\.42 \* ratio,[\s\S]*?h: 1\.93 \* ratio,[\s\S]*?y: 0\.045 \* ratio,/,
  `w: 3.53 * ratio,
    h: 1.99 * ratio,
    y: 0.038 * ratio,`
);

fs.writeFileSync(file, code);
