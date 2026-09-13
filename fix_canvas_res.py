import re
with open("src/components/hero-terrain/HeroVideoFallback.tsx", "r") as f:
    code = f.read()

code = code.replace('const nextW = isMobile ? 540 : 1280;', 'const nextW = isMobile ? 720 : 1920;')
code = code.replace('const nextH = isMobile ? 960 : 720;', 'const nextH = isMobile ? 1280 : 1080;')

with open("src/components/hero-terrain/HeroVideoFallback.tsx", "w") as f:
    f.write(code)

