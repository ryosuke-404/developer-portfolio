'use client';

/**
 * Contact — フルスクリーン CTA セクション。
 * 巨大見出し + クリックでクリップボードコピーのメールアドレスが主役。
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { profile } from '@/data/profile';
import RevealText from '@/components/RevealText';
import ScrambleText from '@/components/ScrambleText';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard API not available — silently ignore
    }
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Ambient glow */}
      <motion.div
        className="blob absolute -bottom-60 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.09]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary accent */}
      <motion.div
        className="blob absolute top-20 -right-40 w-[400px] h-[400px] opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, var(--accent-2) 0%, transparent 65%)' }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Section label */}
      <div className="container relative z-10 pt-16 pb-0">
        <p className="section-label">
          <span className="font-mono opacity-40 mr-2">06 —</span><ScrambleText text="Contact" />
        </p>
      </div>

      {/* ── Main content — vertically centred ── */}
      <div className="flex-1 flex items-center">
        <div className="container relative z-10">

          {/* Huge heading */}
          <div className="mb-14 md:mb-16">
            <RevealText
              lines={['一緒に、', '面白いものを', '作りませんか？']}
              lineClassName="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.1] text-[clamp(2rem,9.5vw,8.5rem)]"
              delay={0.1}
              stagger={0.11}
            />
          </div>

          {/* ── Large email — click to copy ── */}
          <motion.button
            onClick={handleCopyEmail}
            className="group relative inline-flex items-center gap-4 mb-14 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            data-hover
          >
            {/* Email text */}
            <span
              className="font-mono text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300 text-left"
              style={{ fontSize: 'clamp(1rem, 2.8vw, 1.75rem)' }}
            >
              {profile.contact.email}
            </span>

            {/* Copy badge — animates between two states */}
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent)] px-3 py-1 rounded-full border border-[var(--accent)] shrink-0"
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.85 }}
                  transition={{ duration: 0.22 }}
                >
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--muted)] px-3 py-1 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors duration-300 shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  Copy
                </motion.span>
              )}
            </AnimatePresence>

            {/* Animated underline */}
            <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-[calc(100%-6rem)] bg-[var(--accent)] transition-all duration-500 ease-out" />
          </motion.button>

          {/* ── Social links ── */}
          <motion.div
            className="flex flex-wrap gap-x-8 gap-y-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {profile.contact.links.map((link) =>
              link.active ? (
                <a
                  key={link.label}
                  href={link.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors duration-200 group"
                >
                  <span>{link.label}</span>
                  <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 inline-block">↗</span>
                </a>
              ) : (
                <span
                  key={link.label}
                  className="font-mono text-sm flex items-center gap-1.5 opacity-25 cursor-not-allowed"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-current" style={{ fontSize: '8px' }}>準備中</span>
                </span>
              )
            )}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
