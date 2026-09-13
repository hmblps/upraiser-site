import fs from 'fs';
const file = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(/\[data-scene="tv"\] \.prog-scroll-phone-col--lifted \{[\s\S]*?\n\}/, (match) => {
  if (match.includes('overflow: visible !important')) return match;
  return match.replace(/\}$/, '  overflow: visible !important;\n}');
});

fs.writeFileSync(file, css);
