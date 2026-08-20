const fs = require('fs');
let code = fs.readFileSync('src/components/PartnersCarousel.tsx', 'utf-8');

// Replace the return block for the modal to use createPortal
if (!code.includes('createPortal')) {
    code = `import { createPortal } from "react-dom";\n` + code;
}

code = code.replace(
    /<AnimatePresence>\s*\{modalOpen && \(\s*<div className="fixed inset-0 z-\[1000\] flex items-center justify-center p-4 sm:p-8">\s*<motion\.div/g,
    `<AnimatePresence>\n        {modalOpen && createPortal(\n          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8">\n            <motion.div`
);

code = code.replace(
    /<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/g,
    `</motion.div>\n          </div>,\n          document.body\n        )}\n      </AnimatePresence>`
);

fs.writeFileSync('src/components/PartnersCarousel.tsx', code);
