const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /box\.getSize\(size\);/,
  `box.getSize(size); console.log("TV SIZE Y IS", size.y, "SCALE IS", getTargetHeight() / Math.max(size.y, 0.001));`
);

fs.writeFileSync(file, code);
