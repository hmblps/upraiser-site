const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

// 1. Fix the screen plane dimensions to eliminate gaps
code = code.replace(
  /w: 3\.42 \* ratio,[\s\S]*?h: 1\.93 \* ratio,[\s\S]*?y: 0\.045 \* ratio,/,
  `w: 3.52 * ratio,
    h: 1.99 * ratio,
    y: 0.038 * ratio,`
);

// 2. Decouple video loading from inView
code = code.replace(
  /useEffect\(\(\) => \{\n\s*if \(!showScreen \|\| !inView \|\| !videoSrc\) \{\n\s*video\.pause\(\);\n\s*return;\n\s*\}\n\n\s*let promoted = false;[\s\S]*?video\.src = videoSrc;[\s\S]*?\}\n\s*\}, \[showScreen, inView, videoSrc, video, videoTex\]\);/,
  `const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = inView;
    if (inView && modeRef.current === "video") {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, video]);

  useEffect(() => {
    if (!showScreen || !videoSrc) {
      video.pause();
      return;
    }

    let cancelled = false;
    let promoted = false;
    const promote = () => {
      if (cancelled || promoted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      videoTex.flipY = true;
      videoTex.needsUpdate = true;
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });
      if (playingRef.current) {
        void video.play().catch(() => {
          modeRef.current = "still";
        });
      }
    };

    video.src = videoSrc;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
    };
  }, [showScreen, videoSrc, video, videoTex]);`
);

fs.writeFileSync(file, code);
