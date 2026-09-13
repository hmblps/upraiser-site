with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions to slightly less oversize
code = re.sub(
    r"w: 3\.65 \* ratio,\n\s*h: 2\.06 \* ratio,",
    "w: 3.72 * ratio,\n    h: 2.12 * ratio,",
    code
)
# Make z static 0.088
code = re.sub(
    r"z: 0\.082 \* ratio,",
    "z: 0.088,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
