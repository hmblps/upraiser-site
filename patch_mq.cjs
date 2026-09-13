const fs = require("fs");
const file = "src/styles/programmatic-scroll-section.css";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /\.format-copy__progress\s*\{\s*margin-top:\s*auto;\s*\}/,
  `.format-copy__progress {
    margin-top: 0.85rem;
  }`
);

fs.writeFileSync(file, code);
