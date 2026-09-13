import re
with open("src/components/solutions/ProgrammaticScrollSection.tsx", "r") as f:
    code = f.read()

# Add aggressive preloads at the top of the file
preloads = """
import { useGLTF } from "@react-three/drei";
import { DRACO_PATH } from "../../lib/heroModel";
useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);
useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);
"""

code = code.replace('import { FormatCopy } from "./FormatCopy";', 'import { FormatCopy } from "./FormatCopy";\n' + preloads)

with open("src/components/solutions/ProgrammaticScrollSection.tsx", "w") as f:
    f.write(code)

