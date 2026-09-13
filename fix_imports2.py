import re
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'TextureLoader,\s*', '', code)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'TextureLoader,\s*', '', code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)
