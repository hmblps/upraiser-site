import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/Scene.tsx", "utf-8");
if (!content.includes("SeaOfClouds")) {
  console.log("No SeaOfClouds found");
} else {
  content = content.replace("import { MistSheets } from \"./MistSheets\";", "import { MistSheets } from \"./MistSheets\";\nimport { SeaOfClouds } from \"./SeaOfClouds\";");
  fs.writeFileSync("src/components/hero-terrain/Scene.tsx", content);
}
