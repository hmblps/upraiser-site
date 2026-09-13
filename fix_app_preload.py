import re
with open("src/App.tsx", "r") as f:
    code = f.read()

preloads = """
import { useGLTF } from "@react-three/drei";
import { DRACO_PATH } from "./lib/heroModel";
useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);
"""

code = code.replace('import { HomePage } from "./pages/HomePage";', 'import { HomePage } from "./pages/HomePage";\n' + preloads)

with open("src/App.tsx", "w") as f:
    f.write(code)

