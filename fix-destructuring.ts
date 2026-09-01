import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

content = content.replace("const { progress: rawProgress } = useSectionScrollProgress(sectionRef);", "const rawProgress = useSectionScrollProgress(sectionRef);");

// Also check if any unused variables exist
content = content.replace("const wordClass = accentScrollHeroWordClass(mode);", "// unused");

fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
