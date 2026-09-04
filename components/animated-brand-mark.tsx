"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The homepage-only intro variant of BrandMark: the two rings draw
 * themselves in, one after the other, before settling into the plain mark
 * everywhere else uses. Same geometry as BrandMark on purpose - it should
 * look like it finishes exactly where the static logo would sit, not like
 * a different icon that gets swapped in.
 */
export function AnimatedBrandMark({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  const reduceMotion = useReducedMotion();

  const ring = (delay: number) => ({
    initial: reduceMotion ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      duration: reduceMotion ? 0 : 0.85,
      delay: reduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <motion.circle
        cx="35"
        cy="30"
        r="26"
        fill="none"
        stroke={color}
        strokeWidth="4"
        {...ring(0)}
      />
      <motion.circle
        cx="65"
        cy="30"
        r="26"
        fill="none"
        stroke={color}
        strokeWidth="4"
        {...ring(0.4)}
      />
    </svg>
  );
}
