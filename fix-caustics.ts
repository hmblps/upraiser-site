import fs from "fs";
let code = fs.readFileSync("src/components/ParityCausticsCanvas.tsx", "utf-8");

if (!code.includes("reduced?: boolean")) {
  code = code.replace(
    '  progress?: MotionValue<number>;',
    '  progress?: MotionValue<number>;\n  reduced?: boolean;'
  );
  code = code.replace(
    'export function ParityCausticsCanvas({ progress }: ParityCausticsCanvasProps) {',
    'export function ParityCausticsCanvas({ progress, reduced }: ParityCausticsCanvasProps) {'
  );
  code = code.replace(
    '        if (next && !visible) {\\n          visible = true;\\n          if (!raf) raf = requestAnimationFrame(tick);\\n        } else if (!next) {\\n          visible = false;\\n        }',
    `        if (next && !visible) {
          visible = true;
          if (!raf && !reduced) raf = requestAnimationFrame(tick);
        } else if (!next) {
          visible = false;
        }`
  );
  code = code.replace(
    '    if (!disposed && visible) {',
    '    if (!disposed && visible && !reduced) {'
  );
  fs.writeFileSync("src/components/ParityCausticsCanvas.tsx", code);
}

let waterCode = fs.readFileSync("src/components/ParityWaterChart.tsx", "utf-8");
if (!waterCode.includes("reduced={reduced}")) {
  waterCode = waterCode.replace('<ParityCausticsCanvas progress={progress} />', '<ParityCausticsCanvas progress={progress} reduced={reduced} />');
  waterCode = waterCode.replace('<ParityCausticsCanvas />', '<ParityCausticsCanvas reduced={reduced} />');
  fs.writeFileSync("src/components/ParityWaterChart.tsx", waterCode);
}
