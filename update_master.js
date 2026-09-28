import fs from 'fs';
let content = fs.readFileSync('docs/UPRAISER-MASTER.md', 'utf8');

// Update TV row
content = content.replace(
  /\| TV \| `min\(118%, 52rem\)` \| fov 34, z=5\.5 \| `\/channels\/oem\/tv\.glb` \|/,
  '| TV | `min(100%, 54rem)` | fov 31, targetHeight 1.25 | `/channels/oem/tv.glb` |'
);

// Update Tablet row
content = content.replace(
  /\| Tablet \| `min\(74%, 26rem\)` \| fov 30, z=3\.8 \| `\/channels\/oem\/tablet\.glb` \|/,
  '| Tablet | `min(60%, 23rem)` | fov 36, z=3.48 | `/channels/oem/tablet.glb` |'
);

fs.writeFileSync('docs/UPRAISER-MASTER.md', content);
console.log("UPRAISER-MASTER.md updated");
