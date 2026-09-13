import re

with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Add useTexture to imports if not there
if "useTexture" not in code:
    code = code.replace('useGLTF } from "@react-three/drei"', 'useGLTF, useTexture } from "@react-three/drei"')

new_mesh = """
  const isTvFormat = formatId === "ctv-spot" || formatId === "ctv-video";
  const safeFormatId = isTvFormat ? formatId : "ctv-spot";
  const videoSrc = safeFormatId ? FORMAT_VIDEO[safeFormatId] : undefined;
  const stillSrc = (safeFormatId && FORMAT_STILL[safeFormatId]) || FORMAT_STILL["ctv-spot"];
  const showScreen = Boolean(videoSrc || stillSrc);
  const modeRef = useRef<"still" | "video">("still");

  // Load still synchronously via Suspense so TV never renders blank
  const stillTex = useTexture(stillSrc);
  
  const [screenMap, setScreenMap] = useState<Texture | null>(null);

  // Configure texture on first mount
  useMemo(() => {
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
  }, [stillTex]);
"""
# We also need to update the initial state of screenMap.
# But wait, useState initialization only happens once.
# If we do `useState<Texture>(stillTex)`, it works.
