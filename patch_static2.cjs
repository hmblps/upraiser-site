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
  height: 21rem;
}`
);

code = code.replace(
  /\.format-copy-wrap \{[^}]+\}/,
  `.format-copy-wrap {
  width: 100%;
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}`
);

code = code.replace(
  /\.format-copy__progress \{[^}]+\}/,
  `.format-copy__progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}`
);

fs.writeFileSync(file, code);
