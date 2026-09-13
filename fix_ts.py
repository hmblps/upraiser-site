import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace("useFrame(({ clock }) => {", "useFrame(() => {")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

with open("src/components/solutions/Phone3D.tsx", "r") as f:
    code = f.read()
code = code.replace("useFrame((state) => {", "useFrame(() => {")
with open("src/components/solutions/Phone3D.tsx", "w") as f:
    f.write(code)
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()
code = code.replace("useFrame((state) => {", "useFrame(() => {")
with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)
