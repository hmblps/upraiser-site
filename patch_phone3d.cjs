const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Add useMotionTemplate import
code = code.replace(
  'import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";',
  'import { AnimatePresence, motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";'
);

// 2. Change isCssFormat
code = code.replace(
  'const isCssFormat = formatId === "rich" || formatId === "video";',
  'const isCssFormat = formatId === "video";'
);

// 3. Add the motion.div for "rich" below AnimatePresence
const richBlock = `
      <AnimatePresence>
        {isCssFormat && <CssFormatPhone mode={mode} formatId={formatId as "rich"} />}
      </AnimatePresence>

      {formatId === "rich" && (
        <motion.div
          className="phone-rich-on-glb"
          style={{
            transform: useMotionTemplate\`perspective(1200px) translate(-50%, -50%) rotateX(\${springX}rad) rotateY(\${springY}rad) translateZ(8px)\`
          }}
        >
          <iframe
            src="/rich-media-ad.html"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="autoplay; encrypted-media"
            title="Rich Media Ad"
          />
        </motion.div>
      )}
`;
code = code.replace(
  '<AnimatePresence>\n        {isCssFormat && <CssFormatPhone mode={mode} formatId={formatId as "rich"} />}\n      </AnimatePresence>',
  richBlock.trim()
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
