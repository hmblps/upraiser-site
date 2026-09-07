const r1 = 150;
const r2 = 250;
const r3 = 350;

function genPath(cx, cy, r, segments) {
  let d = "";
  for (let i = 0; i < segments; i++) {
    const angle = (Math.PI * 2 * i) / segments;
    const nextAngle = (Math.PI * 2 * (i + 1)) / segments;
    const midAngle = (angle + nextAngle) / 2;
    
    // Add organic wobble
    const r1 = r + (Math.random() - 0.5) * (r * 0.15);
    const r2 = r + (Math.random() - 0.5) * (r * 0.15);
    const rMid = r + (Math.random() - 0.5) * (r * 0.15);

    const p1x = cx + Math.cos(angle) * r1;
    const p1y = cy + Math.sin(angle) * r1;
    
    const p2x = cx + Math.cos(nextAngle) * r2;
    const p2y = cy + Math.sin(nextAngle) * r2;
    
    const controlRadius = rMid * 1.05; // push control point out slightly
    const controlX = cx + Math.cos(midAngle) * controlRadius;
    const controlY = cy + Math.sin(midAngle) * controlRadius;

    if (i === 0) d += `M${p1x.toFixed(1)},${p1y.toFixed(1)} `;
    
    d += `Q${controlX.toFixed(1)},${controlY.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)} `;
  }
  return d + "Z";
}

console.log('<svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">');
console.log(`  <path d="${genPath(400, 400, r1, 6)}" stroke="currentColor" stroke-width="6" stroke-dasharray="10 20" />`);
console.log(`  <path d="${genPath(400, 400, r2, 8)}" stroke="currentColor" stroke-width="6" />`);
console.log(`  <path d="${genPath(400, 400, r3, 10)}" stroke="currentColor" stroke-width="6" stroke-dasharray="20 40" />`);
console.log('  <circle cx="400" cy="400" r="10" fill="currentColor"/>');
console.log('</svg>');
