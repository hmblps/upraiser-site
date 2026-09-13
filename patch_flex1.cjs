const fs = require("fs");
const file = "src/components/solutions/ProgrammaticScrollSection.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  '<div className="relative w-full h-full flex flex-col">',
  '<div className="relative w-full flex-1 flex flex-col">'
);

fs.writeFileSync(file, code);
