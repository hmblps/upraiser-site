const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /w: 3\.52 \* ratio,\n\s*h: 1\.99 \* ratio,\n\s*y: 0\.038 \* ratio,/,
  `w: 3.68 * ratio,
    h: 2.10 * ratio,
    y: -0.02 * ratio,`
);

fs.writeFileSync(file, code);
