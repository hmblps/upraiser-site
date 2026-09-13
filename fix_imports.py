import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'  TextureLoader,\n', '', code)
code = re.sub(r'useTexture ', '', code) # Clean up useTexture if unused

if 'TextureLoader' not in code:
    code = re.sub(r'import \{\n  ACESFilmicToneMapping,', 'import {\n  TextureLoader,\n  ACESFilmicToneMapping,', code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

