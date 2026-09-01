import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");
if (content.includes("import { useRef } from \"react\";")) {
  content = content.replace("import { useRef } from \"react\";", "import { useRef, useEffect } from \"react\";");
} else if (content.includes("import { useRef, useEffect }")) {
  // Already there
} else {
  content = "import { useEffect } from 'react';\n" + content;
}
fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
