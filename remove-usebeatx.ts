import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");
content = content.replace(/function useBeatX\([\s\S]*?return 0;\n  \}\);\n\}\n/g, "");
fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
