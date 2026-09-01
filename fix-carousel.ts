import fs from "fs";

let code = fs.readFileSync("src/hooks/useInfiniteCaseCarousel.ts", "utf-8");

if (!code.includes("animate(")) {
  code = code.replace(
    'import { useEffect, useRef, useState, type RefObject } from "react";',
    'import { useEffect, useRef, useState, type RefObject } from "react";\nimport { animate } from "framer-motion";\nimport { SPRING_SOFT } from "../lib/motion";'
  );

  code = code.replace(
    'el.scrollTo({ left: target, behavior: "smooth" });',
    `animate(el.scrollLeft, target, {
        type: "spring",
        stiffness: 150,
        damping: 25,
        mass: 0.8,
        onUpdate: (v) => {
          el.scrollLeft = v;
        },
      });`
  );

  code = code.replace(
    'el.scrollTo({ left: targetLeft, behavior: "smooth" });',
    `animate(el.scrollLeft, targetLeft, {
        type: "spring",
        stiffness: 150,
        damping: 25,
        mass: 0.8,
        onUpdate: (v) => {
          el.scrollLeft = v;
        },
      });`
  );

  fs.writeFileSync("src/hooks/useInfiniteCaseCarousel.ts", code);
}
