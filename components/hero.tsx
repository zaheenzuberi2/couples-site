"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatDate } from "@/lib/format";
import type { SiteBundle } from "@/lib/types";

/**
 * The first thing anyone sees. No eyebrow label above the names - the names
 * are the headline, nothing needs to announce them first. A client component
 * (the rest of the page stays server-rendered) so the entrance can be a
 * single authored motion sequence rather than everything appearing at once.
 */
export default function Hero({
  site,
  heroSrc,
  countdown,
  showRsvp,
}: {
  site: SiteBundle["site"];
  heroSrc: string | null;
  countdown: number | null;
  showRsvp: boolean;
}) {
  const names = [site.partner_one, site.partner_two].filter(Boolean);
  const hasPhoto = Boolean(heroSrc);
  const reduceMotion = useReducedMotion();

  // One staggered rise-and-fade, timed so the names lead and everything
  // else follows a beat behind - not six elements animating in unison.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.11, delayChildren: reduceMotion ? 0 : 0.15 },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28">
      {hasPhoto ? (
        <>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: reduceMotion ? 1 : 1.08 }}
            transition={{ duration: 22, ease: "linear" }}
          >
            <Image
              src={heroSrc as string}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          {/* Scrim: keeps the names legible over any photo, light or dark. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,10,9,0.46) 0%, rgba(12,10,9,0.2) 40%, rgba(12,10,9,0.6) 100%)",
            }}
          />
        </>
      ) : (
        // No photo yet: a soft glow from the theme's own accent rather than
        // a flat fill, so the names still sit on something with depth.
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 42%, var(--paper-alt) 0%, var(--paper) 70%)",
          }}
        />
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl text-center"
        style={hasPhoto ? { color: "#fff" } : undefined}
      >
        <motion.h1
          variants={rise}
          className="display text-[clamp(3.2rem,12vw,7.5rem)] leading-[0.94] tracking-[-0.02em]"
        >
          {names[0]}
          {names.length === 2 && (
            <>
              <span
                className="mx-3 inline-block align-middle text-[0.5em] italic"
                style={{
                  color: hasPhoto ? "rgba(255,255,255,0.75)" : "var(--gilt)",
                }}
              >
                &amp;
              </span>
              {names[1]}
            </>
          )}
        </motion.h1>

        {site.tagline.trim() && (
          <motion.p
            variants={rise}
            className="mx-auto mt-7 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{
              color: hasPhoto ? "rgba(255,255,255,0.88)" : "var(--whisper)",
            }}
          >
            {site.tagline}
          </motion.p>
        )}

        {site.event_date && (
          <motion.div variants={rise} className="mt-10">
            <div
              className="rule-diamond mx-auto max-w-xs"
              style={hasPhoto ? { color: "rgba(255,255,255,0.45)" } : undefined}
            >
              <Diamond />
            </div>
            <p className="display mt-6 text-2xl tracking-wide sm:text-3xl">
              {formatDate(site.event_date)}
            </p>
            {countdown !== null && countdown >= 0 && (
              <p
                className="eyebrow mt-4"
                style={
                  hasPhoto ? { color: "rgba(255,255,255,0.75)" } : undefined
                }
              >
                {countdown === 0
                  ? "Today"
                  : countdown === 1
                    ? "Tomorrow"
                    : `${countdown} days to go`}
              </p>
            )}
          </motion.div>
        )}

        {showRsvp && (
          <motion.a
            variants={rise}
            href="#rsvp"
            className="mt-12 inline-block border px-9 py-3.5 text-xs tracking-[0.22em] uppercase transition-colors duration-300"
            style={
              hasPhoto
                ? { borderColor: "rgba(255,255,255,0.6)", color: "#fff" }
                : { borderColor: "var(--gilt)", color: "var(--gilt)" }
            }
          >
            RSVP
          </motion.a>
        )}
      </motion.div>

      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <motion.div
            className="h-9 w-px"
            style={{
              background: hasPhoto ? "rgba(255,255,255,0.5)" : "var(--gilt)",
              transformOrigin: "top",
            }}
            animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.35, 0.65, 1],
            }}
          />
        </motion.div>
      )}
    </section>
  );
}

function Diamond() {
  return (
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rotate-45"
      style={{ background: "var(--gilt)" }}
    />
  );
}
