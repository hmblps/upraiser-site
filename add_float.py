import re

# 1. Update Tv3D.tsx
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Make sure useFrame takes ({ clock })
code = re.sub(r'useFrame\(\(\) => \{', 'useFrame(({ clock }) => {', code)

float_code_tv = """
    const t = clock.getElapsedTime();
    const floatRotX = Math.sin(t * 0.5) * 0.015;
    const floatRotY = Math.cos(t * 0.4) * 0.02;
    const floatPosY = Math.sin(t * 0.8) * 0.015;

    outerRef.current.rotation.x = rotX.get() + floatRotX;
    outerRef.current.rotation.y = rotY.get() + floatRotY;
    /* Снять лишний подъем по Y, который выталкивал верх телевизора за срез */
    outerRef.current.position.y = 0.0 + floatPosY;
"""
# Replace the existing set block
code = re.sub(
    r'    outerRef\.current\.rotation\.x = rotX\.get\(\);\n    outerRef\.current\.rotation\.y = rotY\.get\(\);\n    /\* Снять лишний подъем по Y.*\n    outerRef\.current\.position\.y = 0\.0;\n',
    float_code_tv,
    code
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)


# 2. Update Tablet3D.tsx
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

float_code_tablet = """
    const floatRotX = Math.sin(t * 0.7) * 0.025;
    const floatRotY = Math.cos(t * 0.5) * 0.03;
    const floatPosY = Math.sin(t * 1.0) * 0.02;
    
    group.current.rotation.x = rotX.get() + floatRotX;
    group.current.rotation.y = rotY.get() + floatRotY;
    group.current.position.y = floatPosY;
"""

code = re.sub(
    r'    const floatRotX = Math\.sin\(t \* 0\.7\) \* 0\.025;\n    const floatRotY = Math\.cos\(t \* 0\.5\) \* 0\.03;\n    group\.current\.rotation\.x = rotX\.get\(\) \+ floatRotX;\n    group\.current\.rotation\.y = rotY\.get\(\) \+ floatRotY;\n',
    float_code_tablet,
    code
)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

