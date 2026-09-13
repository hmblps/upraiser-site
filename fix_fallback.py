import re
with open("src/components/hero-terrain/HeroVideoFallback.tsx", "r") as f:
    code = f.read()

code = code.replace('.jpg?${CACHE_BUST}', '.webp?${CACHE_BUST}')

with open("src/components/hero-terrain/HeroVideoFallback.tsx", "w") as f:
    f.write(code)

