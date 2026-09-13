import re

with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

old_block = r"""  useEffect\(\(\) => \{
    if \(!showScreen \|\| !stillSrc\) return;
    let cancelled = false;
    const loader = new TextureLoader\(\);
    loader\.load\(stillSrc!, \(tex\) => \{
      if \(cancelled\) \{
        tex\.dispose\(\);
        return;
      \}
      tex\.colorSpace = SRGBColorSpace;
      tex\.minFilter = LinearFilter;
      tex\.magFilter = LinearFilter;
      tex\.flipY = true;
      tex\.needsUpdate = true;
      modeRef\.current = "still";
      setScreenMap\(\(prev\) => \{
        if \(prev && prev !== videoTex\) prev\.dispose\(\);
        return tex;
      \}\);
    \}\);
    return \(\) => \{
      cancelled = true;
    \};
  \}, \[showScreen, stillSrc, video, videoTex\]\);"""

new_block = """  useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);"""

code = re.sub(old_block, new_block, code, flags=re.MULTILINE)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
