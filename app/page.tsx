import type { Viewport } from "next";
import Link from "next/link";
import MarketingHero from "@/components/marketing-hero";
import { BRAND, PRICE_LABEL } from "@/lib/env";

// The page opens on a dark hero - the browser's own chrome should match it
// rather than flash the light default from the root layout.
export const viewport: Viewport = {
  themeColor: "#160f14",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingHero price={PRICE_LABEL} />

      {/* --------------------------------------------------------- pitch */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-xs tracking-[0.24em] text-accent uppercase">
            The ultimate digital gift
          </p>
          <h2 className="mt-3 font-display text-4xl">A keepsake page</h2>
          <p className="mt-5 leading-relaxed text-muted">
            Better than flowers that die or chocolates that get eaten. Just
            how you met, where you&apos;ve been, and the photographs, laid
            out like something worth reading twice. Perfect for hard
            launching your relationship, an anniversary, or just because.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- games */}
      <section className="mx-auto w-full max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs tracking-[0.28em] text-muted uppercase">
            Included with every page
          </p>
          <h2 className="mt-3 font-display text-4xl">
            A little more than a page
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <GameCard
            title="How well do you know us?"
            body="Write a few questions, guests answer for fun, and a live leaderboard shows who knows you best."
          />
          <GameCard
            title="Our bucket list"
            body="Things you want to do together. Guests see your progress, not a due date."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------- how */}
      <section id="how" className="mx-auto w-full max-w-4xl px-6 py-24">
        <h2 className="text-center font-display text-4xl">
          Three steps, no design skills
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3">
          <Step
            n="01"
            title="Tell us who you are"
            body="Two names and a web address. That's the whole sign-up."
          />
          <Step
            n="02"
            title="Add your photos and words"
            body="Drag in the photos, write your story, pick a colour. Change any of it whenever you like."
          />
          <Step
            n="03"
            title="Share it"
            body="You get a private link straight away. Pay when you want the public address."
          />
        </ol>
      </section>

      {/* ------------------------------------------------------- pricing */}
      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-xs tracking-[0.28em] text-muted uppercase">
            One price
          </p>
          <p className="mt-5 font-display text-6xl">{PRICE_LABEL}</p>
          <p className="mt-3 text-sm text-muted">
            Once. Not a subscription.
          </p>

          <ul className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
            {[
              "Your own web address",
              "Unlimited photos and edits",
              "Bucket list and a \"how well do you know us\" quiz",
              "Looks right on every phone",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="mt-12 inline-block bg-accent px-8 py-3.5 text-xs tracking-[0.2em] text-white uppercase"
          >
            Start, it&apos;s free to try
          </Link>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-10 text-center text-sm text-muted">
        <span className="font-display text-lg text-foreground">{BRAND}</span>
        <span className="mx-2">·</span>
        Websites for couples
      </footer>
    </div>
  );
}

function GameCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-card p-8">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li>
      <span className="font-display text-3xl text-accent">{n}</span>
      <h3 className="mt-3 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </li>
  );
}
