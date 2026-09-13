const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /const v = document\.createElement\("video"\);/,
  `const v = document.createElement("video");
    v.style.position = "fixed";
    v.style.top = "0";
    v.style.left = "0";
    v.style.width = "1px";
    v.style.height = "1px";
    v.style.opacity = "0";
    v.style.pointerEvents = "none";
    v.style.zIndex = "-1000";`
);

fs.writeFileSync(file, code);
