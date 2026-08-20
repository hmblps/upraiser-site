import { motion } from "framer-motion";
import { SPRING_SOFT } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const OPERATORS = [
  {
    id: "data-engineers",
    role: "Data Infrastructure & Bidding",
    title: "The Data Engineers",
    background: "High-frequency trading, ML models, Big Data architecture.",
    protocol: "We don't guess. We calculate. Building 0.4ms latency scoring engines.",
    specs: ["0.4ms response time", "180+ pre-bid signals", "Fraud anomaly detection"]
  },
  {
    id: "creative-technologists",
    role: "CGC & Visual Hooks",
    title: "The Creative Technologists",
    background: "Motion design, Behavioral Psychology, Direct-response frameworks.",
    protocol: "Engineering creative assets that trigger dopamine and conversion.",
    specs: ["A/B/n multivariate testing", "Creator-Generated Content", "LTV-driven ideation"]
  },
  {
    id: "media-operators",
    role: "Traffic Routing & Scaling",
    title: "The Media Operators",
    background: "Multi-million dollar budget management, deep SDK integrations.",
    protocol: "Managing risk. Maximizing ROAS. Enforcing Zero Drift.",
    specs: ["Programmatic routing", "OEM factory placements", "Real-time P&L control"]
  }
];

export function TheOperatorsSpec() {
  const reduced = useReducedMotion();

  return (
    <section className="operators-spec w-full py-8 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 border-b border-border/30 pb-6">
          <h2 className="text-3xl font-medium tracking-tight">The Operators</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-light">
            We are not account managers. We are an elite rigging crew of data engineers, creative technologists, and media buyers executing at the highest altitude.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OPERATORS.map((op, idx) => (
            <motion.article 
              key={op.id}
              className="operator-card relative flex flex-col rounded-2xl border border-border/40 bg-bg-card p-6 md:p-8 hover:border-accent/30 transition-colors"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduced ? { duration: 0 } : { ...SPRING_SOFT, delay: idx * 0.1 }}
            >
              <div className="absolute right-6 top-6 flex gap-1.5" aria-hidden="true">
                <div className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
              </div>

              <div className="mb-8 mt-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                  {op.role}
                </p>
                <h3 className="text-xl font-medium text-fg">{op.title}</h3>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-muted-light mb-2 border-b border-border/20 pb-1">Background</p>
                  <p className="text-sm text-fg/80 leading-relaxed">{op.background}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-muted-light mb-2 border-b border-border/20 pb-1">Protocol</p>
                  <p className="text-sm font-medium text-fg leading-relaxed">"{op.protocol}"</p>
                </div>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-border/20">
                {op.specs.map(spec => (
                  <li key={spec} className="rounded border border-border/30 bg-bg px-2 py-1 font-mono text-[10px] text-muted-light">
                    {spec}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
