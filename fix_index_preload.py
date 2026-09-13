import re
with open("index.html", "r") as f:
    code = f.read()

new_script = """
        // Fallback frames preload (Windows or Mobile)
        if (mobile || /Windows/i.test(navigator.userAgent)) {
          var folder = mobile ? "home-mobile-" + t : "home-" + t;
          preload("/hero/frames/" + folder + "/frame_0001.webp", "image");
        }
"""

code = code.replace('preload("/channels/oem/tablet.glb", "fetch");\n        }', 'preload("/channels/oem/tablet.glb", "fetch");\n        }' + new_script)

with open("index.html", "w") as f:
    f.write(code)

