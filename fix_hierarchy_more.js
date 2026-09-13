import fs from 'fs';
const cssFile = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(cssFile, 'utf8');

css = css.replace(/width: min\(42%, 18\.5rem\);/, 'width: min(35%, 15rem);');
css = css.replace(/width: min\(72%, 26rem\);/, 'width: min(60%, 23rem);');

fs.writeFileSync(cssFile, css);
console.log('Fixed hierarchy aggressively');
