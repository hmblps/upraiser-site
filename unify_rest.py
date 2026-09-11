import re

# 1. Update deviceScreens.ts
with open('src/data/deviceScreens.ts', 'r') as f:
    code = f.read()

code = code.replace(
    '/** Video only — Rich stays on still so the GLB glass lock never drifts. */\n  video: "/channels/programmatic-feed/formats/video.mp4",',
    'rich: "/channels/programmatic-feed/formats/rich.mp4",\n  video: "/channels/programmatic-feed/formats/video.mp4",'
)

with open('src/data/deviceScreens.ts', 'w') as f:
    f.write(code)

# 2. Update phone-css-3d.css
with open('src/styles/phone-css-3d.css', 'r') as f:
    css = f.read()

css = re.sub(r'\.phone-rich-on-glb \{[\s\S]*?\}\n\n\.phone-rich-on-glb iframe \{[\s\S]*?\}\n\n', '', css)

with open('src/styles/phone-css-3d.css', 'w') as f:
    f.write(css)

# 3. Add the useEffect for rotY and rotX to Phone3D.tsx
with open('src/components/solutions/Phone3D.tsx', 'r') as f:
    phone3d = f.read()

use_effect_rot = """  useEffect(() => {
    if (flat) {
      rotY.set(0);
      rotX.set(0);
      return;
    }
    rotY.set(REST_Y);
    rotX.set(REST_X);
  }, [formatId, flat, rotX, rotY]);

"""

if 'rotY.set(0)' not in phone3d:
    phone3d = phone3d.replace(
        'const [isDragging, setIsDragging] = useState(false);',
        'const [isDragging, setIsDragging] = useState(false);\n\n' + use_effect_rot
    )

with open('src/components/solutions/Phone3D.tsx', 'w') as f:
    f.write(phone3d)

