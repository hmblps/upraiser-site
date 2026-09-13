with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update z
code = re.sub(
    r"z: 0\.090 \* ratio,",
    "z: 0.088 * ratio,",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
