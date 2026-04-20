'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { profile } from '@/data/profile';
import ScrambleText from '@/components/ScrambleText';
import RevealText from '@/components/RevealText';

/* ── Phase accent colors (5 phases) ──────────────────────── */
const PHASE_COLORS = ['#4f8c62', '#6db89a', '#8b7ec8', '#c4956a', '#4f8c62'];

function TimelineDot({ scrollYProgress, yPct, i, N, color }: { scrollYProgress: MotionValue<number>; yPct: number; i: number; N: number; color: string }) {
  const scale = useTransform(scrollYProgress, [i / N, Math.min((i + 0.5) / N, 1)], [0, 1]);
  const opacity = useTransform(scrollYProgress, [i / N, Math.min((i + 0.3) / N, 1)], [0, 1]);
  return (
    <motion.circle
      cx="14" cy={`${yPct}%`} r="4"
      fill="var(--bg)"
      stroke={color}
      strokeWidth="1.5"
      style={{ scale, opacity }}
    />
  );
}

/* ── Scroll-drawn SVG timeline ────────────────────────────── */
function TimelineSVG() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const N = profile.experience.length;
  const dotPositions = profile.experience.map((_, i) =>
    i === 0 ? 2 : i === N - 1 ? 98 : Math.round((i / (N - 1)) * 96 + 2),
  );

  return (
    <div ref={ref} className="absolute left-0 top-0 h-full w-7 hidden md:block" aria-hidden="true">
      <svg className="w-full h-full" style={{ width: 28, overflow: 'visible' }}>
        <line x1="14" y1="0%" x2="14" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <motion.line
          x1="14" y1="0%" x2="14" y2="100%"
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"
          style={{ pathLength, opacity: useTransform(pathLength, [0, 0.05], [0, 1]) }}
        />
        {dotPositions.map((yPct, i) => (
          <TimelineDot
            key={i}
            scrollYProgress={scrollYProgress}
            yPct={yPct}
            i={i}
            N={N}
            color={PHASE_COLORS[i]}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Flow arrow between phases ────────────────────────────── */
function FlowArrow({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2 mb-8 pl-0 md:pl-0 -mt-4">
      <div className="flex items-center gap-1.5">
        <div className="h-px w-8" style={{ background: color, opacity: 0.4 }} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M6 2l3 3-3 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section relative">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono opacity-40 mr-2">04 —</span><ScrambleText text="Experience" />
        </motion.p>

        <h2 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-[var(--text)] mb-4">
          <RevealText
            lines={['歩んできた道']}
            lineClassName="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-[var(--text)]"
            delay={0.1}
          />
        </h2>

        {/* Summary statement */}
        <motion.p
          className="text-[var(--muted)] text-sm leading-relaxed mb-16 max-w-2xl font-mono"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          データ取得 → 解析 → 証明 → 提供。この流れを一貫して設計する能力の獲得過程。
        </motion.p>

        {/* Timeline */}
        <div className="relative md:pl-10">
          <TimelineSVG />

          {profile.experience.map((exp, i) => {
            const color = PHASE_COLORS[i];
            const isLast = i === profile.experience.length - 1;
            return (
              <div key={i}>
                <motion.article
                  className="pb-10"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: i * 0.05 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12">

                    {/* Left — year + phase */}
                    <div className="flex md:flex-col gap-3 md:gap-2 pt-1">
                      <span className="font-display font-extrabold text-2xl leading-none" style={{ color }}>
                        {exp.period}
                      </span>
                      <span
                        className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-full self-start whitespace-nowrap"
                        style={{
                          color,
                          background: color + '14',
                          border: `1px solid ${color}28`,
                        }}
                      >
                        {exp.phase}
                      </span>
                    </div>

                    {/* Right — content */}
                    <div className={`pb-10 ${!isLast ? 'border-b border-[var(--border)]' : ''}`}>
                      {/* Role */}
                      <h3 className="font-display font-bold text-[clamp(1.3rem,2.8vw,2rem)] leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        <RevealText
                          lines={[exp.role]}
                          lineClassName="font-display font-bold text-[clamp(1.3rem,2.8vw,2rem)] leading-[1.1] tracking-tight text-[var(--text)]"
                          delay={i * 0.05 + 0.12}
                        />
                      </h3>

                      {/* Description */}
                      <motion.p
                        className="text-[var(--muted)] text-sm leading-relaxed mb-4 max-w-xl"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 + 0.18 }}
                      >
                        {exp.description}
                      </motion.p>

                      {/* Highlight — key insight */}
                      <motion.div
                        className="flex items-start gap-2 mb-5 px-3.5 py-2.5 rounded-xl"
                        style={{
                          background: color + '0e',
                          border: `1px solid ${color}22`,
                        }}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.05 + 0.24 }}
                      >
                        <span className="mt-0.5 shrink-0" style={{ color }}>✦</span>
                        <p className="font-mono text-[11px] leading-relaxed" style={{ color }}>
                          {exp.highlight}
                        </p>
                      </motion.div>

                      {/* Tags */}
                      <motion.div
                        className="flex flex-wrap gap-1.5"
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 + 0.28 }}
                      >
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.article>

                {/* Flow arrow between phases */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 + 0.3 }}
                  >
                    <FlowArrow color={PHASE_COLORS[i + 1]} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
