const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /useEffect\(\(\) => \{\n\s*if \(!showScreen \|\| !inView \|\| !videoSrc\) \{\n\s*video\.pause\(\);\n\s*return;\n\s*\}/,
  `useEffect(() => {
    if (!videoSrc) {
      video.pause();
      return;
    }`
);

code = code.replace(
  /\[showScreen, inView, videoSrc, video, videoTex\]\);/,
  `[videoSrc, video, videoTex]);

  useEffect(() => {
    if (inView && modeRef.current === "video") {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, video]);`
);

fs.writeFileSync(file, code);
