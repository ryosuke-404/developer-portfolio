'use client';

/**
 * TiltCard — マウス追従型 3D 傾きラッパー。
 * perspective + rotateX/Y + spring で「粘土が少し傾く」感触を出す。
 * Hero 写真と同じ機構をカードに適用できる汎用コンポーネント。
 */

import { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform, useReducedMotion } from 'motion/react';

interface Props {
  children: React.ReactNode;
  /** 最大傾き角度 (degrees). デフォルト 7 */
  maxTilt?: number;
  /** perspective 値 (px). デフォルト 900 */
  perspective?: number;
  className?: string;
}

export default function TiltCard({
  children,
  maxTilt = 7,
  perspective = 900,
  className = '',
}: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    { stiffness: 160, damping: 26 },
  );
  const rotateY = useSpring(
    useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    { stiffness: 160, damping: 26 },
  );

  // カード内 "光沢" の位置もマウスに追従
  const glowX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(rawY, [-0.5, 0.5], [0, 100]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduced) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - left) / width  - 0.5);
    rawY.set((e.clientY - top)  / height - 0.5);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div style={{ perspective: reduced ? undefined : perspective }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative w-full h-full"
      >
        {children}

        {/* 動的ハイライト — 傾きに合わせて移動する光 */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06) 0%, transparent 55%)`,
          }}
        />
      </motion.div>
    </div>
  );
}
