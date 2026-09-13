import re
with open("src/components/solutions/ProgrammaticScrollSection.tsx", "r") as f:
    code = f.read()

# Remove the preloads I added
code = code.replace("""import { useGLTF } from "@react-three/drei";
import { DRACO_PATH } from "../../lib/heroModel";
useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);
useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);
""", "")

with open("src/components/solutions/ProgrammaticScrollSection.tsx", "w") as f:
    f.write(code)

with open("src/App.tsx", "r") as f:
    code = f.read()

code = code.replace('useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);', 'useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);\nuseGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);')

with open("src/App.tsx", "w") as f:
    f.write(code)

