with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'border border-white/20 bg-white/5 animate-pulse',
    'border border-border/50 bg-border/20 animate-pulse dark:border-white/20 dark:bg-white/5'
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'border border-white/20 bg-white/5 animate-pulse',
    'border border-border/50 bg-border/20 animate-pulse dark:border-white/20 dark:bg-white/5'
)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)
