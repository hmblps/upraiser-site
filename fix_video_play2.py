import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace("""      if (playingRef.current) {
        playingRef.current = false;
        video.pause();
      }""", """      if (playingRef.current) {
        video.pause();
      }""")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

