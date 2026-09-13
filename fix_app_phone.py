import re

with open("src/App.tsx", "r") as f:
    code = f.read()

phone_preloads = """
useGLTF.preload("/phones/deep-blue.glb", DRACO_PATH);
useGLTF.preload("/phones/orange.glb", DRACO_PATH);
"""

code = code.replace('useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);', 'useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);\n' + phone_preloads)

with open("src/App.tsx", "w") as f:
    f.write(code)

