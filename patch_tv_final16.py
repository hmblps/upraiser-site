with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions to slightly less oversize
code = re.sub(
    r"w: 3\.72 \* ratio,\n\s*h: 2\.12 \* ratio,",
    "w: 3.65 * ratio,\n    h: 2.06 * ratio,",
    code
)
# Update Z to 0.085 to push it slightly further back inside the TV
code = re.sub(
    r"z: 0\.088 \* ratio,",
    "z: 0.082 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
