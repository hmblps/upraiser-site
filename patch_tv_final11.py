with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

import re

# Update dimensions
code = re.sub(
    r"w: 3\.54 \* ratio,\n\s*h: 1\.99 \* ratio,",
    "w: 3.46 * ratio,\n    h: 1.92 * ratio,",
    code
)

# Remove the readyState check from promote
code = re.sub(
    r"if \(cancelled \|\| promoted \|\| video\.readyState < HTMLMediaElement\.HAVE_CURRENT_DATA\) return;",
    "if (cancelled || promoted) return;",
    code
)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)
