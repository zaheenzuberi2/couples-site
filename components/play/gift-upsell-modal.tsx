"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PLAY_COLORS } from "@/components/play/ui";

/**
 * Fires once, right after a free room is generated - the one moment a
 * visitor has just proven intent ("I want this saved and shareable") but
 * has no page of their own yet. createRoom's redirect appends ?new=1 for
 * exactly this; closing either button strips it via router.replace so a
 * refresh or the back button never re-triggers it.
 */
export function GiftUpsellModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // Derived, not synced: open is just "the param is there and I haven't
  // dismissed it yet," so there's no effect racing the router to set state.
  const [dismissed, setDismissed] = useState(false);
  const open = searchParams.get("new") === "1" && !dismissed;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setDismissed(true);
    router.replace(pathname);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-upsell-heading"
            className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              id="gift-upsell-heading"
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
            >
              ✨ Lock This Into Your Permanent Timeline!
            </p>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: PLAY_COLORS.inkSoft }}
            >
              Don&apos;t let this link get lost. Add this quiz and bucket
              list directly into a gorgeous, permanent gift website for your
              partner.
            </p>

            <Link
              href="/login"
              className="mt-6 block rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform active:scale-95"
              style={{ background: PLAY_COLORS.coral }}
            >
              Create Free Gift Website Now
            </Link>
            <button
              type="button"
              onClick={close}
              className="mt-3 text-xs underline underline-offset-4"
              style={{ color: PLAY_COLORS.inkSoft }}
            >
              Just give me the free link
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
