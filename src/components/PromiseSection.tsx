import { motion } from "framer-motion";
import { promiseByMode } from "../data/liveContent";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { AccentWord } from "./AccentWord";
import { AccentScrollFold, inlineWordWidth } from "./AccentScrollFold";
import { SectionHeader, useMode } from "./SectionHeader";

function PromiseStatic() {
  const { mode } = useMode();
  const content = promiseByMode[mode];

  return (
    <section id="promise" className="section-band section-band--quiet">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={content.label} animated={false} />
        <h2 className="section-title max-w-3xl">
          {content.titleLead}
          <AccentWord tone="red">{content.accentWord}</AccentWord>.
        </h2>
        <p className="section-description">{content.description}</p>
      </div>
    </section>
  );
}

function PromiseAnimated() {
  const { mode } = useMode();
  const content = promiseByMode[mode];
  const key = `${mode}-${content.accentWord}-${content.titleLead}`;

  return (
    <AccentScrollFold
      id="promise"
      remountKey={key}
      ambient="bars"
      scrollHeroWord={content.scrollHeroWord}
      label={<SectionHeader label={content.label} animated={false} />}
    >
      {({ inlineRef, lineOpacity, lineX, bodyOpacity, bodyX, inlineOpacity }) => (
        <>
          <h2 className="section-title max-w-3xl accent-scroll-inline-line">
            <motion.span style={{ opacity: lineOpacity, x: lineX }} className="inline">
              {content.titleLead}
            </motion.span>
            <span ref={inlineRef} className="relative inline-block align-baseline" style={{ minWidth: inlineWordWidth(content.accentWord) }}>
              <motion.span style={{ opacity: inlineOpacity }} className="inline">
                <AccentWord tone="red">{content.accentWord}</AccentWord>
              </motion.span>
            </span>
            <motion.span style={{ opacity: lineOpacity, x: lineX }} className="inline">
              .
            </motion.span>
          </h2>
          <motion.p style={{ opacity: bodyOpacity, x: bodyX }} className="section-description">
            {content.description}
          </motion.p>
        </>
      )}
    </AccentScrollFold>
  );
}

export function PromiseSection() {
  const runway = useScrollRunwayEnabled();
  return runway ? <PromiseAnimated /> : <PromiseStatic />;
}
