import re
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

target = r'    const floatRotX = Math\.sin\(t \* 0\.7\) \* 0\.025;\n    const floatRotY = Math\.cos\(t \* 0\.5\) \* 0\.03;\n\n    group\.current\.rotation\.x = rotX\.get\(\) \+ floatRotX;\n    group\.current\.rotation\.y = rotY\.get\(\) \+ floatRotY;\n    group\.current\.position\.y = Math\.sin\(t \* 1\.0\) \* 0\.035;'

replacement = r'''    const floatRotX = Math.sin(t * 0.8) * 0.03;
    const floatRotY = Math.cos(t * 0.6) * 0.04;
    const floatPosY = Math.sin(t * 1.2) * 0.04;

    group.current.rotation.x = rotX.get() + floatRotX;
    group.current.rotation.y = rotY.get() + floatRotY;
    group.current.position.y = floatPosY;'''

code = re.sub(target, replacement, code)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

