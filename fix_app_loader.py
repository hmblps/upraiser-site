import re

with open("src/pages/ChannelsPage.tsx", "r") as f:
    code = f.read()
code = code.replace('import { Loader } from "@react-three/drei";\n', '')
code = code.replace('<Loader />\n      ', '')
with open("src/pages/ChannelsPage.tsx", "w") as f:
    f.write(code)

with open("src/App.tsx", "r") as f:
    code = f.read()

code = code.replace('import { lazy, Suspense } from "react";', 'import { lazy, Suspense } from "react";\nimport { Loader } from "@react-three/drei";')
code = code.replace('return (\n    <Suspense fallback={<RouteFallback />}>', 'return (\n    <Suspense fallback={<RouteFallback />}>\n      <Loader containerStyles={{ zIndex: 99999, background: "#000" }} innerStyles={{ width: "300px" }} barStyles={{ background: "#fff", height: "2px" }} dataInterpolation={(p) => `Loading UPRAISER ${p.toFixed(0)}%`} />')

with open("src/App.tsx", "w") as f:
    f.write(code)

