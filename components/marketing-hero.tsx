"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AnimatedBrandMark } from "@/components/animated-brand-mark";
import { BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/env";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/play", label: "Free Games & Quizzes", prefetch: false },
] as const;

/**
 * The product's own front door. Deliberately a different register from the
 * couple pages themselves - this is Ours selling itself, so it gets the
 * luxury treatment: near-black canvas, warm gold and blush glow drifting
 * behind the copy, cream type. The couple pages stay light and airy; this
 * is the one place on the whole site that gets to feel expensive.
 */
export default function MarketingHero({ price }: { price: string }) {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile browsers can restore a scroll position from bfcache or a prior
  // visit's scroll state, landing the very first paint mid-page instead of
  // on the hero. Opting out of automatic restoration and forcing the top on
  // mount makes this page always open exactly where it should.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="relative overflow-hidden bg-[#160f14]">
      {/* Three soft, slowly drifting glow fields - gold, blush, deep plum.
          Blur does the work; nothing here is a hard-edged shape. Plain CSS
          keyframes (not Framer Motion) - the compositor runs these for
          free instead of ticking a JS animation loop for as long as the
          hero is mounted. prefers-reduced-motion is handled globally. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="animate-drift-a absolute h-[34rem] w-[34rem] rounded-full"
          style={{
            left: "8%",
            top: "-8%",
            background:
              "radial-gradient(circle, rgba(201,168,106,0.38) 0%, rgba(201,168,106,0) 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="animate-drift-b absolute h-[30rem] w-[30rem] rounded-full"
          style={{
            right: "4%",
            top: "8%",
            background:
              "radial-gradient(circle, rgba(224,165,184,0.32) 0%, rgba(224,165,184,0) 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="animate-drift-c absolute h-[36rem] w-[36rem] rounded-full"
          style={{
            left: "28%",
            bottom: "-18%",
            background:
              "radial-gradient(circle, rgba(139,58,90,0.4) 0%, rgba(139,58,90,0) 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <header className="pt-safe relative z-20 mx-auto flex w-full max-w-5xl items-center gap-2.5 px-6 py-6">
        <AnimatedBrandMark size={22} color="#e8c98a" />
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.5 }}
          className="font-display text-2xl text-[#f5ece0]"
        >
          {BRAND}
        </motion.span>

        <nav className="ml-8 hidden items-center gap-6 text-sm text-[#cbb8a3] sm:flex">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#e8c98a]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                prefetch={"prefetch" in link ? link.prefetch : undefined}
                className="transition-colors hover:text-[#e8c98a]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <Link
          href="/login"
          prefetch={false}
          className="ml-auto hidden text-sm text-[#cbb8a3] underline underline-offset-4 transition-colors hover:text-[#e8c98a] sm:inline-block"
        >
          Sign in
        </Link>

        {/* Mobile-only menu toggle - the nav links and Sign in above are
            sm:hidden, so this is the only way to reach them under that
            breakpoint. A 44px hit area even though the icon itself is
            smaller (Apple HIG / Material touch-target minimum). */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="ml-auto flex h-11 w-11 items-center justify-center text-[#f5ece0] sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <motion.span
              aria-hidden
              className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            />
            <motion.span
              aria-hidden
              className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
            />
            <motion.span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            />
          </span>
        </button>
      </header>

      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 sm:hidden">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="-mt-2 mb-4 overflow-hidden rounded-2xl border border-[#3a2f28] bg-[#1c1414]/95 backdrop-blur"
            >
              <nav className="flex flex-col divide-y divide-[#3a2f28]">
                {NAV_LINKS.map((link) =>
                  link.href.startsWith("#") ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="px-5 py-4 text-base text-[#e8ddcf] transition-colors hover:text-[#e8c98a]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={"prefetch" in link ? link.prefetch : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="px-5 py-4 text-base text-[#e8ddcf] transition-colors hover:text-[#e8c98a]"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Link
                  href="/login"
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  className="px-5 py-4 text-base font-medium text-[#e8c98a] transition-colors hover:text-[#f2d9a2]"
                >
                  Sign in
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-14 pb-24 text-center sm:pt-20 lg:pb-28"
      >
        <motion.h1
          variants={rise}
          className="font-display text-[clamp(2.7rem,8.5vw,5rem)] leading-[1.03] text-[#f8f1e6]"
        >
          Everyone gets a caption.
          <br />
          Give your partner a website.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mx-auto mt-7 max-w-xl leading-relaxed text-[#cbb8a3]"
        >
          Stop letting your best memories get buried in the camera roll.
          Create a beautiful, living timeline of your love story, track your
          bucket lists, and hard-launch your relationship. The ultimate
          digital anniversary or &quot;just because&quot; gift.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/login"
            className="group relative bg-[#e8c98a] px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-[#231419] uppercase shadow-[0_8px_24px_-8px_rgba(232,201,138,0.5)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#f2d9a2] hover:shadow-[0_14px_32px_-10px_rgba(232,201,138,0.65)] active:translate-y-0"
          >
            Create Free Gift Website
          </Link>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-1.5 text-xs tracking-[0.2em] text-[#f5ece0] uppercase transition-colors hover:text-[#e8c98a]"
          >
            <span className="underline decoration-[#4a3a3f] underline-offset-8 transition-colors group-hover:decoration-[#e8c98a]">
              See a Live Example
            </span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>

        <motion.p variants={rise} className="mt-5 text-xs text-[#8f7d70]">
          Free to build. {price} when you&apos;re ready to go public.
        </motion.p>

        <motion.div variants={rise} className="mt-16">
          <HeroPhoneMockup />
        </motion.div>
      </motion.section>
    </div>
  );
}

/**
 * A tilting, iPhone-framed miniature of the actual product (the /demo
 * couple, gold theme) - the gift made tangible right where a visitor's eye
 * lands after the buttons, instead of only a claim in text. Links straight
 * to /demo, so it doubles as the live example.
 */
function HeroPhoneMockup() {
  return (
    <Link
      href="/demo"
      className="group relative mx-auto block w-[270px] sm:w-[292px]"
      style={{ perspective: "1400px" }}
    >
      <div className="relative rounded-[2.75rem] bg-[#1c1917] p-[7px] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-2 group-hover:shadow-[0_60px_120px_-25px_rgba(0,0,0,0.75)]">
        {/* Notch */}
        <div
          aria-hidden
          className="absolute top-[7px] left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1c1917]"
        />

        <div
          data-theme="gold"
          className="relative overflow-hidden rounded-[2.25rem]"
          style={{ background: "var(--paper)" }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-6 pt-3.5 pb-1 text-[11px] font-medium tracking-wide"
            style={{ color: "var(--ink)" }}
          >
            <span>9:41</span>
            <svg viewBox="0 0 20 12" className="h-2.5 w-4" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="16"
                height="11"
                rx="2.5"
                stroke="currentColor"
              />
              <rect x="2" y="2" width="11" height="8" rx="1" fill="currentColor" />
              <rect
                x="17.5"
                y="4"
                width="2"
                height="4"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Browser URL bar */}
          <div
            className="mx-4 mt-2 flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "var(--paper-alt)" }}
          >
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0" style={{ color: "var(--whisper)" }}>
              <path
                fill="currentColor"
                d="M3.5 5V3.75a2.5 2.5 0 0 1 5 0V5h.25c.414 0 .75.336.75.75v4.5a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-4.5c0-.414.336-.75.75-.75H3.5Zm1.25 0h2.5V3.75a1.25 1.25 0 1 0-2.5 0V5Z"
              />
            </svg>
            <span
              className="truncate text-[10px] tracking-wide"
              style={{ color: "var(--whisper)" }}
            >
              ours.love/zara-and-alina
            </span>
          </div>

          {/* Header graphic placeholder */}
          <div
            className="relative mx-4 mt-3 flex h-24 items-center justify-center overflow-hidden rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--gilt) 0%, var(--paper-alt) 100%)",
            }}
          >
            <BrandMark size={40} color="var(--paper)" />
          </div>

          <p
            className="display mt-3 px-4 text-center text-lg"
            style={{ color: "var(--ink)" }}
          >
            Zara{" "}
            <span className="italic" style={{ color: "var(--gilt)" }}>
              &amp;
            </span>{" "}
            Alina
          </p>

          {/* Days-together counter */}
          <div
            className="mx-4 mt-3 rounded-2xl py-2.5 text-center text-[13px] font-semibold"
            style={{ background: "var(--gilt)", color: "var(--paper)" }}
          >
            💝 412 Days Together
          </div>

          {/* Milestone timeline snippet */}
          <div className="space-y-2.5 px-4 py-4">
            <TimelineRow date="Dec 24, 2025" text="The Night We Met ✨" />
            <TimelineRow date="Jan 12, 2026" text="Our First Coffee Date ☕" />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-1 pb-2.5">
            <span
              aria-hidden
              className="h-1 w-24 rounded-full"
              style={{ background: "var(--rule)" }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function TimelineRow({ date, text }: { date: string; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-left">
      <span
        aria-hidden
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
        style={{ background: "var(--gilt)" }}
      />
      <p className="text-[11px] leading-snug" style={{ color: "var(--ink)" }}>
        <span className="block text-[9px] tracking-wide uppercase" style={{ color: "var(--whisper)" }}>
          {date}
        </span>
        {text}
      </p>
    </div>
  );
}
