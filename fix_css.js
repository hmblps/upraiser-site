import fs from 'fs';
const file = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(/\.prog-device-slot--tv \{[\s\S]*?\n\}/, `.prog-device-slot--tv {
  width: min(100%, 54rem);
  /* 
     Важно: делаем пропорцию слота 16 / 12 (или 4 / 3), 
     чтобы у канваса был вертикальный запас под наклоненный ТВ 
  */
  aspect-ratio: 16 / 12;
  height: auto;
  max-height: min(84dvh, var(--prog-phone-budget, 84dvh));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  overflow: visible !important;
  z-index: 6;
}`);

css = css.replace(/\.prog-device-slot--tv \.tv-glb-canvas,\n\.prog-device-slot--tv \.prog-device-load \{[\s\S]*?\n\}/, `.prog-device-slot--tv .prog-device-load,
.prog-device-slot--tv .tv-glb-canvas {
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
}`);

// Also ensure ancestors have overflow: visible !important
css = css.replace(/\.prog-scroll-phone-col--lifted \{[\s\S]*?\n\}/, (match) => {
  if (match.includes('overflow: visible !important')) return match;
  return match.replace(/\}$/, '  overflow: visible !important;\n}');
});

css = css.replace(/\.prog-scroll-device-lift \{[\s\S]*?\n\}/, (match) => {
  if (match.includes('overflow: visible !important')) return match;
  return match.replace(/\}$/, '  overflow: visible !important;\n}');
});

fs.writeFileSync(file, css);
console.log('CSS Fixed');
