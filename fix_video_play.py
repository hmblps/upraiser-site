import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace("""        if (playingRef.current) {
          void video.play().catch(() => {
            modeRef.current = "still";
          });
        }""", """        if (playingRef.current) {
          void video.play().catch(() => {});
        }""")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

