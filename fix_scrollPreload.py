import re

with open("src/lib/scrollPreload.ts", "r") as f:
    code = f.read()

new_tv = """case "routes-tv":
        whenHeroReady(() => {
          preloadFetch("/channels/oem/tv-draco.glb");
          preloadFetch(`${DRACO_PATH}draco_decoder.wasm`);
          preloadFetch("/channels/oem/screens/ctv-spot.png");
          preloadFetch("/channels/oem/screens/ctv-spot.mp4");
          void import("../components/channel-visuals/Tv3D");
        });
        break;"""

code = re.sub(r'case "routes-tv":.*?break;', new_tv, code, flags=re.DOTALL)

with open("src/lib/scrollPreload.ts", "w") as f:
    f.write(code)

