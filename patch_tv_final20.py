import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Replace screenPlaneForHeight values
code = re.sub(
    r"w: 3\.64 \* ratio,\n\s*h: 2\.06 \* ratio,\n\s*x: 0,\n\s*y: 0\.02 \* ratio,\n\s*z: 0\.088 \* ratio,",
    "w: 3.66 * ratio,\n    h: 2.14 * ratio,\n    x: -0.015 * ratio,\n    y: -0.002 * ratio,\n    z: 0.090 * ratio,",
    code
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

