import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'if \(typeof window !== "undefined"\) \{\n  \}\n', '', code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

