const fs = require('fs');
let css = fs.readFileSync('src/styles/surfaces.css', 'utf-8');
css = css.replace(/transition:\n\s+width 0\.25s ease,\n\s+height 0\.25s ease,\n\s+margin 0\.25s ease,\n\s+background-color 0\.25s ease,/g, 'transition:\n    background-color 0.25s ease,');
fs.writeFileSync('src/styles/surfaces.css', css);
