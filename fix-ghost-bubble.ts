import fs from "fs";

let code = fs.readFileSync("src/components/ModeChart.tsx", "utf-8");
code = code.replace(
  'function GhostBubble({ metric, morph }: { metric: GhostMetric; morph: MotionValue<number> }) {',
  `function GhostBubble({ metric, morph }: { metric: GhostMetric; morph: MotionValue<number> }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const updateDOM = (v: number) => {
      if (!containerRef.current) return;
      const strVal = metric.format(v);
      const match = strVal.match(/^(\\D*)(\\d+(?:\\.\\d+)?)(\\D*)$/);
      
      if (!match) {
        containerRef.current.textContent = strVal;
        return;
      }
      const [, prefix, num, suffix] = match;
      
      let html = "";
      if (prefix) html += \`<span class="font-sans font-semibold tracking-normal text-[0.7em] mr-[0.1em] opacity-80">\${prefix}</span>\`;
      html += num;
      if (suffix) html += \`<span class="font-sans font-semibold tracking-normal text-[0.7em] ml-[0.05em] opacity-80">\${suffix}</span>\`;
      
      containerRef.current.innerHTML = html;
    };
    
    const unsub = morph.on("change", updateDOM);
    updateDOM(morph.get());
    return unsub;
  }, [morph, metric]);`
);
code = code.replace(
  '// Direct DOM mutation bypassing React Render',
  ''
);
code = code.replace(
  /useEffect\(\(\) => \{\s+const unsub = morph\.on[\s\S]+?return unsub;\s+\}, \[morph, metric\]\);/,
  ''
);
code = code.replace(
  '<span className="font-sans font-semibold tracking-normal text-[0.7em] mr-[0.1em] opacity-80" ref={valueRef}></span>',
  '<span ref={containerRef}></span>'
);

fs.writeFileSync("src/components/ModeChart.tsx", code);
