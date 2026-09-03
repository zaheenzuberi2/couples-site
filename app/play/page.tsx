import type { Metadata } from "next";
import Link from "next/link";
import CreateRoomForm from "@/components/play/create-room-form";
import { PLAY_COLORS } from "@/components/play/ui";

export const metadata: Metadata = {
  title: "Free bucket list & quiz",
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
        <CreateRoomForm />
      </div>

      <p className="mt-8 text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
        Making a full page for the two of you instead?{" "}
        <Link href="/" className="underline underline-offset-4">
          See Ours
        </Link>
      </p>
    </main>
  );
}
