import re

with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

old_state = "  const [screenMap, setScreenMap] = useState<Texture | null>(null);"

new_state = """  const isTabletFormat = formatId === "pre-install" || formatId === "oem-store" || formatId === "system-ui";
  const safeFormatId = isTabletFormat ? formatId : "pre-install";
  const stillSrc = TABLET_SCREEN_STILL[safeFormatId!];
  const stillTex = useTexture(stillSrc || TABLET_SCREEN_STILL["pre-install"]!);

  const [screenMap, setScreenMap] = useState<Texture>(stillTex);

  useMemo(() => {
    configureMap(stillTex);
  }, [stillTex]);"""

code = code.replace(old_state, new_state)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)

