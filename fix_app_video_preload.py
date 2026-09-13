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
  
  const v = document.createElement("video");
  v.src = "/channels/oem/screens/ctv-spot.mp4";
  v.preload = "auto";
  v.muted = true;
  v.load();
}
"""

code = re.sub(r'import \{ TextureLoader \} from "three";.*?\}', new_preloads, code, flags=re.DOTALL)
with open("src/App.tsx", "w") as f:
    f.write(code)

