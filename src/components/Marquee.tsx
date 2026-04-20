'use client';

import { motion } from 'motion/react';

interface MarqueeProps {
  items: string[];
  speed?: number;   // seconds for one full loop
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ items, speed = 28, reverse = false, className = '' }: MarqueeProps) {
  // Duplicate enough to fill width seamlessly
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden select-none ${className}`} aria-hidden="true">
      <motion.div
        className="inline-flex items-center gap-0 whitespace-nowrap"
        animate={{ x: reverse ? ['0%', '25%'] : ['0%', '-25%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="font-display font-bold text-[clamp(1rem,2vw,1.2rem)] tracking-wide text-[var(--text)] opacity-30 uppercase">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50 shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
