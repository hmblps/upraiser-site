with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions and position
code = re.sub(
    r"w: 3\.59 \* ratio,\n\s*h: 2\.02 \* ratio,\n\s*x: 0\.002 \* ratio,\n\s*y: 0\.046 \* ratio,",
    "w: 3.61 * ratio,\n    h: 2.04 * ratio,\n    x: 0.018 * ratio,\n    y: 0.025 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
