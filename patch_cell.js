const fs = require('fs');
const p = "src/components/Hero.tsx";
let s = fs.readFileSync(p, "utf-8");
s = s.replace(
  'className={`snap-center shrink-0 w-[85vw] md:w-auto flex md:block ${isLeft ? \\'justify-start md:justify-self-start\\' : \\'justify-start md:justify-self-end\\'}`}',
  'className={`hero-stats__cell snap-center shrink-0 w-[85vw] md:w-auto flex md:block ${isLeft ? \\'justify-start md:justify-self-start\\' : \\'justify-start md:justify-self-end\\'}`}'
);
fs.writeFileSync(p, s);
