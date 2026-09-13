import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Replace:
# const videoSrc = formatId ? FORMAT_VIDEO[formatId] : undefined;
# const stillSrc = (formatId && FORMAT_STILL[formatId]) || FORMAT_STILL["ctv-spot"];

new_code = """
  const isTvFormat = formatId === "ctv-spot" || formatId === "ctv-video";
  const safeFormatId = isTvFormat ? formatId : "ctv-spot";
  const videoSrc = safeFormatId ? FORMAT_VIDEO[safeFormatId] : undefined;
  const stillSrc = (safeFormatId && FORMAT_STILL[safeFormatId]) || FORMAT_STILL["ctv-spot"];
"""

code = re.sub(r'  const videoSrc = formatId \? FORMAT_VIDEO\[formatId\] : undefined;\n  const stillSrc = \(formatId && FORMAT_STILL\[formatId\]\) \|\| FORMAT_STILL\["ctv-spot"\];', new_code, code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

