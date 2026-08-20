const fs = require('fs');
let css = fs.readFileSync('src/styles/surfaces.css', 'utf-8');

css = css.replace(
    /background:[\s\n]*radial-gradient[^;]+;/g,
    'background: radial-gradient(ellipse 80% 90% at 100% -10%, color-mix(in srgb, var(--case-accent, var(--theme-accent)) 18%, transparent), transparent 62%);'
);

// We need to restore the light theme one since the regex above might have replaced it too
css = css.replace(
    /\[data-theme="light"\] \.case-brand-header__wash \{\s*background:\s*radial-gradient\([^;]+;/g,
    '[data-theme="light"] .case-brand-header__wash {\n  background: radial-gradient(ellipse 75% 85% at 100% -15%, color-mix(in srgb, var(--case-accent, var(--theme-accent)) 12%, transparent), transparent 65%);'
);

fs.writeFileSync('src/styles/surfaces.css', css);
