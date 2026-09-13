with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re
code = re.sub(
    r"w: 3\.72 \* ratio,\n\s*h: 2\.12 \* ratio,",
    "w: 3.64 * ratio,\n    h: 2.06 * ratio,",
    code
)
code = re.sub(
    r"z: 0\.088,",
    "z: 0.088 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
