import re
with open("src/components/solutions/Phone3D.tsx", "r") as f:
    code = f.read()

new_code = """
    const isPhoneFormat = formatId === "banner" || formatId === "native" || formatId === "interstitial" || formatId === "rich" || formatId === "video";
    const safeFormatId = isPhoneFormat ? formatId : "banner";
    const src = SCREEN_VIDEO[safeFormatId];
    const stillSrc = SCREEN_STILL[safeFormatId];
"""

code = re.sub(r'    const src = SCREEN_VIDEO\[formatId\];\n    const stillSrc = SCREEN_STILL\[formatId\];', new_code, code)

with open("src/components/solutions/Phone3D.tsx", "w") as f:
    f.write(code)

