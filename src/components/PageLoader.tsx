'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { profile } from '@/data/profile';

const HOLD_MS  = 2400; // ms before exit starts
const COUNT_MS = 1800; // counter reaches 100 at this point

function Counter({ running }: { running: boolean }) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const step = (ts: number) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / COUNT_MS, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * 100));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [running]);

  return (
    <span className="tabular-nums">{String(value).padStart(3, '0')}</span>
  );
}

export default function PageLoader() {
  const [visible, setVisible]   = useState(true);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Start counter immediately
    const t0 = setTimeout(() => setCounting(true), 80);

    // Exit after hold
    const t1 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, HOLD_MS);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] overflow-hidden"
          style={{ background: 'var(--bg)' }}
        >
          {/* ── Top panel (exits upward) ── */}
          <motion.div
            className="absolute inset-x-0 top-0 bottom-1/2 flex flex-col items-center justify-end pb-5"
            exit={{
              y: '-100%',
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.05 },
            }}
            style={{ background: 'var(--bg)' }}
          >
            {/* Name — first line */}
            <div
              className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[0.88] select-none overflow-hidden"
              style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
            >
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {profile.nameLines[0].toUpperCase()}
              </motion.div>
            </div>
          </motion.div>

          {/* ── Bottom panel (exits downward) ── */}
          <motion.div
            className="absolute inset-x-0 top-1/2 bottom-0 flex flex-col items-center justify-start pt-5"
            exit={{
              y: '100%',
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.05 },
            }}
            style={{ background: 'var(--bg)' }}
          >
            {/* Name — second line */}
            <div
              className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[0.88] select-none overflow-hidden"
              style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
            >
              <motion.div
                initial={{ y: '-105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {profile.nameLines[1].toUpperCase()}
                <motion.span
                  style={{ color: 'var(--accent)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  .
                </motion.span>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Center divider line (exits with bottom panel) ── */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: 'rgba(255,255,255,0.08)', translateY: '-0.5px' }}
            exit={{
              y: '100%',
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.05 },
            }}
          />

          {/* ── Counter — bottom-left ── */}
          <motion.div
            className="absolute bottom-9 left-10 font-mono text-[11px] tracking-[0.3em] text-[var(--muted)] flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            <Counter running={counting} />
            <span className="opacity-30">%</span>
          </motion.div>

          {/* ── Role — bottom-right ── */}
          <motion.p
            className="absolute bottom-9 right-10 font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            {profile.role}
          </motion.p>

          {/* ── Progress bar — very bottom ── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              className="h-full origin-left"
              style={{ background: 'var(--accent)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: COUNT_MS / 1000,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
