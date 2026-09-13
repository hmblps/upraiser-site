import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# I will find the block starting with:
#  useEffect(() => {
#    if (!showScreen || !stillSrc) return;
# And ending with:
#      video.pause();
#    };
#  }, [showScreen, videoSrc, video, videoTex]);

start_idx = code.find("  useEffect(() => {\n    if (!showScreen || !stillSrc) return;")
end_str = "  }, [showScreen, videoSrc, video, videoTex]);\n"
end_idx = code.find(end_str, start_idx) + len(end_str)

replacement = r'''  const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = inView;
    if (inView && modeRef.current === "video") {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, video]);

  useEffect(() => {
    if (!showScreen) return;
    let cancelled = false;

    if (videoSrc) {
      let promoted = false;
      const promote = () => {
        if (cancelled || promoted) return;
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
    } else if (stillSrc) {
      if (playingRef.current) {
        playingRef.current = false;
        video.pause();
      }
      const loader = new TextureLoader();
      loader.load(stillSrc, (tex) => {
        if (cancelled) return;
        tex.colorSpace = SRGBColorSpace;
        tex.minFilter = LinearFilter;
        tex.magFilter = LinearFilter;
        tex.flipY = true;
        tex.needsUpdate = true;
        modeRef.current = "still";
        setScreenMap(tex);
      });
      return () => { cancelled = true; };
    }
  }, [showScreen, videoSrc, stillSrc, video, videoTex]);
'''

new_code = code[:start_idx] + replacement + code[end_idx:]

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(new_code)

