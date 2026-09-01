import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/Scene.tsx", "utf-8");

const start = content.indexOf("{lite ? (");
const end = content.indexOf(") : null}") + 9;

if (start !== -1 && end !== -1) {
  content = content.slice(0, start) + content.slice(end);
}
fs.writeFileSync("src/components/hero-terrain/Scene.tsx", content);
