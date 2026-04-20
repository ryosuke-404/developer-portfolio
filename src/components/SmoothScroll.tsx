'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

let _lenis: Lenis | null = null;
export function lenisStop()  { _lenis?.stop(); }
export function lenisStart() { _lenis?.start(); }

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    _lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      _lenis = null;
    };
  }, []);

  return <>{children}</>;
}
