'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { profile } from '@/data/profile';
import ScrambleText from '@/components/ScrambleText';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <section id="about" ref={sectionRef} className="section relative overflow-hidden">
      {/* Blob */}
      <motion.div
        className="blob absolute -right-60 top-0 w-[500px] h-[500px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-3) 0%, transparent 65%)', y: blobY }}
      />

      <div className="container relative z-10">
        {/* ── 2-col editorial grid (md+) ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-16 md:gap-24 items-start">

          {/* ── Left: sticky headline ── */}
          <div className="md:sticky md:top-28">
            <motion.p
              className="section-label mb-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-mono opacity-40 mr-2">01 —</span>
              <ScrambleText text="About" />
            </motion.p>

            {/* Big display number — decorative */}
            <motion.div
              className="font-display font-extrabold leading-none select-none mb-4 -ml-1"
              style={{ fontSize: 'clamp(5rem, 14vw, 10rem)', color: 'rgba(240,236,228,0.04)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              aria-hidden="true"
            >
              Me
            </motion.div>

            <motion.h2
              className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.05 }}
            >
              私の物語
            </motion.h2>

            <motion.div
              className="w-10 h-px bg-[var(--accent)] mb-6"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            <motion.p
              className="text-[var(--muted)] leading-relaxed text-[0.95rem] mb-10 max-w-md"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
            >
              {profile.about.intro}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              {profile.skills.stats.map((s, i) => (
                <div key={i}>
                  <p className="font-display font-extrabold text-3xl" style={{ color: i === 0 ? 'var(--accent)' : 'var(--accent-2)' }}>
                    {s.value}
                  </p>
                  <p className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: story timeline ── */}
          <div className="flex flex-col gap-0 pt-2 md:pt-0">
            {profile.about.story.map((chapter, i) => (
              <motion.div
                key={i}
                className="relative flex gap-6 pb-14 last:pb-0"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.08 }}
              >
                {/* Timeline rail */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
                  />
                  {i < profile.about.story.length - 1 && (
                    <div className="flex-1 w-px mt-2" style={{ background: 'var(--border)' }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] uppercase block mb-2">
                    {chapter.year}
                  </span>
                  <div
                    className="p-5 rounded-xl group hover:border-[rgba(255,255,255,0.14)] transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-200">
                      {chapter.title}
                    </h3>
                    <p className="text-[var(--muted)] leading-relaxed text-sm">
                      {chapter.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
