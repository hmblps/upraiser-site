with open("src/components/HeroAtmosphere.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'const [boot3d, setBoot3d] = useState(false);',
    '''const [boot3d, setBoot3d] = useState(false);
  const lite = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lite");'''
)

with open("src/components/HeroAtmosphere.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

code = code.replace("import { TextureLoader, VideoTexture }", "import { VideoTexture }")

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace("import { TextureLoader, VideoTexture }", "import { VideoTexture }")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

