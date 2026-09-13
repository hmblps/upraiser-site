const fs = require("fs");
const file = "src/components/solutions/FormatCopy.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /<div className="format-copy__progress">[\s\S]*?<\/div>\s*<\/div>\s*<\/motion\.div>/,
  `</motion.div>`
);

fs.writeFileSync(file, code);
