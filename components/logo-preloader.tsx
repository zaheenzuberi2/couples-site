"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AnimatedBrandMark } from "@/components/animated-brand-mark";

const SEEN_KEY = "ours-splash-seen";

/**
 * A brief full-screen splash of the logo drawing itself in, shown once per
 * browser session right before the homepage hero appears - not on every
 * visit, which would just be an annoying delay for a returning user.
 * Starts hidden (matching the server-rendered markup) and flips on in a
 * layout effect, which runs before the browser paints, so there's no flash
 * of the hero underneath before the splash covers it.
 */
export function LogoPreloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  // Sticks around across React's dev-mode double-invoke of effects (mount,
  // cleanup, mount again) so the sessionStorage read/write below only ever
  // runs once per real mount - otherwise the second pass would see "already
  // seen" from the first pass's write and skip scheduling a hide timer,
  // leaving the splash stuck on screen forever.
  const shouldShowRef = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    if (reduceMotion) return;

    if (shouldShowRef.current === null) {
      try {
        const alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
        sessionStorage.setItem(SEEN_KEY, "1");
        shouldShowRef.current = !alreadySeen;
      } catch {
        // Storage can throw in private-browsing modes - just skip the splash.
        shouldShowRef.current = false;
      }
    }
    if (!shouldShowRef.current) return;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#160f14]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedBrandMark size={72} color="#e8c98a" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
