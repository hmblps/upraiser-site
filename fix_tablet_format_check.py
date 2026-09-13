import re
with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

# Replace:
# const src = TABLET_SCREEN_VIDEO[formatId];
# const stillSrc = TABLET_SCREEN_STILL[formatId];

new_code = """
    const isTabletFormat = formatId === "pre-install" || formatId === "oem-store" || formatId === "system-ui";
    const safeFormatId = isTabletFormat ? formatId : "pre-install";
    const src = TABLET_SCREEN_VIDEO[safeFormatId];
    const stillSrc = TABLET_SCREEN_STILL[safeFormatId];
"""

code = re.sub(r'    const src = TABLET_SCREEN_VIDEO\[formatId\];\n    const stillSrc = TABLET_SCREEN_STILL\[formatId\];', new_code, code)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

