import os
import re

for path in ["src/components/solutions/Phone3D.tsx", "src/components/channel-visuals/Tablet3D.tsx", "src/components/channel-visuals/Tv3D.tsx"]:
    if not os.path.exists(path): continue
    with open(path, "r") as f:
        code = f.read()

    code = re.sub(r'frameloop=\{[^}]+\}', 'frameloop="always"', code)
    code = re.sub(r'frameloop="demand"', 'frameloop="always"', code)
    code = re.sub(r'frameloop="never"', 'frameloop="always"', code)

    with open(path, "w") as f:
        f.write(code)
