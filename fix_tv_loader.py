import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Replace the old stillTex useEffect with the new TextureLoader one
target_effect = r'  useEffect\(\(\) => \{\n    if \(!showScreen \|\| !stillTex\) return;\n    if \(modeRef\.current === "video"\) return;\n    \n    stillTex\.colorSpace = SRGBColorSpace;\n    stillTex\.minFilter = LinearFilter;\n    stillTex\.magFilter = LinearFilter;\n    stillTex\.flipY = true;\n    stillTex\.needsUpdate = true;\n    modeRef\.current = "still";\n    setScreenMap\(stillTex\);\n  \}, \[showScreen, stillTex\]\);'

replacement_effect = """  useEffect(() => {
    if (!showScreen || !stillSrc) return;
    let cancelled = false;
    const loader = new TextureLoader();
    loader.load(stillSrc, (tex) => {
      if (cancelled) return;
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      tex.flipY = true;
      tex.needsUpdate = true;
      if (modeRef.current !== "video") {
        modeRef.current = "still";
        setScreenMap(tex);
      }
    });
    return () => { cancelled = true; };
  }, [showScreen, stillSrc]);"""

code = re.sub(target_effect, replacement_effect, code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

