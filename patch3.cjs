const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalAmbientModalBackground.tsx', 'utf-8');

code = code.replace(
    /\{isOpen && \(\s*<video/g,
    `<video`
);

code = code.replace(
    /<\/video>\s*\)\}/g,
    `</video>`
);

fs.writeFileSync('src/components/GlobalAmbientModalBackground.tsx', code);
