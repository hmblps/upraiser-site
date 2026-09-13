with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions and position
code = re.sub(
    r"w: 3\.61 \* ratio,\n\s*h: 2\.04 \* ratio,\n\s*x: 0\.018 \* ratio,\n\s*y: 0\.025 \* ratio,",
    "w: 3.72 * ratio,\n    h: 2.12 * ratio,\n    x: 0,\n    y: 0.02 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
