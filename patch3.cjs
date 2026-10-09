const fs = require('fs');
let code = fs.readFileSync('src/components/ModeChart.tsx', 'utf8');

const replacement = `
  return (
    <motion.div 
      className={\`fold-chart fold-chart--\${mode}\`} 
      style={{ opacity }} 
      aria-hidden
    >
      {!isGrowth ? (
        <FraudScrollChart progress={progress} />
      ) : (
        <>
          <div className="fold-chart-ghosts">
            {ghosts.map((g) => (
              <GhostBubble key={g.id} metric={g} morph={morph} />
            ))}
          </div>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={\`0 0 \${chartWidth} \${chartHeight}\`}
              preserveAspectRatio="none"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
              }}
            >
              <g transform={\`translate(0, 0)\`}>
                {targets.map((_, i) => {
                  const x = (i / (targets.length - 1)) * chartWidth;
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1={350}
                      x2={x}
                      y2={370}
                      stroke="var(--theme-accent)"
                      strokeOpacity="0.3"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>

              <motion.path
                d={dSecondary}
                fill="none"
                stroke="var(--theme-accent-secondary)"
                strokeWidth="3"
                strokeOpacity="0.8"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 4px 12px var(--theme-accent-dim))" }}
              />

              <motion.path
                d={dPrimary}
                fill="none"
                stroke="var(--theme-accent)"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 4px 16px var(--theme-accent-dim))" }}
              />
            </svg>
          </div>
        </>
      )}
    </motion.div>
  );
`;

code = code.replace(/return \([\s\S]*?\);\n\}/, replacement.trim() + '\n}');
fs.writeFileSync('src/components/ModeChart.tsx', code);
