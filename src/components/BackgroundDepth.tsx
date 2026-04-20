'use client';

/**
 * BackgroundDepth — ページ全体に敷く固定3層奥行きシーン。
 * スクロールに連動して各レイヤーが異なる速度で動き、
 * セクションをまたいでも一貫した「空間の中を進む」感覚を生む。
 *
 * z-index: 0 (sections の z-index: 1 より後ろ)
 * pointer-events: none
 */

import { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

export default function BackgroundDepth() {
  const { scrollYProgress } = useScroll();

  // ── スクロール視差 (3層) ────────────────────────────────
  // 遠景: ほぼ動かない = 遠くにあるように見える
  const farY  = useTransform(scrollYProgress, [0, 1], ['0vh',  '6vh']);
  // 中景
  const midY  = useTransform(scrollYProgress, [0, 1], ['0vh', '16vh']);
  // 近景: 最も速い
  const nearY = useTransform(scrollYProgress, [0, 1], ['0vh', '30vh']);

  // ── マウス視差 (中景・近景のみ) ─────────────────────────
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const midMx  = useSpring(useTransform(mx, [-1, 1], [-14, 14]),  { stiffness: 30, damping: 22 });
  const midMy  = useSpring(useTransform(my, [-1, 1], [-8,   8]),  { stiffness: 30, damping: 22 });
  const nearMx = useSpring(useTransform(mx, [-1, 1], [-28, 28]),  { stiffness: 55, damping: 24 });
  const nearMy = useSpring(useTransform(my, [-1, 1], [-16, 16]),  { stiffness: 55, damping: 24 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ══ Layer 1: 遠景 ══════════════════════════════════
          blur(2px) で焦点が合っていない感。ほぼ動かない。        */}
      <motion.div className="absolute inset-0" style={{ y: farY, filter: 'blur(2px)' }}>
        {/* 大きな回転リング */}
        <div
          className="absolute rounded-full"
          style={{
            top: '5%', left: '60%',
            width: 560, height: 560,
            border: '1px solid rgba(255,255,255,0.025)',
          }}
        />
        {/* 内側リング */}
        <div
          className="absolute rounded-full"
          style={{
            top: 'calc(5% + 120px)', left: 'calc(60% + 120px)',
            width: 320, height: 320,
            border: '1px solid rgba(79,140,98,0.04)',
          }}
        />
        {/* 遠景グロー — アクセント */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '15%', left: '5%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(139,126,200,0.06) 0%, transparent 65%)',
          }}
        />
        {/* 遠景グロー — アクセント2 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '40%', right: '2%',
            width: 360, height: 360,
            background: 'radial-gradient(circle, rgba(79,140,98,0.05) 0%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* ══ Layer 2: 中景 ══════════════════════════════════
          blur なし、中程度の動き。                              */}
      <motion.div
        className="absolute inset-0"
        style={{ y: midY, x: midMx, translateY: midMy }}
      >
        {/* ドットグリッド */}
        <div
          className="absolute"
          style={{
            top: '25%', left: '8%',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 14,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 2.5, height: 2.5,
                borderRadius: '50%',
                background: 'rgba(109,184,154,0.25)',
                opacity: 0.9 - (i % 5) * 0.14,
              }}
            />
          ))}
        </div>

        {/* ダイヤモンドアウトライン */}
        <div
          className="absolute"
          style={{
            top: '65%', right: '12%',
            width: 72, height: 72,
            border: '1px solid rgba(139,126,200,0.1)',
            transform: 'rotate(45deg)',
          }}
        />

        {/* 中景グロー */}
        <div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '45%',
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(79,140,98,0.07) 0%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* ══ Layer 3: 近景 ══════════════════════════════════
          最も速く動く。シャープ。前景に浮いている感。           */}
      <motion.div
        className="absolute inset-0"
        style={{ y: nearY, x: nearMx, translateY: nearMy }}
      >
        {/* クロス */}
        <div className="absolute" style={{ top: '30%', left: '52%' }}>
          <div style={{ position: 'relative', width: 20, height: 20 }}>
            <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(79,140,98,0.25)', transform: 'translateY(-50%)' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(79,140,98,0.25)', transform: 'translateX(-50%)' }} />
          </div>
        </div>

        {/* 小円 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '72%', left: '30%',
            width: 6, height: 6,
            background: 'rgba(139,126,200,0.35)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '18%', right: '28%',
            width: 4, height: 4,
            background: 'rgba(79,140,98,0.4)',
          }}
        />

        {/* 近景リング — 小 */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '30%', left: '18%',
            width: 90, height: 90,
            border: '1px solid rgba(79,140,98,0.08)',
          }}
        />
      </motion.div>
    </div>
  );
}
