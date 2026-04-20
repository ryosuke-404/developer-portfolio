'use client';

/**
 * ParallaxScene — Hero 背景の3層奥行きシーン。
 * 遠景には blur(2px) の被写界深度ブラーを適用し、
 * 各層の動き幅を大きくすることでより劇的な奥行きを演出する。
 */

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function ParallaxScene() {
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      nx.set((e.clientX / window.innerWidth  - 0.5) * 2);
      ny.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [nx, ny]);

  // ── Layer 1: 遠景 — blur(2px) で焦点外れ、動き最小 ───
  const d1x = useSpring(useTransform(nx, [-1, 1], [-8,   8]),  { stiffness: 18, damping: 18 });
  const d1y = useSpring(useTransform(ny, [-1, 1], [-5,   5]),  { stiffness: 18, damping: 18 });

  // ── Layer 2: 中景 — blur なし、中程度 ────────────────
  const d2x = useSpring(useTransform(nx, [-1, 1], [22, -22]),  { stiffness: 40, damping: 20 });
  const d2y = useSpring(useTransform(ny, [-1, 1], [13, -13]),  { stiffness: 40, damping: 20 });

  // ── Layer 3: 近景 — 最も速く、シャープ ──────────────
  const d3x = useSpring(useTransform(nx, [-1, 1], [-38, 38]),  { stiffness: 70, damping: 22 });
  const d3y = useSpring(useTransform(ny, [-1, 1], [-24, 24]),  { stiffness: 70, damping: 22 });

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ══ L1: 遠景 — blur(2px) 被写界深度 ════════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ x: d1x, y: d1y, filter: 'blur(2px)' }}
      >
        {/* 大リング */}
        <motion.div
          className="absolute"
          style={{
            top: '10%', right: '6%',
            width: 380, height: 380,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        />
        {/* 内側リング */}
        <motion.div
          className="absolute"
          style={{
            top: 'calc(10% + 95px)', right: 'calc(6% + 95px)',
            width: 190, height: 190,
            borderRadius: '50%',
            border: '1px solid rgba(79,140,98,0.06)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
        />
        {/* 遠景グロー */}
        <div
          className="absolute"
          style={{
            bottom: '20%', left: '2%',
            width: 260, height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,126,200,0.12) 0%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* ══ L2: 中景 — blur なし ════════════════════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ x: d2x, y: d2y }}
      >
        {/* ドットグリッド (4×4) */}
        <motion.div
          className="absolute"
          style={{
            top: '20%', left: '10%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3, height: 3,
                borderRadius: '50%',
                background: 'rgba(109,184,154,0.35)',
                opacity: 0.9 - (i % 4) * 0.16,
              }}
            />
          ))}
        </motion.div>

        {/* ソフトグロー */}
        <motion.div
          className="absolute"
          style={{
            bottom: '16%', left: '4%',
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,126,200,0.1) 0%, transparent 65%)',
          }}
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ══ L3: 近景 — 最前景、シャープ ════════════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ x: d3x, y: d3y }}
      >
        {/* クロス */}
        <div className="absolute" style={{ top: '42%', left: '47%' }}>
          <div style={{ position: 'relative', width: 22, height: 22 }}>
            <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(79,140,98,0.3)', transform: 'translateY(-50%)' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(79,140,98,0.3)', transform: 'translateX(-50%)' }} />
          </div>
        </div>

        {/* ダイヤモンドアウトライン */}
        <motion.div
          className="absolute"
          style={{
            bottom: '26%', right: '17%',
            width: 60, height: 60,
            border: '1px solid rgba(139,126,200,0.14)',
          }}
          animate={{ rotate: [45, 90, 45] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* アクセントドット */}
        <div
          className="absolute rounded-full"
          style={{
            top: '60%', right: '34%',
            width: 5, height: 5,
            background: 'rgba(79,140,98,0.5)',
            boxShadow: '0 0 8px rgba(79,140,98,0.4)',
          }}
        />

        {/* セージ小円 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '58%', right: '33%',
            width: 88, height: 88,
            border: '1px solid rgba(109,184,154,0.08)',
          }}
        />
      </motion.div>
    </div>
  );
}
