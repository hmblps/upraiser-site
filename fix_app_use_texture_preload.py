import re
with open("src/App.tsx", "r") as f:
    code = f.read()

# Replace the block
old_block = """import { TextureLoader } from "three";
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
}"""

new_block = """import { useTexture } from "@react-three/drei";
if (typeof window !== "undefined") {
  useTexture.preload([
    "/channels/oem/screens/ctv-spot.png",
    "/channels/programmatic-refs/screens/video.png",
    "/channels/programmatic-refs/screens/banner.png"
  ]);
  
  const v = document.createElement("video");
  v.src = "/channels/oem/screens/ctv-spot.mp4";
  v.preload = "auto";
  v.muted = true;
  v.load();
}"""

code = code.replace(old_block, new_block)

with open("src/App.tsx", "w") as f:
    f.write(code)
