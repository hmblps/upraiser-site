import fs from 'fs';
import { execSync } from 'child_process';
execSync('npx gltfjsx@6.5.3 public/channels/oem/tv.glb -o scripts/tv-gltfjsx.jsx');
const content = fs.readFileSync('scripts/tv-gltfjsx.jsx', 'utf8');
console.log(content.split('\n').filter(l => l.includes('geometry') || l.includes('material') || l.includes('mesh')).join('\n'));
