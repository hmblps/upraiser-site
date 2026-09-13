const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

const oldCode = `  useEffect(() => {
    if (!showScreen || !inView || !videoSrc) {
      video.pause();
      return;
    }

    let promoted = false;
    const promote = () => {
      if (promoted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      videoTex.flipY = true;
      videoTex.needsUpdate = true;
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });
      void video.play().catch(() => {
        modeRef.current = "still";
      });
    };

    video.src = videoSrc;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
    };
  }, [showScreen, inView, videoSrc, video, videoTex]);`;

const newCode = `  const playingRef = useRef(false);
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
  }, [showScreen, videoSrc, video, videoTex]);`;

if (code.includes(oldCode)) {
    fs.writeFileSync(file, code.replace(oldCode, newCode));
} else {
    console.log("Could not find the target code to replace.");
}

