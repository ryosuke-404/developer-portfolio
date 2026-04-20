'use client';

/**
 * RevealText — ライン単位マスクリビール。
 * 各行を overflow:hidden でくるみ、テキストが壁の裏から滑り出すアニメーション。
 */

import { motion } from 'motion/react';

interface Props {
  lines: string[];
  /** 各行に適用する className (font size / weight など) */
  lineClassName?: string;
  /** whileInView 開始の遅延 (s) */
  delay?: number;
  /** 行間のスタガー (s) */
  stagger?: number;
  /** viewport margin */
  margin?: string;
}

export default function RevealText({
  lines,
  lineClassName = '',
  delay = 0,
  stagger = 0.07,
  margin = '-60px',
}: Props) {
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden leading-[1.15]">
          <motion.div
            className={lineClassName}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </>
  );
}
