import re

with open("src/App.tsx", "r") as f:
    code = f.read()

code = code.replace('import { Loader } from "@react-three/drei";\n', '')
code = code.replace('<Loader containerStyles={{ zIndex: 99999, background: "#000" }} innerStyles={{ width: "300px" }} barStyles={{ background: "#fff", height: "2px" }} dataInterpolation={(p) => `Loading UPRAISER ${p.toFixed(0)}%`} />\n      ', '')

with open("src/App.tsx", "w") as f:
    f.write(code)

