'use client';

import { MotionConfig } from 'motion/react';

/**
 * OS の「視差効果を減らす」設定を motion アニメーション全体に反映する。
 * reducedMotion="user" → prefers-reduced-motion: reduce のとき自動で
 * duration / delay を 0 に近づけ、変位アニメーションを最小化する。
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
