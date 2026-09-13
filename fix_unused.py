import re
import os

# 1. Tv3D.tsx
f1 = "src/components/channel-visuals/Tv3D.tsx"
with open(f1, 'r') as f:
    code = f.read()
code = re.sub(r'TextureLoader,\n', '', code)
with open(f1, 'w') as f:
    f.write(code)

# 2. FormatCopy.tsx
f2 = "src/components/solutions/FormatCopy.tsx"
with open(f2, 'r') as f:
    code = f.read()
code = re.sub(r'  index,\n  total,\n  formats,\n  onJump,\n', '', code)
with open(f2, 'w') as f:
    f.write(code)

# 3. ChannelsPage.tsx
f3 = "src/pages/ChannelsPage.tsx"
with open(f3, 'r') as f:
    code = f.read()
code = re.sub(r'import RoutesLaneSwitcher from "\.\./components/solutions/RoutesLaneSwitcher";\n', '', code)
code = re.sub(r'  const \[\w+, setLane\] = useState<"app" \| "oem">.*?\n', '', code)
with open(f3, 'w') as f:
    f.write(code)

