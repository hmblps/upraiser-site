with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions to 3.59 and 2.02
code = re.sub(
    r"w: 3\.46 \* ratio,\n\s*h: 1\.92 \* ratio,",
    "w: 3.59 * ratio,\n    h: 2.02 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
