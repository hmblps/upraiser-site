import re

filepath = "src/components/channel-visuals/Tv3D.tsx"
with open(filepath, "r") as f:
    code = f.read()

pattern = r'const stillSrc = \(safeFormatId && FORMAT_STILL\[safeFormatId\]\) \|\| FORMAT_STILL\["ctv-spot"\];'
replacement = r'const stillSrc = FORMAT_STILL["ctv-spot"];'
code = re.sub(pattern, replacement, code)

with open(filepath, "w") as f:
    f.write(code)
