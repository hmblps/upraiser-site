const fs = require("fs");
const file = "src/styles/programmatic-scroll-section.css";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /\.prog-scroll-copy-stack \{[^}]+\}/,
  `.prog-scroll-copy-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.35rem;
  width: 100%;
  max-width: 28rem;
  min-height: 0;
  height: 25rem;
  overflow: visible;
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
  height: 100%;
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

fs.writeFileSync(file, code);
