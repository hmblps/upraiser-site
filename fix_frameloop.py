with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'inView={active && !reduced}',
    'inView={active}'
)
code = code.replace(
    'frameloop={reduced ? "never" : active && inView ? "always" : "demand"}',
    'frameloop={reduced ? "never" : active ? "always" : "demand"}'
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'inView={active && !reduced}',
    'inView={active}'
)
code = code.replace(
    'frameloop={reduced ? "never" : active && inView ? "always" : "demand"}',
    'frameloop={reduced ? "never" : active ? "always" : "demand"}'
)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)
