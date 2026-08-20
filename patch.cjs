const fs = require('fs');
let code = fs.readFileSync('src/components/PartnersCarousel.tsx', 'utf-8');

if (!code.includes('createPortal')) {
  code = code.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { createPortal } from "react-dom";');
}

code = code.replace(
  /<div className="fixed inset-0 z-\[1000\] flex items-center justify-center p-4 sm:p-8">([\s\S]*?)<\/div>\s*<\/AnimatePresence>/,
  (match, p1) => {
    return `{typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8">
            ${p1}
          </div>,
          document.body
        )}
      </AnimatePresence>`;
  }
);

fs.writeFileSync('src/components/PartnersCarousel.tsx', code);
