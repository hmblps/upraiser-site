const fs = require("fs");
const file = "src/styles/programmatic-scroll-section.css";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /\.format-copy__body\s*\{\s*margin-top:\s*auto;/,
  `.format-copy__body {\n  margin-top: 1.75rem;`
);

fs.writeFileSync(file, code);
