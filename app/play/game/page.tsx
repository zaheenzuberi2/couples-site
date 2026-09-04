import type { Metadata } from "next";
import Link from "next/link";
import CoupleGame from "@/components/play/couple-game";
import { PLAY_COLORS } from "@/components/play/ui";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Who's More Likely? A Free Couple Game",
  description:
    "20 quick 'who's more likely' questions for couples - who gets angry first, who loves more, and more. Free, no sign-up.",
  alternates: { canonical: `${siteUrl()}/play/game` },
};

export default function CoupleGamePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-16">
      <span
        className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase"
        style={{ background: PLAY_COLORS.coralSoft, color: PLAY_COLORS.coral }}
      >
        Free · no account needed
      </span>

      <h1
        className="mt-6 text-center text-[clamp(2rem,7vw,3rem)] leading-[1.05] font-extrabold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        Who&apos;s More Likely?
      </h1>

      <div className="mt-8 w-full">
        <CoupleGame />
      </div>

      <p className="mt-8 text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
        Want a bucket list or quiz too?{" "}
        <Link href="/play" className="underline underline-offset-4">
          See all the free tools
        </Link>
      </p>
    </main>
  );
}
