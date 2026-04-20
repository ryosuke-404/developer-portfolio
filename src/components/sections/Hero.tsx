'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'motion/react';
import { profile } from '@/data/profile';
import MagneticButton from '@/components/MagneticButton';
import ParallaxScene from '@/components/ParallaxScene';

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

/* ── スクランブル→解決するヒーロー名 ────────────────────── */
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function rnd(_c?: string) { return LATIN[Math.floor(Math.random() * LATIN.length)]; }

function HeroName({ text, delay }: { text: string; delay: number }) {
  const [display, setDisplay] = useState<string[]>(() => text.split(''));
  const [resolved, setResolved] = useState(text.length);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResolved(0);
      setDisplay(text.split('').map(rnd));
      let frame = 0;
      const framesPerChar = 7;
      const total = text.length * framesPerChar;
      const step = () => {
        frame++;
        const r = Math.floor(frame / framesPerChar);
        setResolved(r);
        setDisplay(text.split('').map((c, i) => i < r ? c : rnd(c)));
        if (frame < total) rafRef.current = requestAnimationFrame(step);
        else { setDisplay(text.split('')); setResolved(text.length); }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, delay]);

  return (
    <motion.span
      className="inline-block whitespace-nowrap"
      initial={{ y: '105%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      transition={{ duration: 0.75, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      aria-label={text}
    >
      {display.map((char, i) => (
        <span key={i} className="inline-block" style={{ color: i < resolved ? undefined : 'rgba(240,236,228,0.3)' }}>
          {char}
        </span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      <HeroScene />

      {/* Background ghost text — depth layer */}
      <div
        className="absolute inset-0 flex items-end overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          className="font-display font-extrabold leading-none text-outline w-full"
          style={{
            fontSize: 'clamp(8rem, 22vw, 20rem)',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
            color: 'transparent',
            paddingBottom: '0',
            letterSpacing: '-0.02em',
            opacity: fadeOut,
          }}
        >
          CREATIVE
        </motion.div>
      </div>

      {/* Blobs */}
      <motion.div className="blob absolute -top-20 -left-40 w-[600px] h-[600px] opacity-[0.15]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div className="absolute inset-0" style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '5%']) }}>
        <ParallaxScene />
      </motion.div>

      {/* Content */}
      <motion.div
        className="container relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-0 pt-28 pb-20"
        style={{ opacity: fadeOut }}
      >
        {/* ── Left ── */}
        <motion.div className="flex-1 min-w-0 w-full" style={{ y: textY }}>

          {/* Label */}
          <motion.p
            className="section-label mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            こんにちは — Hello
          </motion.p>

          {/* Name — fills the column */}
          <h1
            className="font-display font-extrabold tracking-tight leading-[0.85] mb-8"
            style={{ fontSize: 'clamp(1.75rem, 8vw, 6.5rem)', color: 'var(--text)' }}
          >
            <div className="overflow-hidden">
              <HeroName text={profile.nameLines[0].toUpperCase()} delay={300} />
            </div>
            <div className="overflow-hidden">
              <HeroName text={profile.nameLines[1].toUpperCase()} delay={550} />
            </div>
          </h1>

          {/* Divider */}
          <motion.div
            className="w-16 h-px bg-[var(--accent)] mb-6 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          />

          {/* Role + tagline row */}
          <motion.div
            className="flex flex-col gap-1 mb-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <p className="font-mono text-sm tracking-widest text-[var(--muted)] uppercase">
              {profile.role}
            </p>
            <p className="font-mono text-xs text-[var(--accent)] italic">
              {profile.tagline}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3 mb-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <MagneticButton>
              <a href="#works" className="btn btn-primary">Works を見る</a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact" className="btn btn-ghost">連絡する</a>
            </MagneticButton>
          </motion.div>

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.25 }}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: '#6db89a' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#6db89a' }} />
            </span>
            <span className="font-mono text-[11px] text-[var(--muted)] tracking-wide">
              {profile.now.available ? '仕事受付中' : '準備中'}
            </span>
            <span className="w-px h-3 bg-[var(--border)]" />
            <span className="font-mono text-[11px] text-[var(--muted)]">
              📍 {profile.now.location}
            </span>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Bottom rule */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      />
    </section>
  );
}
