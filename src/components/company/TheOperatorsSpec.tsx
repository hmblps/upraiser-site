import { motion } from "framer-motion";
import { SPRING_SOFT } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const OPERATORS = [
  {
    id: "data-engineers",
    role: "Data & bidding",
    title: "The Data Engineers",
    protocol: "0.4ms scoring. 180 device signals. Fraud screened before the bid.",
  },
  {
    id: "creative-technologists",
    role: "CGC & hooks",
    title: "The Creative Technologists",
    protocol: "Creator media traced to the install log — LTV, not clicks.",
  },
  {
    id: "media-operators",
    role: "Routing & scale",
    title: "The Media Operators",
    protocol: "Programmatic, OEM, CTV on one desk. Zero post-flight drift.",
  },
] as const;

export function TheOperatorsSpec({ immediate = false }: { immediate?: boolean }) {
  const reduced = useReducedMotion();
  const skip = reduced || immediate;

  return (
    <div className="expedition-crew-grid">
      {OPERATORS.map((op, idx) => (
        <motion.article
          key={op.id}
          className="expedition-crew-card"
          initial={skip ? false : { opacity: 0, y: 12 }}
          whileInView={skip ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={skip ? { duration: 0 } : { ...SPRING_SOFT, delay: idx * 0.08 }}
        >
          <p className="expedition-crew-card__role">{op.role}</p>
          <h3 className="card-title mt-2">{op.title}</h3>
          <p className="copy mt-2">{op.protocol}</p>
        </motion.article>
      ))}
    </div>
  );
}
