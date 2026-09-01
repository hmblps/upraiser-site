import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

// Remove it from ExpeditionCrewFold
content = content.replace("  const DEBUG_HIDE_TYPO = true; // Temporary flag to focus purely on 3D cinematography\n", "");
content = content.replace("export function ExpeditionCrewFold() {\n", "export function ExpeditionCrewFold() {\n");

// Add it to CrewAnimated
content = content.replace("function CrewAnimated() {", "function CrewAnimated() {\n  const DEBUG_HIDE_TYPO = true;");

// Fix the veil prop
content = content.replace("veil={DEBUG_HIDE_TYPO ? 0 : veil}", "veil={veil}");

fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
