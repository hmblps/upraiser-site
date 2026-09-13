import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

target = r'''  useEffect\(\(\) => \{
    if \(!showScreen \|\| !stillSrc\) return;
    let cancelled = false;
    const loader = new TextureLoader\(\);
    loader\.load\(stillSrc, \(tex\) => \{
      if \(cancelled\) return;
      tex\.colorSpace = SRGBColorSpace;
      tex\.minFilter = LinearFilter;
      tex\.magFilter = LinearFilter;
      tex\.flipY = true;
      tex\.needsUpdate = true;
      if \(modeRef\.current !== "video"\) \{
        modeRef\.current = "still";
        setScreenMap\(tex\);
      \}
    \}\);
    return \(\) => \{ cancelled = true; \};
  \}, \[showScreen, stillSrc\]\);

  const playingRef = useRef\(false\);

  useEffect\(\(\) => \{
    if \(!showScreen \|\| !videoSrc\) \{
      if \(playingRef\.current\) \{
        playingRef\.current = false;
        video\.pause\(\);
      \}
      return;
    \}

    let cancelled = false;

    const promote = \(\) => \{
      if \(cancelled\) return;
      if \(!playingRef\.current\) \{
        video\.play\(\)\.catch\(\(\) => \{ \}\);
        playingRef\.current = true;
      \}
      modeRef\.current = "video";
      setScreenMap\(videoTex\);
    \};

    video\.src = videoSrc;
    video\.addEventListener\("loadeddata", promote\);
    video\.addEventListener\("canplay", promote\);
    if \(video\.readyState >= HTMLMediaElement\.HAVE_CURRENT_DATA\) promote\(\);
    else video\.load\(\);

    return \(\) => \{
      cancelled = true;
      video\.removeEventListener\("loadeddata", promote\);
      video\.removeEventListener\("canplay", promote\);
      video\.pause\(\);
    \};
  \}, \[showScreen, videoSrc, video, videoTex\]\);'''

replacement = r'''  const playingRef = useRef(false);

  useEffect(() => {
    if (!showScreen) return;
    let cancelled = false;

    if (videoSrc) {
      const promote = () => {
        if (cancelled) return;
        if (!playingRef.current) {
          video.play().catch(() => {});
          playingRef.current = true;
        }
        modeRef.current = "video";
        setScreenMap(videoTex);
      };

      video.src = videoSrc;
      video.addEventListener("loadeddata", promote);
      video.addEventListener("canplay", promote);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
      else video.load();
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
    }

    return () => {
      cancelled = true;
      if (videoSrc) {
        video.removeEventListener("loadeddata", promote);
        video.removeEventListener("canplay", promote);
        video.pause();
      }
    };
  }, [showScreen, videoSrc, stillSrc, video, videoTex]);'''

code = re.sub(target, replacement, code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

