import fs from 'fs';

let content = fs.readFileSync('docs/FORMATS-CHANNELS.md', 'utf8');

// Update Grid description
content = content.replace(
  /grid-template-columns: minmax\(0, 1.2fr\) minmax\(0, 0.95fr\)/g,
  'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)'
);

// Update Optical Slots table
const opticalSlotsRegex = /### Optical slots \(CSS\)[\s\S]*?### Phone3D/m;
const newOpticalSlots = `### Optical slots (CSS)

- **Grid:** \`1fr 1fr\` perfectly balanced layout. Text column is padded (\`padding-inline-start: clamp(2rem, 4vw, 4.5rem)\`) to give devices breathing room without breaking balance.
- **WebGL Clipping Fix:** The 3D canvases for Phone and Tablet have \`width: 150%\` + \`flex-shrink: 0\`. Because their slots are narrow, this safely widens the WebGL aspect ratio to prevent clipping without overlapping the text. TV canvas has \`width: 110%\` for the same purpose.

| Slot | CSS Width | Aspect | Canvas Width Hack |
| --- | --- | --- | --- |
| Phone | \`max-width: min(35%, 15rem)\` | 9 / 19.5 | 150% |
| Tablet | \`max-width: min(60%, 23rem)\` | 3 / 4 | 150% |
| TV | \`max-width: min(100%, 54rem)\` | 16 / 12 | 110% |

### Phone3D`;
content = content.replace(opticalSlotsRegex, newOpticalSlots);

// Update Tv3D values
content = content.replace(
  /\| `getTargetHeight\(\)` \| `min\(2.2, 1.95 × aspect\)` \|/,
  '| `getTargetHeight()` | `1.25` (forces safe horizontal fit) |'
);

content = content.replace(
  /\| Camera \| `\[0, 0.04, flat \? 5.2 : 5.75\]`, fov `30\|31` \|/,
  '| Camera | `[0, 0.02, flat ? 4.4 : 4.65]`, fov `30|31` |'
);

// Update Changelog
const changelogRegex = /## 13\. Recent change log \(Formats only\)/;
const newChangelogEntry = `## 13. Recent change log (Formats only)

| When | What |
| --- | --- |
| **25 Sep (Antigravity)** | Solved the WebGL clipping vs overlap paradox. Standardized on a perfectly balanced \`1fr 1fr\` grid. Padded the right column for breathing room. Used \`width: 150%\` on Phone/Tablet canvases to stop 3D clipping inside narrow slots. For the massive TV, adjusted 3D scale (\`getTargetHeight = 1.25\`) and \`110%\` canvas to prevent text overlap. Size hierarchy established (Phone < Tablet < TV). |
`;
content = content.replace(changelogRegex, newChangelogEntry);

fs.writeFileSync('docs/FORMATS-CHANNELS.md', content);
console.log("FORMATS-CHANNELS.md updated");
