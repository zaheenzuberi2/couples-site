"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedBrandMark } from "@/components/animated-brand-mark";
import { BRAND } from "@/lib/env";

/**
 * The product's own front door. Deliberately a different register from the
 * couple pages themselves - this is Ours selling itself, so it gets the
 * luxury treatment: near-black canvas, warm gold and blush glow drifting
 * behind the copy, cream type. The couple pages stay light and airy; this
 * is the one place on the whole site that gets to feel expensive.
 */
export default function MarketingHero({
  price,
  exampleUrl,
}: {
  price: string;
  /**
   * Host for the mockup's fake URL bar, e.g. "ours.example.com" - computed
   * server-side (siteUrl() reads env vars only the server has) and passed
   * in, rather than called here: this is a Client Component, and calling
   * it here would render a different value on the server than in the
   * browser and fail hydration.
   */
  exampleUrl: string;
}) {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="relative overflow-hidden bg-[#160f14]">
      {/* Three soft, slowly drifting glow fields - gold, blush, deep plum.
          Blur does the work; nothing here is a hard-edged shape. */}
      {!reduceMotion && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute h-[34rem] w-[34rem] rounded-full"
            style={{
              left: "8%",
              top: "-8%",
              background:
                "radial-gradient(circle, rgba(201,168,106,0.38) 0%, rgba(201,168,106,0) 70%)",
              filter: "blur(60px)",
            }}
            animate={{ x: [0, 40, -10, 0], y: [0, 25, 10, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-[30rem] w-[30rem] rounded-full"
            style={{
              right: "4%",
              top: "8%",
              background:
                "radial-gradient(circle, rgba(224,165,184,0.32) 0%, rgba(224,165,184,0) 70%)",
              filter: "blur(60px)",
            }}
            animate={{ x: [0, -35, 15, 0], y: [0, 30, -15, 0] }}
            transition={{ duration: 31, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-[36rem] w-[36rem] rounded-full"
            style={{
              left: "28%",
              bottom: "-18%",
              background:
                "radial-gradient(circle, rgba(139,58,90,0.4) 0%, rgba(139,58,90,0) 70%)",
              filter: "blur(70px)",
            }}
            animate={{ x: [0, 25, -25, 0], y: [0, -15, 10, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      <header className="pt-safe relative z-10 mx-auto flex w-full max-w-5xl items-center gap-2.5 px-6 py-6">
        <AnimatedBrandMark size={22} color="#e8c98a" />
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.75 }}
          className="font-display text-2xl text-[#f5ece0]"
        >
          {BRAND}
        </motion.span>

        <nav className="ml-8 hidden items-center gap-6 text-sm text-[#cbb8a3] sm:flex">
          <a href="#how" className="transition-colors hover:text-[#e8c98a]">
            How it works
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-[#e8c98a]"
          >
            Pricing
          </a>
          <Link href="/play" className="transition-colors hover:text-[#e8c98a]">
            Free Date Tools
          </Link>
        </nav>

        <Link
          href="/login"
          className="ml-auto text-sm text-[#cbb8a3] underline underline-offset-4 transition-colors hover:text-[#e8c98a]"
        >
          Sign in
        </Link>
      </header>

      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 px-6 pt-14 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-20 lg:pb-28"
      >
        <div className="text-center lg:text-left">
          <motion.h1
            variants={rise}
            className="font-display text-[clamp(2.7rem,7.5vw,4.5rem)] leading-[1.05] text-[#f8f1e6]"
          >
            Everyone gets a caption.
            <br />
            Give your partner a website.
          </motion.h1>
          <motion.p
            variants={rise}
            className="mx-auto mt-7 max-w-xl leading-relaxed text-[#cbb8a3] lg:mx-0"
          >
            Stop letting your best memories get buried in the camera roll.
            Create a beautiful, living timeline of your love story, track
            your bucket lists, and hard-launch your relationship. The
            ultimate digital anniversary or &quot;just because&quot; gift.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-start"
          >
            <Link
              href="/login"
              className="group relative bg-[#e8c98a] px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-[#231419] uppercase shadow-[0_8px_24px_-8px_rgba(232,201,138,0.5)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#f2d9a2] hover:shadow-[0_14px_32px_-10px_rgba(232,201,138,0.65)] active:translate-y-0"
            >
              Create Free Gift Page
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
        </div>

        <motion.div variants={rise}>
          <HeroPreviewMockup exampleUrl={exampleUrl} />
        </motion.div>
      </motion.section>
    </div>
  );
}

/**
 * A real miniature of the actual product (the /demo couple, gold theme)
 * inside a browser-chrome frame - proof next to the pitch instead of only
 * a claim. Links straight to /demo, so it doubles as a live example.
 */
function HeroPreviewMockup({ exampleUrl }: { exampleUrl: string }) {
  return (
    <Link
      href="/demo"
      className="group mx-auto block max-w-sm overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out hover:-translate-y-1.5"
    >
      <div className="flex items-center gap-1.5 border-b border-[#e7e1db] bg-[#fbf9f7] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[#e7e1db]" />
        <span className="h-2 w-2 rounded-full bg-[#e7e1db]" />
        <span className="h-2 w-2 rounded-full bg-[#e7e1db]" />
        <span className="ml-3 truncate rounded-full border border-[#e7e1db] px-3 py-1 text-[10px] tracking-wide text-[#78716c]">
          {exampleUrl}/zara-and-ayesha
        </span>
      </div>

      <div data-theme="gold" className="px-8 py-10 text-center" style={{ background: "var(--paper)" }}>
        <p className="display text-3xl" style={{ color: "var(--ink)" }}>
          Zara{" "}
          <span className="italic" style={{ color: "var(--gilt)" }}>
            &amp;
          </span>{" "}
          Ayesha
        </p>

        <div className="rule-diamond mx-auto mt-4 max-w-[7rem]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rotate-45"
            style={{ background: "var(--gilt)" }}
          />
        </div>

        <p className="eyebrow mt-4">24 December 2026</p>

        <div className="mt-7 grid grid-cols-4 gap-2">
          {[
            "/demo/photo-1.svg",
            "/demo/photo-2.svg",
            "/demo/photo-3.svg",
            "/demo/photo-4.svg",
          ].map((src) => (
            <div
              key={src}
              className="aspect-square overflow-hidden rounded-lg"
              style={{ background: "var(--paper-alt)" }}
            >
              <Image
                src={src}
                alt=""
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
