import re
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

# Match float dynamics to phone
code = re.sub(
    r'const floatRotX = Math\.sin\(t \* 0\.7\) \* 0\.025;\n    const floatRotY = Math\.cos\(t \* 0\.5\) \* 0\.03;\n    const floatPosY = Math\.sin\(t \* 1\.0\) \* 0\.02;',
    r'const floatRotX = Math.sin(t * 0.8) * 0.03;\n    const floatRotY = Math.cos(t * 0.6) * 0.04;\n    const floatPosY = Math.sin(t * 1.2) * 0.04;',
    code
)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

