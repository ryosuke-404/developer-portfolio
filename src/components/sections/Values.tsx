'use client';

import { motion } from 'motion/react';
import { profile } from '@/data/profile';
import ScrambleText from '@/components/ScrambleText';
import TiltCard from '@/components/TiltCard';

// Clay card base (shared with Skills)
const clay: React.CSSProperties = {
  background: 'linear-gradient(145deg, #1e1e2a 0%, #14141c 100%)',
  borderRadius: '1.25rem',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: [
    '0 0 0 1px rgba(255,255,255,0.04) inset',
    '0 1px 0   rgba(255,255,255,0.07) inset',
    '0 2px 4px  rgba(0,0,0,0.3)',
    '0 10px 28px rgba(0,0,0,0.22)',
    '0 24px 56px rgba(0,0,0,0.12)',
  ].join(', '),
};

// Bento span pattern for 5 values across 4 columns:
// Row 1: [Val0: 2col] [Val1: 2col]
// Row 2: [Val2: 1col] [Val3: 1col] [Val4: 2col]
const spanClass = [
  'sm:col-span-2 md:col-span-2', // 0 — wide
  'sm:col-span-2 md:col-span-2', // 1 — wide
  'sm:col-span-1 md:col-span-1', // 2
  'sm:col-span-1 md:col-span-1', // 3
  'sm:col-span-2 md:col-span-2', // 4 — wide
];

const isFeatured = [true, true, false, false, true];

export default function Values() {
  return (
    <section id="values" className="section relative overflow-hidden">
      <motion.div
        className="blob absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, var(--accent-2) 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container relative z-10">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono opacity-40 mr-2">05 —</span><ScrambleText text="Values" />
        </motion.p>

        <motion.h2
          className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-[var(--text)] mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          大切にしていること
        </motion.h2>

        {/* ── Bento grid (4-col on md+) ─────────────────────────
            Row 1: [Val0 ×2] [Val1 ×1] [Val2 ×1]
            Row 2: [Val3 ×1] [Val4 ×2] [Val5 ×1]
        ──────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-3"
          style={{ gridAutoRows: 'minmax(160px, auto)' }}
        >
          {profile.values.map((v, i) => (
            <motion.div
              key={v.title}
              className={spanClass[i]}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                delay: i * 0.07,
              }}
            >
              <TiltCard maxTilt={isFeatured[i] ? 4 : 6} className="h-full">
                <div
                  className="relative p-6 flex flex-col h-full overflow-hidden group cursor-default card-shine"
                  style={clay}
                >
                  {/* Symbol — larger on featured cards */}
                  <div
                    className={`mb-4 transition-transform duration-300 group-hover:scale-110 ${
                      isFeatured[i] ? 'text-5xl' : 'text-3xl'
                    }`}
                    style={{ color: v.accent }}
                  >
                    {v.symbol}
                  </div>

                  <h3
                    className={`font-display font-bold text-[var(--text)] mb-1 ${
                      isFeatured[i] ? 'text-xl' : 'text-base'
                    }`}
                  >
                    {v.title}
                  </h3>

                  {'sub' in v && (
                    <p className="font-mono text-[10px] tracking-wide mb-3 break-keep" style={{ color: v.accent, opacity: 0.8 }}>
                      {(v as typeof v & { sub: string }).sub}
                    </p>
                  )}

                  <p
                    className={`text-[var(--muted)] leading-relaxed ${
                      isFeatured[i] ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    {v.text}
                  </p>

                  {/* Subtle accent glow */}
                  <div
                    className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
                    style={{ background: v.accent, filter: 'blur(32px)', opacity: 0.07 }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
