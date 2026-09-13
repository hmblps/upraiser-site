import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'  const stillTex = useTexture\(stillSrc\);\n', '', code)
code = re.sub(r'useTexture\.preload\(\[FORMAT_STILL\["ctv-spot"\]\]\);\n', '', code)
code = re.sub(r'import \{ Environment, useGLTF, \} from "@react-three/drei";', 'import { Environment, useGLTF } from "@react-three/drei";', code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

