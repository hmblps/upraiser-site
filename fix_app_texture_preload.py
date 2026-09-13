import re

with open("src/App.tsx", "r") as f:
    code = f.read()

new_preloads = """
import { TextureLoader } from "three";
if (typeof window !== "undefined") {
  const tl = new TextureLoader();
  tl.load("/channels/oem/screens/ctv-spot.png");
  tl.load("/channels/programmatic-refs/screens/video.png");
  tl.load("/channels/programmatic-refs/screens/banner.png");
}
"""

code = code.replace('useGLTF.preload("/phones/orange.glb", DRACO_PATH);', 'useGLTF.preload("/phones/orange.glb", DRACO_PATH);\n' + new_preloads)

with open("src/App.tsx", "w") as f:
    f.write(code)

