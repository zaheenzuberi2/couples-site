import type { Metadata } from "next";
import Link from "next/link";
import CreateRoomForm from "@/components/play/create-room-form";
import { PlayMenu } from "@/components/play/play-menu";
import { PLAY_COLORS } from "@/components/play/ui";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Free Couple Bucket List & “How Well Do You Know Us” Quiz Maker",
  description:
    "Make a shared bucket list or a how-well-do-you-know-us quiz for you and your partner. No sign-up, no account - just a title and a link to share.",
  alternates: { canonical: `${siteUrl()}/play` },
};

export default function PlayLandingPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <span
        className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase"
        style={{ background: PLAY_COLORS.mintSoft, color: PLAY_COLORS.mint }}
      >
        Free · no account needed
      </span>

      <h1
        className="mt-6 text-[clamp(2.4rem,8vw,3.75rem)] leading-[1.05] font-extrabold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        Make a bucket list
        <br />
        or a quiz, in seconds
      </h1>

      <p className="mt-4 max-w-md leading-relaxed" style={{ color: PLAY_COLORS.inkSoft }}>
        No sign-up, no website needed. Just a title and you&apos;ve got a link
        to share with anyone.
      </p>

      <div className="mt-10 w-full">
        <PlayMenu />
      </div>

      <div id="create" className="mt-10 w-full scroll-mt-8">
        <CreateRoomForm />
      </div>

      <p className="mt-8 text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
        Making a full website for the two of you instead?{" "}
        <Link href="/" className="underline underline-offset-4">
          See Ours
        </Link>
      </p>

      <div
        className="mt-4 flex justify-center gap-4 text-xs"
        style={{ color: PLAY_COLORS.inkSoft }}
      >
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>
      </div>
    </main>
  );
}
