'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface Props {
  children: React.ReactNode;
  /** How far the button shell moves (fraction of offset from center). Default 0.38 */
  strength?: number;
  /** How far the inner text moves — less than shell gives a 3-D depth illusion. Default 0.16 */
  innerStrength?: number;
  className?: string;
}

/**
 * Wraps any child (usually a <button> or <a className="btn …">) with a
 * magnetic pull effect: the element drifts toward the cursor while hovered,
 * snapping back with spring physics on leave.
 *
 * The dual-layer approach (shell moves more, text moves less) creates a
 * subtle parallax that signals quality without being distracting.
 */
export default function MagneticButton({
  children,
  strength = 0.38,
  innerStrength = 0.16,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Outer shell
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const shellX = useSpring(ox, { stiffness: 200, damping: 18, mass: 0.6 });
  const shellY = useSpring(oy, { stiffness: 200, damping: 18, mass: 0.6 });

  // Inner text — lags slightly behind shell
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const textX = useSpring(ix, { stiffness: 240, damping: 22, mass: 0.5 });
  const textY = useSpring(iy, { stiffness: 240, damping: 22, mass: 0.5 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const dx = e.clientX - (left + width  / 2);
    const dy = e.clientY - (top  + height / 2);
    ox.set(dx * strength);
    oy.set(dy * strength);
    ix.set(dx * innerStrength);
    iy.set(dy * innerStrength);
  };

  const onLeave = () => {
    ox.set(0); oy.set(0);
    ix.set(0); iy.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: shellX, y: shellY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.span className="inline-block" style={{ x: textX, y: textY }}>
        {children}
      </motion.span>
    </motion.div>
  );
}
