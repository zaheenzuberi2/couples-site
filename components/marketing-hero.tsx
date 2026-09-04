"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";
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
}: {
  price: string;
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
        <BrandMark size={22} color="#e8c98a" />
        <span className="font-display text-2xl text-[#f5ece0]">{BRAND}</span>
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
        className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-14 pb-28 text-center sm:pt-20"
      >
        <motion.h1
          variants={rise}
          className="font-display text-[clamp(2.7rem,8.5vw,5rem)] leading-[1.03] text-[#f8f1e6]"
        >
          Everyone gets a caption.
          <br />
          You get a website.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mx-auto mt-7 max-w-xl leading-relaxed text-[#cbb8a3]"
        >
          Send your photos, write a few lines, and your own page is ready in
          minutes with your names, your story and your date. Share it with
          everyone you&apos;re inviting, or keep it just between you.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/login"
            className="bg-[#e8c98a] px-8 py-3.5 text-xs tracking-[0.2em] text-[#231419] uppercase transition-colors hover:bg-[#f2d9a2]"
          >
            Start your page
          </Link>
          <a
            href="#how"
            className="border border-[#4a3a3f] px-8 py-3.5 text-xs tracking-[0.2em] text-[#f5ece0] uppercase transition-colors hover:border-[#e8c98a] hover:text-[#e8c98a]"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p variants={rise} className="mt-5 text-xs text-[#8f7d70]">
          Free to build. {price} when you&apos;re ready to go public.
        </motion.p>
      </motion.section>
    </div>
  );
}
