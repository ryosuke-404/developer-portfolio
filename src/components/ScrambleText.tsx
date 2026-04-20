'use client';

/**
 * ScrambleText — ホバー時に文字がランダムに入れ替わるアニメーション。
 * 英字は Latin、CJK は Katakana でスクランブルし、左から順に解決していく。
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const KANA  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ';

function randomChar(original: string): string {
  if (/[\u3000-\u9fff\u30a0-\u30ff\u3040-\u309f]/.test(original)) {
    return KANA[Math.floor(Math.random() * KANA.length)];
  }
  return LATIN[Math.floor(Math.random() * LATIN.length)];
}

interface Props {
  text: string;
  className?: string;
  /** 1文字あたりのスクランブルフレーム数。大きいほどゆっくり解決 */
  framesPerChar?: number;
  /** マウントから自動再生するまでの遅延(ms) */
  autoPlay?: number;
}

export default function ScrambleText({ text, className = '', framesPerChar = 5, autoPlay }: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef  = useRef<number | null>(null);
  const frameRef = useRef(0);

  const cancel = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const start = useCallback(() => {
    // OS が「視差効果を減らす」を設定している場合はスクランブルしない
    if (reduced) return;
    cancel();
    frameRef.current = 0;
    const totalFrames = text.length * framesPerChar;

    const step = () => {
      const f = frameRef.current;
      const resolvedUpTo = Math.floor(f / framesPerChar);

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ' || char === '　') return char;
            if (i < resolvedUpTo) return char;
            return randomChar(char);
          })
          .join(''),
      );

      frameRef.current += 1;
      if (f < totalFrames) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, framesPerChar, reduced]);

  const reset = useCallback(() => {
    cancel();
    setDisplay(text);
  }, [text]);

  // テキストが変わったらリセット
  useEffect(() => {
    setDisplay(text);
    return cancel;
  }, [text]);

  // autoPlay: マウント後に指定遅延で自動スクランブル
  useEffect(() => {
    if (autoPlay === undefined) return;
    const id = setTimeout(start, autoPlay);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={start}
      onMouseLeave={reset}
      aria-label={text}
    >
      {display}
    </span>
  );
}
