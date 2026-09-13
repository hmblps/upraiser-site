import re
with open("src/pages/ChannelsPage.tsx", "r") as f:
    code = f.read()

code = code.replace('import { Link } from "react-router-dom";', 'import { Link } from "react-router-dom";\nimport { Loader } from "@react-three/drei";')

code = code.replace('<main className="site-main channels-page">', '<main className="site-main channels-page">\n      <Loader />')

with open("src/pages/ChannelsPage.tsx", "w") as f:
    f.write(code)

