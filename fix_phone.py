import re
with open("src/components/solutions/Phone3D.tsx", "r") as f:
    code = f.read()

code = re.sub(r'active = true[,\s]*', '', code)

with open("src/components/solutions/Phone3D.tsx", "w") as f:
    f.write(code)
