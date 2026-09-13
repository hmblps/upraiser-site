import re

with open("index.html", "r") as f:
    code = f.read()
code = code.replace('.webp", "image");', '.jpg", "image");')
with open("index.html", "w") as f:
    f.write(code)

with open("src/components/hero-terrain/HeroVideoFallback.tsx", "r") as f:
    code = f.read()
code = code.replace('.webp?${CACHE_BUST}', '.jpg?${CACHE_BUST}')
with open("src/components/hero-terrain/HeroVideoFallback.tsx", "w") as f:
    f.write(code)
