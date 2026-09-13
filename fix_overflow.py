import re
with open("src/components/solutions/ProgrammaticScrollSection.tsx", "r") as f:
    code = f.read()

code = code.replace('overflow: "hidden",\n        }}\n      >\n        <div className="prog-device-slot prog-device-slot--tv"', 'overflow: "visible",\n        }}\n      >\n        <div className="prog-device-slot prog-device-slot--tv"')
code = code.replace('{/* TV wrapper: overflow hidden clips any canvas bleed outside the section */}', '{/* TV wrapper */}')

with open("src/components/solutions/ProgrammaticScrollSection.tsx", "w") as f:
    f.write(code)

