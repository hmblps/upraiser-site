import re

filepath = "index.html"
with open(filepath, "r") as f:
    code = f.read()

pattern = r'preload\("/channels/oem/tablet\.glb", "fetch"\);'
replacement = r'preload("/channels/oem/tablet.glb", "fetch");\n          preload("/channels/oem/screens/ctv-spot.png", "image");\n          preload("/channels/oem/screens/native.png", "image");\n          preload("/channels/oem/screens/app-store.png", "image");'
code = re.sub(pattern, replacement, code)

with open(filepath, "w") as f:
    f.write(code)

