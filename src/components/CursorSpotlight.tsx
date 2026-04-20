'use client';

/**
 * CursorSpotlight — カーソル周辺だけが明るく、外縁が暗くなるスポットライト。
 * 「窓から覗いている」奥行き感を強調するフルページオーバーレイ。
 */

import { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';

export default function CursorSpotlight() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    // タッチデバイスでは無効（mousemove は発火しないが念のため）
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  const bg = useMotionTemplate`radial-gradient(
    circle 420px at ${x}px ${y}px,
    transparent 0%,
    transparent 140px,
    rgba(0,0,0,0.22) 420px
  )`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ background: bg, zIndex: 9994 }}
    />
  );
}
