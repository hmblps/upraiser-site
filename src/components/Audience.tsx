import { motion } from "framer-motion";
import { audienceByMode } from "../data/liveContent";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { AccentScrollFold, inlineWordWidth } from "./AccentScrollFold";
import { SectionHeader, useMode } from "./SectionHeader";
import { formatEventNames } from "../lib/formatEventNames";

function GrowthWordInline({ word }: { word: string }) {
  return <span className="growth-word-inline">{word}</span>;
}

function AudienceStatic() {
  const { mode } = useMode();
  const content = audienceByMode[mode];

  return (
    <section id="audience" className="section-band section-band--quiet">
      <ModeContentTransition mode={mode} className="section-inner">
        <SectionHeader label={content.label} title={content.title} animated={false} />
        <div className="section-stack flex max-w-3xl flex-col gap-5">
          <p className="section-lead">{content.line1}</p>
          <p className="section-lead">
            {content.line2Prefix} <GrowthWordInline word={content.inlineWord} />
          </p>
          <p className="section-description max-w-2xl mb-20 whitespace-pre-wrap">{formatEventNames(content.description)}</p>
        </div>
      </ModeContentTransition>
    </section>
  );
}

function AudienceAnimated() {
  const { mode } = useMode();
  const content = audienceByMode[mode];
  const key = `${mode}-${content.inlineWord}-${content.line2Prefix}`;

  return (
    <AccentScrollFold
      id="audience"
      remountKey={key}
      runway="anchor"
      startLine={0.76}
      ambient={mode === "infrastructure" ? "fraud" : "chart"}
      className={`accent-scroll-section--fold-pair${mode === "infrastructure" ? " accent-scroll-section--split-copy" : ""}`.trim()}
      scrollHeroWord={content.scrollHeroWord}
      label={<SectionHeader label={content.label} title={content.title} animated={false} />}
    >
      {({ inlineRef, lineOpacity, lineX, bodyOpacity, bodyX, inlineOpacity }) => (
        <>
          <motion.p className="section-lead" style={{ opacity: lineOpacity, x: lineX }}>
            {content.line1}
          </motion.p>
          <p className="section-lead accent-scroll-inline-line">
            <motion.span style={{ opacity: bodyOpacity, x: bodyX }} className="inline">
              {content.line2Prefix}{" "}
            </motion.span>
            <span ref={inlineRef} className="relative inline-block align-baseline" style={{ minWidth: inlineWordWidth(content.inlineWord) }}>
              <motion.span style={{ opacity: inlineOpacity }} className="inline">
                <GrowthWordInline word={content.inlineWord} />
              </motion.span>
            </span>
          </p>
          <motion.div className="section-description mt-6 mb-20 max-w-2xl whitespace-pre-wrap" style={{ opacity: bodyOpacity, x: bodyX }}>
            {formatEventNames(content.description)}
          </motion.div>
        </>
      )}
    </AccentScrollFold>
  );
}

export function Audience() {
  const runway = useScrollRunwayEnabled();
  const { mode } = useMode();
  if (!runway) return <AudienceStatic />;
  return (
    <ModeContentTransition mode={mode}>
      <AudienceAnimated />
    </ModeContentTransition>
  );
}
