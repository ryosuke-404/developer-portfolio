'use client';

import { useRef } from 'react';
import { motion, useAnimationFrame } from 'motion/react';
import { profile } from '@/data/profile';
import TiltCard from '@/components/TiltCard';
import ScrambleText from '@/components/ScrambleText';

type Level = 'advanced' | 'intermediate' | 'beginner';

const LEVEL_LABEL: Record<Level, string> = {
  advanced:     '上級',
  intermediate: '中級',
  beginner:     '初級',
};
const LEVEL_COLOR: Record<Level, string> = {
  advanced:     'var(--accent)',
  intermediate: 'var(--accent-2)',
  beginner:     'var(--muted)',
};

/* ── Card base styles ─────────────────────────────────────── */
const clay: React.CSSProperties = {
  borderRadius: '1.25rem',
  background: 'linear-gradient(145deg, #1e1e2a 0%, #14141c 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: [
    '0 0 0 1px rgba(255,255,255,0.04) inset',
    '0 1px 0   rgba(255,255,255,0.07) inset',
    '0 2px 4px  rgba(0,0,0,0.3)',
    '0 10px 28px rgba(0,0,0,0.22)',
  ].join(', '),
};

/* ── Entrance wrapper ─────────────────────────────────────── */
function Cell({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── 4-Layer architecture card ────────────────────────────── */
function LayersCard() {
  return (
    <TiltCard maxTilt={4} className="h-full">
      <div className="p-6 h-full flex flex-col gap-4 card-shine" style={clay}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <p className="font-mono text-[10px] tracking-widest text-[var(--accent)] uppercase">Architecture</p>
        </div>
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {profile.skills.layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: layer.color, boxShadow: `0 0 6px ${layer.color}` }} />
                <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: layer.color }}>
                  {layer.labelJa}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pl-3.5">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] px-2.5 py-0.5 rounded-full"
                    style={{
                      color:       layer.color,
                      background:  layer.color + '14',
                      border:      `1px solid ${layer.color}28`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

/* ── Categorized skills with level indicators ─────────────── */
function CategoriesCard() {
  return (
    <TiltCard maxTilt={4} className="h-full">
      <div className="p-6 h-full flex flex-col gap-4 card-shine" style={clay}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-2)]" />
            <p className="font-mono text-[10px] tracking-widest text-[var(--accent-2)] uppercase">Skills</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3">
            {(['advanced', 'intermediate', 'beginner'] as Level[]).map((l) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: LEVEL_COLOR[l] }} />
                <span className="font-mono text-[8px] text-[var(--muted)]">{LEVEL_LABEL[l]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1 content-start">
          {profile.skills.categories.map((cat) => (
            <div key={cat.label}>
              <p className="font-mono text-[9px] tracking-widest text-[var(--muted)] uppercase mb-1.5">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-1">
                {cat.items.map((item) => (
                  <span
                    key={item.name}
                    className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{
                      color:      LEVEL_COLOR[item.level],
                      background: LEVEL_COLOR[item.level] + '16',
                      border:     `1px solid ${LEVEL_COLOR[item.level]}28`,
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

/* ── Auto-scroll tools ticker ─────────────────────────────── */
function ToolsTicker() {
  const items = [...profile.skills.tools, ...profile.skills.tools];
  const ref   = useRef<HTMLDivElement>(null);
  const x     = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!ref.current) return;
    x.current -= delta * 0.04;
    const half = ref.current.scrollWidth / 2;
    if (Math.abs(x.current) >= half) x.current = 0;
    ref.current.style.transform = `translateX(${x.current}px)`;
  });

  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex gap-3 w-max">
        {items.map((t, i) => (
          <span
            key={i}
            className="text-[11px] px-3.5 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] whitespace-nowrap shrink-0"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function Skills() {
  return (
    <section id="skills" className="section relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 50%, var(--bg) 100%)',
      }} />

      <div className="container relative z-10">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono opacity-40 mr-2">03 —</span><ScrambleText text="Skills" />
        </motion.p>

        <motion.h2
          className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-[var(--text)] mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          できること
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoRows: 'minmax(130px,auto)' }}>

          {/* ① Featured hero card */}
          <Cell className="sm:col-span-2 md:col-span-2 md:row-span-2" delay={0}>
            <TiltCard maxTilt={5} className="h-full">
              <div className="relative p-7 flex flex-col justify-between h-full overflow-hidden bento-spin-border card-shine" style={{ borderRadius: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.3),0 10px 28px rgba(0,0,0,0.22)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <p className="font-mono text-[10px] tracking-widest text-[var(--accent)] uppercase">what I do</p>
                  </div>
                  <p className="font-display font-semibold text-[clamp(1.15rem,2.6vw,1.6rem)] text-[var(--text)] leading-snug">
                    {profile.skills.featured}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap mt-6">
                  {['Interface', 'Intelligence', 'Edge & Trust'].map((label, i) => (
                    <span key={label} className="text-[11px] px-3 py-1 rounded-full" style={{
                      background: ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)'][i] + '22',
                      color:      ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)'][i],
                      border:     `1px solid ${['var(--accent)', 'var(--accent-2)', 'var(--accent-3)'][i]}44`,
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'var(--accent)', filter: 'blur(48px)', opacity: 0.07 }} />
              </div>
            </TiltCard>
          </Cell>

          {/* ② Open to Work */}
          <Cell delay={0.06}>
            <div className="relative p-5 flex flex-col justify-between h-full overflow-hidden card-shine" style={clay}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#6db89a' }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#6db89a' }} />
                </span>
                <span className="font-mono text-[9px] tracking-widest text-[var(--accent-3)] uppercase">Available</span>
              </div>
              <div>
                <p className="font-display font-extrabold text-[1.4rem] leading-tight text-[var(--text)]">Open<br/>to Work</p>
                <p className="font-mono text-[9px] text-[var(--muted)] mt-1">📍 Osaka, Japan</p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: 'var(--accent-3)', filter: 'blur(28px)', opacity: 0.1 }} />
            </div>
          </Cell>

          {/* ③ Stat: Years */}
          <Cell delay={0.10}>
            <div className="relative p-5 flex flex-col justify-between h-full overflow-hidden card-shine" style={clay}>
              <p className="font-display font-extrabold text-[clamp(2.4rem,5vw,3.2rem)] leading-none" style={{ color: 'var(--accent)' }}>
                {profile.skills.stats[0].value}
              </p>
              <p className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase mt-2">
                {profile.skills.stats[0].label}
              </p>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: 'var(--accent)', filter: 'blur(28px)', opacity: 0.08 }} />
            </div>
          </Cell>

          {/* ④ Stat: Projects */}
          <Cell delay={0.13}>
            <div className="relative p-5 flex flex-col justify-between h-full overflow-hidden card-shine" style={clay}>
              <p className="font-display font-extrabold text-[clamp(2.4rem,5vw,3.2rem)] leading-none" style={{ color: 'var(--accent-2)' }}>
                {profile.skills.stats[1].value}
              </p>
              <p className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase mt-2">
                {profile.skills.stats[1].label}
              </p>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: 'var(--accent-2)', filter: 'blur(28px)', opacity: 0.08 }} />
            </div>
          </Cell>

          {/* ⑤ Philosophy */}
          <Cell delay={0.16}>
            <div className="relative p-5 flex flex-col justify-center h-full overflow-hidden card-shine" style={clay}>
              <p className="font-mono text-[10px] text-[var(--muted)] leading-relaxed">
                &quot;コードは詩。<br/>余白も設計する。&quot;
              </p>
              <div className="w-6 h-px mt-3" style={{ background: 'var(--accent-2)' }} />
            </div>
          </Cell>

          {/* ⑥ 4-Layer architecture */}
          <Cell className="sm:col-span-2 md:col-span-2" delay={0.18}>
            <LayersCard />
          </Cell>

          {/* ⑦ Categorized skills with level indicators */}
          <Cell className="sm:col-span-2 md:col-span-2" delay={0.22}>
            <CategoriesCard />
          </Cell>

          {/* ⑧ Tools ticker — full width */}
          <Cell className="sm:col-span-2 md:col-span-4" delay={0.26}>
            <div className="p-5 overflow-hidden card-shine" style={clay}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-3)]" />
                <p className="font-mono text-[10px] tracking-widest text-[var(--accent-3)] uppercase">Tools & Stack</p>
              </div>
              <ToolsTicker />
            </div>
          </Cell>
        </div>
      </div>
    </section>
  );
}
