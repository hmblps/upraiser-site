const fs = require('fs');

let css = fs.readFileSync('src/styles/surfaces.css', 'utf-8');
css = css.replace(/background: color-mix\(in srgb, var\(--theme-bg\) 88%, #000 12%\);/g, 'background: transparent;');
css = css.replace(/backdrop-filter: blur\(16px\);/g, 'backdrop-filter: none;');
css = css.replace(/background: var\(--theme-bg\);/g, 'background: transparent;');
fs.writeFileSync('src/styles/surfaces.css', css);

let progCss = fs.readFileSync('src/styles/programmatic-banner-screen.css', 'utf-8');
progCss = progCss.replace(/background: color-mix\(in srgb, var\(--theme-bg\) 35%, rgba\(0, 0, 0, 0.72\)\);/g, 'background: transparent;');
progCss = progCss.replace(/backdrop-filter: blur\(10px\);/g, 'backdrop-filter: none;');
fs.writeFileSync('src/styles/programmatic-banner-screen.css', progCss);
