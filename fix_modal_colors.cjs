const fs = require('fs');

let css = fs.readFileSync('src/styles/surfaces.css', 'utf-8');

// 1. Remove the linear gradient from .case-brand-header__wash in both light and dark theme
css = css.replace(
    /background:\s*radial-gradient\([^\)]+\),\s*linear-gradient\([^;]+;/g,
    'background: radial-gradient(ellipse 80% 90% at 100% -10%, color-mix(in srgb, var(--case-accent, var(--theme-accent)) 18%, transparent), transparent 62%);'
);

// Specifically fix the light theme one which is slightly different
css = css.replace(
    /\[data-theme="light"\] \.case-brand-header__wash \{\s*background:\s*radial-gradient\([^;]+;/g,
    '[data-theme="light"] .case-brand-header__wash {\n  background: radial-gradient(ellipse 75% 85% at 100% -15%, color-mix(in srgb, var(--case-accent, var(--theme-accent)) 12%, transparent), transparent 65%);'
);

// 2. Add custom sleek scrollbar to .case-detail-modal__body
if (!css.includes('::-webkit-scrollbar')) {
    css = css.replace(
        /.case-detail-modal__body \{/,
        `.case-detail-modal__body {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--theme-border) 50%, transparent) transparent;
}
.case-detail-modal__body::-webkit-scrollbar {
  width: 5px;
}
.case-detail-modal__body::-webkit-scrollbar-track {
  background: transparent;
}
.case-detail-modal__body::-webkit-scrollbar-thumb {
  background-color: color-mix(in srgb, var(--theme-muted) 30%, transparent);
  border-radius: 10px;
}
.case-detail-modal__body::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in srgb, var(--theme-muted) 50%, transparent);
}

.case-detail-modal__body {`
    );
}

fs.writeFileSync('src/styles/surfaces.css', css);
