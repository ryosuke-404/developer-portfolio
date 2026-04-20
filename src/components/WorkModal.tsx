'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { profile } from '@/data/profile';
import { lenisStop, lenisStart } from '@/components/SmoothScroll';

type Work = (typeof profile.works)[0];

interface Props {
  work: Work | null;
  onClose: () => void;
}

const AUTO_INTERVAL = 3500;

export default function WorkModal({ work, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prevWorkRef = useRef<Work | null>(null);

  if (work !== prevWorkRef.current) {
    prevWorkRef.current = work;
    if (work) {
      setImgIndex(0);
      setPaused(false);
    }
  }

  const images = work?.images?.length ? work.images : (work?.image ? [work.image] : []);
  const hasVideo = !!work?.video;
  const totalSlides = images.length + (hasVideo ? 1 : 0);
  const hasMultiple = totalSlides > 1;
  const isVideoSlide = hasVideo && imgIndex === images.length;

  useEffect(() => {
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setPaused(true); setImgIndex((p) => (p + 1) % totalSlides); }
      if (e.key === 'ArrowLeft')  { setPaused(true); setImgIndex((p) => (p - 1 + totalSlides) % totalSlides); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [work, onClose, totalSlides]);

  useEffect(() => {
    if (work) {
      lenisStop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisStart();
      document.body.style.overflow = '';
    }
    return () => {
      lenisStart();
      document.body.style.overflow = '';
    };
  }, [work]);

  // 自動スライド
  useEffect(() => {
    if (!work || !hasMultiple || paused) return;
    const id = setInterval(() => {
      setImgIndex((p) => (p + 1) % totalSlides);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [work, hasMultiple, paused, totalSlides]);

  function goTo(idx: number) {
    setImgIndex(idx);
    setPaused(true);
  }

  const currentSrc = !isVideoSlide ? images[imgIndex] : null;
  const isWhiteBg = currentSrc?.includes('4system') ?? false;

  return (
    <AnimatePresence>
      {work && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={work.title}
            className="fixed z-[1001] inset-4 md:inset-[5%] lg:inset-[8%] rounded-2xl overflow-hidden flex flex-col md:flex-row"
            style={{
              background: '#0f0f14',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 12  }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Left: visual ── */}
            <div className="relative w-full md:w-[52%] h-[42vh] md:h-auto shrink-0 overflow-hidden flex flex-col">
              {/* Main image area */}
              <div className="relative flex-1 overflow-hidden bg-[#0a0a0e]">
                {totalSlides > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imgIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {isVideoSlide ? (
                        <video
                          src={work.video!}
                          className="absolute inset-0 w-full h-full object-contain bg-[#0a0a0e]"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={images[imgIndex]}
                          alt={`${work.title} screenshot ${imgIndex + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 52vw"
                          className={`object-contain ${isWhiteBg ? 'bg-white' : 'bg-[#0a0a0e]'}`}
                          priority
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: `radial-gradient(circle at 50% 55%, ${work.accent}28 0%, #0c0c0f 70%)` }}
                  >
                    <div className="relative w-32 h-32">
                      <Image src={work.icon} alt={work.title} fill sizes="128px" className="object-contain drop-shadow-2xl" />
                    </div>
                  </div>
                )}

                {/* Prev/Next arrows */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={() => goTo((imgIndex - 1 + totalSlides) % totalSlides)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
                      aria-label="前の画像"
                    >
                      <span className="text-white text-xs">‹</span>
                    </button>
                    <button
                      onClick={() => goTo((imgIndex + 1) % totalSlides)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
                      aria-label="次の画像"
                    >
                      <span className="text-white text-xs">›</span>
                    </button>
                  </>
                )}

                {/* Accent overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(to right, transparent 55%, #0f0f14 100%)` }}
                />
                {/* Gradient bottom (mobile) */}
                <div
                  className="absolute inset-x-0 bottom-0 h-16 md:hidden pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, #0f0f14)' }}
                />
              </div>

              {/* Thumbnail strip */}
              {hasMultiple && (
                <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto shrink-0" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className="relative shrink-0 rounded-md overflow-hidden transition-all"
                      style={{
                        width: 44,
                        height: 44,
                        border: idx === imgIndex ? `2px solid ${work.accent}` : '2px solid rgba(255,255,255,0.08)',
                        opacity: idx === imgIndex ? 1 : 0.5,
                      }}
                    >
                      <Image src={src} alt={`thumb ${idx + 1}`} fill sizes="44px" className="object-cover" />
                    </button>
                  ))}
                  {hasVideo && (
                    <button
                      onClick={() => goTo(images.length)}
                      className="relative shrink-0 rounded-md overflow-hidden transition-all flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        border: isVideoSlide ? `2px solid ${work.accent}` : '2px solid rgba(255,255,255,0.08)',
                        opacity: isVideoSlide ? 1 : 0.5,
                        background: 'rgba(0,0,0,0.6)',
                      }}
                      aria-label="動画を見る"
                    >
                      <span className="text-white text-base leading-none">▶</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Right: content ── */}
            <div className="flex flex-col flex-1 p-5 md:p-12 overflow-y-auto min-h-0">

              {/* Close button */}
              <button
                onClick={onClose}
                className="self-end mb-3 md:mb-6 w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-label="閉じる"
              >
                <span className="text-[var(--muted)] text-sm leading-none">✕</span>
              </button>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                  <Image src={work.icon} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: work.accent }}>
                    {work.role}
                  </span>
                  <p className="font-mono text-[10px] text-[var(--muted)]">{work.year}</p>
                </div>
              </div>

              {/* Title */}
              <h2
                className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.05] mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {work.title}
              </h2>

              {/* Accent line */}
              <div className="w-10 h-px mb-6" style={{ background: work.accent }} />

              {/* Description */}
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 md:mb-8">
                {work.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6 md:mb-10">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-auto flex-wrap">
                {work.href ? (
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    サイトを見る
                  </a>
                ) : (
                  <span
                    className="btn text-sm py-2.5 px-6 opacity-30 cursor-not-allowed"
                    style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                  >
                    準備中
                  </span>
                )}
                {work.github && (
                  <a
                    href={work.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost text-sm py-2.5 px-6 flex items-center gap-2"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
