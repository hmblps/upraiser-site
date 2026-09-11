const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Remove the Html block
code = code.replace(
  /\{formatId === "rich" && \([\s\S]*?<\/mesh>\s*\)\}/,
  ''
);

// 2. Add isRichMedia logic for pointer events
code = code.replace(
  /const isCssFormat = false;/,
  'const isCssFormat = false;\n  const isRichMedia = formatId === "rich";'
);

code = code.replace(
  /onPointerDown=\{isCssFormat \? undefined : onPointerDown\}/,
  'onPointerDown={isCssFormat || isRichMedia ? undefined : onPointerDown}'
);

code = code.replace(
  /onPointerMove=\{isCssFormat \? undefined : onPointerMove\}/,
  'onPointerMove={isCssFormat || isRichMedia ? undefined : onPointerMove}'
);

code = code.replace(
  /onPointerUp=\{isCssFormat \? undefined : endDrag\}/,
  'onPointerUp={isCssFormat || isRichMedia ? undefined : endDrag}'
);

code = code.replace(
  /onPointerCancel=\{isCssFormat \? undefined : endDrag\}/,
  'onPointerCancel={isCssFormat || isRichMedia ? undefined : endDrag}'
);

// 3. Add the phone-rich-on-glb div at the very bottom, just before the closing </div>
const overlayCode = `
      <AnimatePresence>
        {isCssFormat && <CssFormatPhone mode={mode} formatId={formatId as "rich" | "video"} />}
      </AnimatePresence>

      {isRichMedia ? (
        <div className="phone-rich-on-glb" aria-hidden={false}>
          <iframe
            src="/rich-media-ad.html"
            title="ING Rich Media"
            allow="autoplay; encrypted-media"
            scrolling="no"
          />
        </div>
      ) : null}
    </div>
  );
});`;

code = code.replace(
  /<AnimatePresence>[\s\S]*?<\/AnimatePresence>[\s\S]*?<\/div>\s*\);\s*\}\);/,
  overlayCode
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
