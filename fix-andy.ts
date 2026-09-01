import fs from "fs";

let main = fs.readFileSync("src/main.tsx", "utf-8");
if (!main.includes("andy-kowalski.css")) {
  main = main.replace('import "./index.css";', 'import "./index.css";\nimport "./styles/andy-kowalski.css";');
  fs.writeFileSync("src/main.tsx", main);
}
