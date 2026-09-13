import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Make sure useTexture is imported
if "useTexture" not in code:
    code = code.replace('useGLTF } from "@react-three/drei"', 'useGLTF, useTexture } from "@react-three/drei"')

# Replace the texture loader logic
old_setup = """  const showScreen = Boolean(videoSrc || stillSrc);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture | null>(null);"""

new_setup = """  const showScreen = Boolean(videoSrc || stillSrc);
  const stillTex = useTexture(stillSrc || FORMAT_STILL["ctv-spot"]);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture>(stillTex);

  useMemo(() => {
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
  }, [stillTex]);"""

code = code.replace(old_setup, new_setup)

old_effect = """    } else if (stillSrc) {
      if (playingRef.current) {
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
    }"""

new_effect = """    } else if (stillSrc) {
      if (playingRef.current) {
        video.pause();
      }
      modeRef.current = "still";
      setScreenMap(stillTex);
    }"""

code = code.replace(old_effect, new_effect)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)
