const fs = require("fs");
const file = "src/styles/programmatic-scroll-section.css";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /\.prog-scroll-copy-stack \{[^}]+\}/,
  `.prog-scroll-copy-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
}`
);

code = code.replace(
  /\.format-copy-wrap \{[^}]+\}/,
  `.format-copy-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  min-height: 0;
  overflow: visible;
}`
);

code = code.replace(
  /\.format-copy \{[^}]+\}/,
  `.format-copy {
  width: 100%;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}`
);

code = code.replace(
  /\.format-copy__progress\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*1rem;\s*margin-top:\s*auto;\s*\}/,
  `.format-copy__progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.75rem;
}`
);

fs.writeFileSync(file, code);
