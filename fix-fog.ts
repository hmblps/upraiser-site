import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/shared.ts", "utf-8");

content = content.replace(`color: "#7e90a8", // Darker, moodier blue-grey to prevent "blowout"`, `color: "#97a6b8", // Brighter winter sky blue-grey`);

fs.writeFileSync("src/components/hero-terrain/shared.ts", content);
