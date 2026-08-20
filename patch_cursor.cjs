const fs = require('fs');
let code = fs.readFileSync('src/components/CustomCursor.tsx', 'utf-8');

code = code.replace(/const now = performance\.now\(\);\s+if \(now < hitTestUntil\.current\) return;\s+hitTestUntil\.current = now \+ 48;\s+const element = document\.elementFromPoint\(x, y\);\s+const nextMode = resolveCursorMode\(element\);\s+const nextHover = nextMode !== "default" \|\| !!element\?\.closest\(INTERACTIVE_SELECTOR\);\s+if \(nextMode !== modeRef\.current \|\| nextHover !== hoveringRef\.current\) \{\s+modeRef\.current = nextMode;\s+hoveringRef\.current = nextHover;\s+paintClasses\(\);\s+\}/g, '');

code = code.replace(/const onMove =/g, `
    const onMouseOver = (event: MouseEvent) => {
      const element = event.target as Element;
      const nextMode = resolveCursorMode(element);
      const nextHover = nextMode !== "default" || !!element?.closest(INTERACTIVE_SELECTOR);
      if (nextMode !== modeRef.current || nextHover !== hoveringRef.current) {
        modeRef.current = nextMode;
        hoveringRef.current = nextHover;
        paintClasses();
      }
    };
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    const onMove =`);

code = code.replace(/window\.removeEventListener\("mousemove", onMove\);/g, `window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousemove", onMove);`);

fs.writeFileSync('src/components/CustomCursor.tsx', code);
