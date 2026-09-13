import re
with open("src/pages/ChannelsPage.tsx", "r") as f:
    code = f.read()

code = re.sub(r'const \{ mode, [^\}]*\} = useRoutesLane\(\);', 'const { mode, lane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();', code)

with open("src/pages/ChannelsPage.tsx", "w") as f:
    f.write(code)
