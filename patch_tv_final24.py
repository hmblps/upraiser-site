import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Replace screenPlaneForHeight values
code = re.sub(
    r"x: 0\.004 \* ratio,",
    "x: 0.000 * ratio,",
    code
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

