'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';
import { profile } from '@/data/profile';
import MagneticButton from '@/components/MagneticButton';
import ScrambleText from '@/components/ScrambleText';
import WorkModal from '@/components/WorkModal';

// 進捗ドット — hooks-in-loop を避けるためサブコンポーネント化
function ProgressDot({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const opacity = useTransform(progress, [i - 0.4, i, i + 0.4], [0.2, 1, 0.2]);
  const scale   = useTransform(progress, [i - 0.4, i, i + 0.4], [0.7, 1.3, 0.7]);
  return (
    <motion.div
      className="rounded-full"
      style={{ width: 6, height: 6, background: 'var(--accent)', opacity, scale }}
    />
  );
}

// 各パネル
function WorkPanel({
  work,
  i,
  vpw,
  onOpen,
}: {
  work: (typeof profile.works)[0];
  i: number;
  vpw: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 flex flex-col md:flex-row h-full"
      style={{ width: vpw || '100vw' }}
    >
      {/* ── 画像パネル (55%) ── */}
      <div
        data-cursor="view"
        onClick={onOpen}
        className="relative flex-shrink-0 w-full md:w-[55%] h-[38vh] md:h-full overflow-hidden cursor-pointer order-1 bg-[#0a0a0e]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {(work.images?.length ? work.images[0] : work.image) ? (
          <Image
            src={(work.images?.length ? work.images[0] : work.image) as string}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain bg-[#0a0a0e] scale-[1.0]"
            priority={i === 0}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 50% 55%, ${work.accent}30 0%, #0c0c0f 70%)`,
            }}
          >
            <motion.div
              className="relative w-40 h-40"
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ duration: 0.4 }}
            >
              <Image src={work.icon} alt={work.title} fill sizes="160px" className="object-contain drop-shadow-2xl" />
            </motion.div>
          </div>
        )}

        {/* Duotone カラーオーバーレイ — ホバー時に accent 色が浮かぶ */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: work.accent, mixBlendMode: 'color' }}
          animate={{ opacity: hovered ? 0.42 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* グラデーションオーバーレイ */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, transparent 70%, rgba(17,17,22,0.6) 100%)',
          }}
        />
      </div>

      {/* ── テキストパネル (45%) ── */}
      <div
        className="relative flex flex-col justify-start md:justify-center w-full md:w-[45%] px-6 md:px-14 py-6 md:py-0 order-2 overflow-y-auto min-h-0"
      >
        {/* 大きなインデックス番号（背景） */}
        <span
          className="absolute top-6 md:top-8 font-display font-extrabold select-none pointer-events-none leading-none opacity-[0.04]"
          style={{ fontSize: 'clamp(6rem, 18vw, 14rem)', color: 'var(--text)', right: 'auto' }}
          aria-hidden="true"
        >
          0{i + 1}
        </span>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
          className="relative z-10"
        >
          {/* メタ情報 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[var(--border)]">
              <Image src={work.icon} alt="" fill sizes="32px" className="object-cover" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: work.accent }}>
                {work.role}
              </span>
              <p className="font-mono text-[10px] text-[var(--muted)]">{work.year}</p>
            </div>
          </div>

          {/* タイトル */}
          <h3
            className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
          >
            {work.title}
          </h3>

          {/* アクセントライン */}
          <motion.div
            className="w-10 h-px mb-5 origin-left"
            style={{ background: work.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          {/* 説明 */}
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-sm">
            {work.description}
          </p>

          {/* タグ */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <MagneticButton>
            <button onClick={onOpen} className="btn btn-ghost text-sm py-2.5 px-5">
              詳細を見る →
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const N = profile.works.length;
  const [selectedWork, setSelectedWork] = useState<(typeof profile.works)[0] | null>(null);
  const closeModal = useCallback(() => setSelectedWork(null), []);

  // ビューポート幅をピクセルで取得（spring に px 単位が必要）
  const [vpw, setVpw] = useState(0);
  useEffect(() => {
    const update = () => setVpw(window.innerWidth);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 0→-(N-1)*vpw px でトラックをスライド
  // 両端に余裕を持たせ「着地」感を出す
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 0, -(N - 1) * vpw, -(N - 1) * vpw],
  );
  const x = useSpring(rawX, { stiffness: 55, damping: 26, restDelta: 0.5 });

  // 進捗: 0→N-1
  const progress = useTransform(scrollYProgress, [0, 1], [0, N - 1]);

  return (
    <section id="works">
      {/* コンテナ高さがスクロール量を決める */}
      <div ref={containerRef} style={{ height: `${(N + 1) * 100}vh`, position: 'relative' }}>
        {/* ── ピン固定ビューポート ── */}
        <div className="sticky top-0 h-screen overflow-hidden bg-[var(--bg)]">

          {/* ヘッダーバー */}
          <div
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-16 pt-8 pb-10"
            style={{ background: 'linear-gradient(to bottom, var(--bg) 40%, transparent 100%)' }}
          >
            <motion.p
              className="section-label mb-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="font-mono opacity-40 mr-2">04 —</span><ScrambleText text="Works" />
            </motion.p>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] mr-2">選りすぐりの作品</span>
              <div className="flex gap-2">
                {profile.works.map((_, i) => (
                  <ProgressDot key={i} progress={progress} i={i} />
                ))}
              </div>
            </div>
          </div>

          {/* ── 横スクロールトラック ── */}
          <motion.div
            className="flex h-full"
            style={{ x, width: `${N * 100}vw` }}
          >
            {profile.works.map((work, i) => (
              <WorkPanel key={work.id} work={work} i={i} vpw={vpw} onOpen={() => setSelectedWork(work)} />
            ))}
          </motion.div>

          {/* スクロールヒント (最初だけ表示) */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--muted)]">
              scroll
            </span>
            <motion.div
              className="w-8 h-px bg-[var(--accent)] origin-left"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      <WorkModal work={selectedWork} onClose={closeModal} />
    </section>
  );
}
