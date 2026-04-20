'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrambleText from '@/components/ScrambleText';

const links = [
  { label: 'About',      href: '#about'      },
  { label: 'Works',      href: '#works'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Experience', href: '#experience' },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

export default function Nav() {
  const [visible, setVisible]   = useState(false);
  const [open, setOpen]         = useState(false);
  const sectionIds = [...links.map((l) => l.href.replace('#', '')), 'contact'];
  const active = useActiveSection(sectionIds);

  // ピルはスクロール後に現れる
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop: floating pill ── */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            key="pill-nav"
            className="fixed top-5 left-1/2 z-[999] hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
            style={{
              background:    'rgba(12,12,15,0.75)',
              backdropFilter: 'blur(18px)',
              border:        '1px solid rgba(255,255,255,0.08)',
              boxShadow:     '0 8px 32px rgba(0,0,0,0.4)',
              x: '-50%',
            }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo dot */}
            <a
              href="#"
              className="font-display font-bold text-sm px-3 py-1.5 rounded-full no-underline"
              style={{ color: 'var(--text)' }}
            >
              YR<span style={{ color: 'var(--accent)' }}>.</span>
            </a>

            <span className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {links.map((l) => {
              const id       = l.href.replace('#', '');
              const isActive = active === id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative px-3.5 py-1.5 rounded-full text-sm no-underline transition-colors duration-200 z-10"
                  style={{ color: isActive ? '#0c0c0f' : 'var(--muted)' }}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="pill-active"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">
                    <ScrambleText text={l.label} framesPerChar={4} />
                  </span>
                </a>
              );
            })}

            <span className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

            <a
              href="#contact"
              className="relative font-mono text-xs tracking-widest uppercase px-3.5 py-1.5 rounded-full transition-colors duration-200"
              style={{
                color:      active === 'contact' ? '#0c0c0f' : 'var(--accent)',
                background: active === 'contact' ? 'var(--accent)' : 'transparent',
                border:     '1px solid rgba(79,140,98,0.3)',
              }}
            >
              {active === 'contact' && (
                <motion.span
                  layoutId="pill-active"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">Contact</span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Desktop: top logo (before pill appears) ── */}
      <AnimatePresence>
        {!visible && (
          <motion.div
            key="top-logo"
            className="fixed top-6 left-8 z-[999] hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href="#"
              className="font-display font-bold text-lg tracking-tight no-underline"
              style={{ color: 'var(--text)' }}
            >
              YR<span style={{ color: 'var(--accent)' }}>.</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile: hamburger (always visible) ── */}
      <div className="fixed top-5 right-5 z-[999] flex md:hidden">
        <button
          className="flex flex-col gap-1.5 p-2 rounded-full"
          style={{
            background:    'rgba(12,12,15,0.75)',
            backdropFilter: 'blur(12px)',
            border:        '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-px"
            style={{ background: 'var(--text)' }}
            animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px"
            style={{ background: 'var(--text)' }}
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-5 h-px"
            style={{ background: 'var(--text)' }}
            animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[900] flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(12,12,15,0.97)', backdropFilter: 'blur(16px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="font-display font-bold text-4xl no-underline"
                style={{ color: 'var(--text)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0         }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
