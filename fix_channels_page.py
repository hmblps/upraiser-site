import re

with open("src/pages/ChannelsPage.tsx", "r") as f:
    code = f.read()

code = code.replace('import { Link } from "react-router-dom";', 'import { Link } from "react-router-dom";\nimport { ChannelsLoader } from "../components/ChannelsLoader";')
code = code.replace('<main className="site-main channels-page">', '<main className="site-main channels-page">\n      <ChannelsLoader />')

with open("src/pages/ChannelsPage.tsx", "w") as f:
    f.write(code)

