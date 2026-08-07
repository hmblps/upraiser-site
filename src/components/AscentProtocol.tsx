import { ASCENT_PROTOCOLS } from "../data/innerPagesData";

export function AscentProtocol() {
  return (
    <div className="ascent-protocol h-full min-h-0 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid gap-4 pb-8 md:grid-cols-2">
        {ASCENT_PROTOCOLS.map((item) => (
          <article
            key={item.protocolNumber}
            className="flex flex-col gap-3 rounded-xl border border-border/40 bg-bg-card/45 p-5 transition-all duration-300 hover:border-orange/30 hover:bg-bg-card/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/20 pb-2.5">
              <span className="font-mono text-xs font-semibold tracking-wider text-orange">
                {item.protocolNumber}
              </span>
              <span className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted">
                Secure Ascent Directive
              </span>
            </div>
            
            <h3 className="font-sans text-sm font-bold leading-snug text-fg sm:text-[0.9375rem] mt-1">
              {item.question}
            </h3>
            
            <p className="font-sans text-xs leading-relaxed text-muted-light sm:text-[0.8125rem] mt-1">
              {item.answer}
            </p>
            
            <div className="mt-auto pt-3.5 flex">
              <span className="inline-flex items-center gap-1.5 rounded border border-orange/20 bg-orange/5 px-2.5 py-1 font-mono text-[0.6875rem] font-semibold text-orange-light">
                <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" aria-hidden />
                {item.ogilvyProof}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
