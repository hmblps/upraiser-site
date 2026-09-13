with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re
code = re.sub(
    r"useEffect\(\(\) => \{\n\s*if \(!showScreen \|\| !stillSrc\) \{\n\s*return;\n\s*\}\n\s*let cancelled = false;[\s\S]*?\}, \[showScreen, stillSrc, video, videoTex\]\);",
    """useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);""",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
