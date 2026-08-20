const fs = require('fs');

// 1. Remove border-bottom from toolbar and change panel background
let surfaces = fs.readFileSync('src/styles/surfaces.css', 'utf-8');
surfaces = surfaces.replace(
    'border-bottom: 1px solid color-mix(in srgb, var(--theme-border) 55%, transparent);',
    ''
);
surfaces = surfaces.replace(
    'background: var(--theme-bg-elevated, var(--theme-bg-card));',
    'background: var(--theme-case-panel, var(--theme-bg-elevated));\n  backdrop-filter: blur(32px);\n  -webkit-backdrop-filter: blur(32px);'
);
fs.writeFileSync('src/styles/surfaces.css', surfaces);

// 2. Change --theme-case-panel in light theme to sky color
let indexCss = fs.readFileSync('src/index.css', 'utf-8');
indexCss = indexCss.replace(
    '--theme-case-panel: #f8f9fb;',
    '--theme-case-panel: rgba(235, 244, 255, 0.75);'
);
// And in dark theme make it translucent
indexCss = indexCss.replace(
    '--theme-case-panel: rgb(255 255 255 / 0.05);',
    '--theme-case-panel: rgba(15, 14, 13, 0.65);' // Match elevated bg roughly but translucent
);
fs.writeFileSync('src/index.css', indexCss);
