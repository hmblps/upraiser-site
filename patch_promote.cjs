const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /void video\.play\(\)\.catch\(\(\) => \{\n\s*modeRef\.current = "still";\n\s*\}\);/,
  `// Let the inView useEffect handle playback
      if (video.paused && modeRef.current === "video" && video.style.display !== "none") {
         // wait for inView to trigger playback
      }`
);

fs.writeFileSync(file, code);
