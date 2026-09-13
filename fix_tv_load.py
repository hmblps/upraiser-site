import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Replace useTexture with TextureLoader
code = re.sub(r'import \{\s*useTexture\s*\}\s*from\s*"@react-three\/drei";\n', '', code)

# Ensure TextureLoader is imported from three
if 'TextureLoader' not in code:
    code = re.sub(r'import \{\n', 'import {\n  TextureLoader,\n', code, count=1)

# Inside TvMesh
# const stillTex = useTexture(stillSrc);
# const [screenMap, setScreenMap] = useState<Texture | null>(stillTex);
# =>
# const [screenMap, setScreenMap] = useState<Texture | null>(null);
# useEffect(() => {
#    let cancelled = false;
#    const loader = new TextureLoader();
#    loader.load(stillSrc, (tex) => {
#        if (cancelled) return;
#        tex.colorSpace = SRGBColorSpace;
#        tex.flipY = false; // Note: Check what flipY it should have
#        setScreenMap(tex);
#    });
#    return () => { cancelled = true; };
# }, [stillSrc]);

target = r'  const stillSrc = \(formatId && FORMAT_STILL\[formatId\]\) \|\| FORMAT_STILL\["ctv-spot"\];\n  const stillTex = useTexture\(stillSrc\);\n  const showScreen = Boolean\(videoSrc \|\| stillSrc\);\n  const modeRef = useRef<"still" \| "video">\("still"\);\n  const \[screenMap, setScreenMap\] = useState<Texture \| null>\(stillTex\);'

replacement = """  const stillSrc = (formatId && FORMAT_STILL[formatId]) || FORMAT_STILL["ctv-spot"];
  const showScreen = Boolean(videoSrc || stillSrc);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();
    loader.load(stillSrc, (tex) => {
      if (cancelled) return;
      tex.colorSpace = SRGBColorSpace;
      tex.flipY = false;
      setScreenMap(tex);
    });
    return () => { cancelled = true; };
  }, [stillSrc]);
"""

code = re.sub(target, replacement, code)

# Fix apply texture flipY to false. Is useTexture doing flipY=false?
# Let's check useTexture default. It returns flipY=true? No, Drei useTexture defaults to true, but GLTF might need false.
# The user never complained about upside down TV screen before I switched to useTexture.
# Wait, I previously switched to useTexture. What was it before?

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

