import re

filepath = "src/components/solutions/ProgrammaticScrollSectionMobile.tsx"
with open(filepath, "r") as f:
    code = f.read()

code = code.replace(
    '<div className="mt-4 flex flex-col items-center">',
    '<div className="mt-4 flex flex-col items-center relative z-10">'
)

with open(filepath, "w") as f:
    f.write(code)
