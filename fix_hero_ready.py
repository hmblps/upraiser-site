import re
with open("src/components/hero-terrain/HeroTerrainCanvas.tsx", "r") as f:
    code = f.read()

# Find the useEffect that handles markHeroReady
old_effect = """  useEffect(() => {
    if ((modelReady || shouldFallback) && !lite) markHeroReady();
  }, [modelReady, shouldFallback, lite]);"""

new_effect = """  useEffect(() => {
    if (lite || modelReady || shouldFallback) markHeroReady();
  }, [modelReady, shouldFallback, lite]);"""

code = code.replace(old_effect, new_effect)

with open("src/components/hero-terrain/HeroTerrainCanvas.tsx", "w") as f:
    f.write(code)

with open("src/components/HeroAtmosphere.tsx", "r") as f:
    code2 = f.read()

old_effect2 = """  useEffect(() => {
    if (!use3d) markHeroReady();
  }, [use3d]);"""

new_effect2 = """  useEffect(() => {
    if (!use3d || lite) markHeroReady();
  }, [use3d, lite]);"""

code2 = code2.replace(old_effect2, new_effect2)

with open("src/components/HeroAtmosphere.tsx", "w") as f:
    f.write(code2)

