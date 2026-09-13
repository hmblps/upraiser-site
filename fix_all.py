import re

# FormatCopy.tsx
with open("src/components/solutions/FormatCopy.tsx", "r") as f:
    code = f.read()
code = re.sub(r'\s*index,\n', '\n', code)
code = re.sub(r'\s*total,\n', '\n', code)
code = re.sub(r'\s*formats,\n', '\n', code)
code = re.sub(r'\s*onJump,?\n', '\n', code)
with open("src/components/solutions/FormatCopy.tsx", "w") as f:
    f.write(code)

# Phone3D.tsx
with open("src/components/solutions/Phone3D.tsx", "r") as f:
    code = f.read()
# Replace pointerEvents: active ? "auto" : "none" where 'active' is not defined (it's inside an iframe overlay which is not the main component probably? No, line 566)
code = re.sub(r'pointerEvents: active \? "auto" : "none",', 'pointerEvents: "none",', code)
# Also fix JSX elements duplicate style at 774
code = re.sub(
    r'<Canvas\s+style=\{\{\s*pointerEvents:\s*active\s*\?\s*"auto"\s*:\s*"none"\s*\}\}',
    r'<Canvas',
    code
)
with open("src/components/solutions/Phone3D.tsx", "w") as f:
    f.write(code)

# ChannelsPage.tsx
with open("src/pages/ChannelsPage.tsx", "r") as f:
    code = f.read()
code = re.sub(r'import RoutesLaneSwitcher[^\n]*\n', '', code)
code = re.sub(r'const \[lane, setLane\] = useState<"app" \| "oem">.*?\n', '', code)
with open("src/pages/ChannelsPage.tsx", "w") as f:
    f.write(code)

