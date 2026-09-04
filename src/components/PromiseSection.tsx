import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { promiseByMode, type SiteMode } from "../data/liveContent";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { AccentScrollFold, inlineWordWidth } from "./AccentScrollFold";
import { SectionHeader, useMode } from "./SectionHeader";
import { formatEventNames } from "../lib/formatEventNames";
import { CommitmentChart } from "./CommitmentChart";
import { ParityWaterChart } from "./ParityWaterChart";

function GrowthWordInline({ word }: { word: string }) {
  return <span className="growth-word-inline">{word}</span>;
}

function PromiseClean() {
  const { mode } = useMode();
  const content = promiseByMode[mode];
  const isParityDark = mode === "infrastructure";
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 35%"],
  });

  return (
    <section id="promise" className="section-band section-band--quiet">
      <ModeContentTransition mode={mode} className="section-inner">
        <SectionHeader label={content.label} title={content.title} animated={false} />
        <div className="section-stack flex max-w-3xl flex-col gap-5">
          <p className="section-lead">{content.line1}</p>
          <p className="section-lead">
            {content.line2Prefix} <GrowthWordInline word={content.inlineWord} />.
          </p>
          <p className="section-description max-w-2xl mt-4 mb-6">{formatEventNames(content.description)}</p>
        </div>
        
        <div ref={ref} className="relative w-full aspect-[4/3] sm:aspect-[21/9] mt-8 pointer-events-none flex items-center justify-center">
           {isParityDark ? <ParityWaterChart progress={scrollYProgress} /> : <CommitmentChart progress={scrollYProgress} />}
        </div>
      </ModeContentTransition>
    </section>
  );
}

function PromiseFold({ mode }: { mode: SiteMode }) {
  const content = promiseByMode[mode];
  const key = `${mode}-${content.inlineWord}-${content.line2Prefix}`;

  return (
    <AccentScrollFold
      id="promise"
      remountKey={key}
      runway="anchor"
      ambient="bars"
      className="accent-scroll-section--fold-pair -mb-[14px]"
      scrollHeroWord={content.scrollHeroWord}
      label={<SectionHeader label={content.label} title={content.title} animated={false} />}
    >
      {({ inlineRef, lineOpacity, lineX, bodyOpacity, bodyX, inlineOpacity }) => (
        <>
          <motion.p className="section-lead relative z-[2]" style={{ opacity: lineOpacity, x: lineX }}>
            {content.line1}
          </motion.p>
          <p className="section-lead accent-scroll-inline-line relative z-[2]">
            <motion.span style={{ opacity: bodyOpacity, x: bodyX }} className="inline">
              {content.line2Prefix}{" "}
            </motion.span>
            <span ref={inlineRef} className="relative inline-block align-baseline" style={{ minWidth: inlineWordWidth(content.inlineWord) }}>
              <motion.span style={{ opacity: inlineOpacity }} className="inline">
                <GrowthWordInline word={content.inlineWord} />
              </motion.span>
            </span>
            <motion.span style={{ opacity: bodyOpacity, x: bodyX }} className="inline">
              .
            </motion.span>
          </p>
          <motion.p className="section-description relative z-[2] mt-10 mb-6 max-w-2xl" style={{ opacity: bodyOpacity, x: bodyX }}>
            {formatEventNames(content.description)}
          </motion.p>
        </>
      )}
    </AccentScrollFold>
  );
}

export function PromiseSection() {
  const { mode } = useMode();
  const runway = useScrollRunwayEnabled();
  if (!runway) return <PromiseClean />;
  return (
    <ModeContentTransition mode={mode}>
      <PromiseFold mode={mode} />
    </ModeContentTransition>
  );
}
