'use client';

/**
 * CustomCursor — コンテキストに応じてモーフするカーソル。
 *   default : 8px ドット + 30px リング (mix-blend-difference)
 *   link    : ドット消滅 → リング 46px に拡大 + アクセントカラー
 *   view    : 88px フィルサークル + "VIEW" テキスト (スプリング追従)
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

type CursorType = 'default' | 'link' | 'view';

export default function CustomCursor() {
  const [type, setType] = useState<CursorType>('default');
  const [visible, setVisible] = useState(false);

  // ── 座標 MotionValue ──────────────────────────────────────────────
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // リング: 少し遅れてついてくる
  const ringX = useSpring(rawX, { damping: 22, stiffness: 260 });
  const ringY = useSpring(rawY, { damping: 22, stiffness: 260 });

  // ビューカーソル: もっとゆっくり追従 (重厚感)
  const viewX = useSpring(rawX, { damping: 30, stiffness: 110 });
  const viewY = useSpring(rawY, { damping: 30, stiffness: 110 });

  useEffect(() => {
    // タッチデバイス or reduced-motion では無効
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);

      // ── カーソル種別を判定 ────────────────────────────────────────
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el?.closest('[data-cursor="view"]')) {
        setType('view');
      } else if (el?.closest('a, button, [role="button"], .btn, input, textarea, [data-hover]')) {
        setType('link');
      } else {
        setType('default');
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [rawX, rawY, visible]);

  const isView = type === 'view';
  const isLink = type === 'link';

  return (
    <>
      {/* ── ドット (default のみ) ── */}
      <motion.div
        className="fixed z-[9999] pointer-events-none mix-blend-difference rounded-full bg-white"
        style={{ x: rawX, y: rawY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isView || isLink ? 0 : 8,
          height: isView || isLink ? 0 : 8,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18 }}
      />

      {/* ── リング (default + link) ── */}
      <motion.div
        className="fixed z-[9998] pointer-events-none mix-blend-difference rounded-full border border-white"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isView ? 0 : isLink ? 46 : 30,
          height: isView ? 0 : isLink ? 46 : 30,
          opacity: isView ? 0 : visible ? (isLink ? 1 : 0.65) : 0,
          borderColor: isLink ? '#4f8c62' : '#ffffff',
        }}
        transition={{ duration: 0.22 }}
      />

      {/* ── ビューカーソル ── */}
      <AnimatePresence>
        {visible && isView && (
          <motion.div
            key="view-cursor"
            className="fixed z-[9999] pointer-events-none rounded-full flex items-center justify-center"
            style={{
              x: viewX,
              y: viewY,
              translateX: '-50%',
              translateY: '-50%',
              width: 88,
              height: 88,
              background: 'rgba(240,236,228,0.95)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.28em] uppercase font-bold select-none"
              style={{ color: '#0c0c0f' }}
            >
              VIEW
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
