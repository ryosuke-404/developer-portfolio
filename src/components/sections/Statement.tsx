'use client';

import { useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue, MotionValue } from 'motion/react';
import { profile } from '@/data/profile';

/* ── 1文字ごとにスクロール連動で色が変わる ──────────────────── */
function ScrollChar({
  char, progress, start, end, isAccent,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  isAccent: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const color   = useTransform(
    progress,
    [start, end],
    ['rgba(240,236,228,0.08)', isAccent ? '#6db89a' : '#f0ece4'],
  );
  return <motion.span style={{ opacity, color }}>{char}</motion.span>;
}

export default function Statement() {
  const ref      = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  // Lenis は window.scrollTo() を使うため useScroll({ target }) が追跡できない。
  // getBoundingClientRect() でセクション進捗を直接計算する。
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const top    = el.getBoundingClientRect().top;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      progress.set(Math.max(0, Math.min(1, -top / travel)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [progress]);

  const sectionOpacity = useTransform(progress, [0, 0.04, 0.90, 1], [0, 1, 1, 0]);
  const lineScaleX     = useTransform(progress, [0.02, 0.14], [0, 1]);
  const subOpacity     = useTransform(progress, [0.72, 0.82], [0, 1]);

  const lines      = profile.statement;
  const totalChars = lines.reduce((s, l) => s + l.length, 0); // 34

  const REVEAL_START = 0.05;
  const REVEAL_END   = 0.70;
  const range        = REVEAL_END - REVEAL_START;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ minHeight: '300vh' }}
      aria-label="Statement"
    >
      <div
        className="sticky top-0 flex items-center justify-center overflow-hidden"
        style={{ height: '100svh' }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(79,140,98,0.06) 0%, transparent 100%)',
            opacity: sectionOpacity,
          }}
        />

        <motion.div className="relative z-10 container text-left" style={{ opacity: sectionOpacity }}>
          <motion.div
            className="w-10 h-px bg-[var(--accent)] mb-10 origin-left"
            style={{ scaleX: lineScaleX }}
          />

          <h2
            className="font-display font-extrabold tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4.5rem)' }}
            aria-label={lines.join(' ')}
          >
            {lines.map((line, li) => {
              const charsBeforeLine = lines.slice(0, li).reduce((s, l) => s + l.length, 0);
              const isLastLine      = li === lines.length - 1;
              return (
                <div key={li} className={`block${isLastLine ? ' whitespace-nowrap' : ''}`}>
                  {line.split('').map((char, ci) => {
                    const idx   = charsBeforeLine + ci;
                    const start = REVEAL_START + (idx / totalChars) * range;
                    const end   = start + (range / totalChars) * 2;
                    return (
                      <ScrollChar
                        key={`${li}-${ci}`}
                        char={char}
                        progress={progress}
                        start={start}
                        end={end}
                        isAccent={isLastLine}
                      />
                    );
                  })}
                </div>
              );
            })}
          </h2>

          <motion.p
            className="font-mono text-xs tracking-widest mt-4"
            style={{ opacity: subOpacity, color: 'var(--muted)' }}
          >
            {profile.statementSub}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
