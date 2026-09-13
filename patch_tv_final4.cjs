const fs = require("fs");
const file = "src/components/channel-visuals/Tv3D.tsx";
let code = fs.readFileSync(file, "utf8");

// 1. screenPlaneForHeight
code = code.replace(
  /function screenPlaneForHeight\(h: number\) \{[\s\S]*?return \{[\s\S]*?\};\n\}/,
  `function screenPlaneForHeight(h: number) {
  const ratio = h / 2.15;
  return {
    w: 3.54 * ratio,
    h: 1.99 * ratio,
    x: 0.002 * ratio,
    y: 0.046 * ratio,
    z: 0.090 * ratio,
  };
}`
);

// 2. mesh position x
code = code.replace(
  /<mesh position=\{\[0, screen\.y, screen\.z\]\} renderOrder=\{1\}>/,
  `<mesh position={[screen.x || 0, screen.y, screen.z]} renderOrder={1}>`
);

// 3. useTexture for stillSrc
code = code.replace(
  /const \[screenMap, setScreenMap\] = useState<Texture \| null>\(null\);/,
  `const [screenMap, setScreenMap] = useState<Texture | null>(null);
  const stillTex = useTexture(stillSrc);`
);

// Remove the old TextureLoader useEffect
code = code.replace(
  /useEffect\(\(\) => \{\n\s*if \(!showScreen \|\| !stillSrc\) return;\n\s*let cancelled = false;[\s\S]*?\} \);[\s\S]*?\}\);[\s\S]*?\}, \[showScreen, stillSrc, video, videoTex\]\);/,
  `useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);`
);

// 4. Update video creation inside useMemo
code = code.replace(
  /const v = document\.createElement\("video"\);\n\s*v\.style\.position = "fixed";/,
  `const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    v.style.position = "fixed";`
);

fs.writeFileSync(file, code);
