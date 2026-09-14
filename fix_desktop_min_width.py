import re

filepath = "src/components/solutions/ProgrammaticScrollSection.tsx"
with open(filepath, "r") as f:
    code = f.read()

code = code.replace('const DESKTOP_MIN_WIDTH = 900;', 'const DESKTOP_MIN_WIDTH = 768;')

with open(filepath, "w") as f:
    f.write(code)
