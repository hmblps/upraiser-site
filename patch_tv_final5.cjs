const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

const oldCode = `  useEffect(() => {
    if (!showScreen || !stillSrc) return;
    let cancelled = false;
    new TextureLoader().load(stillSrc, (tex) => {
      if (cancelled) return;
      if (modeRef.current === "video") {
        tex.dispose();
        return;
      }
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      tex.flipY = true;
      tex.needsUpdate = true;
      modeRef.current = "still";
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return tex;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [showScreen, stillSrc, video, videoTex]);`;

const newCode = `  useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);`;

if (code.includes(oldCode)) {
    fs.writeFileSync(file, code.replace(oldCode, newCode));
} else {
    console.log("Could not find the target code to replace.");
}

