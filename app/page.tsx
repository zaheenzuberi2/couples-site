import type { Metadata, Viewport } from "next";
import Link from "next/link";
import MarketingHero from "@/components/marketing-hero";
import { Reveal } from "@/components/reveal";
import { PLAY_COLORS } from "@/components/play/ui";
import { BrandMark } from "@/components/brand-mark";
import { BRAND, PRICE_LABEL, siteUrl } from "@/lib/env";

// The homepage is the one page whose title shouldn't inherit the root
// layout's template ("%s · Ours") - it IS the brand, so it gets its own
// full title plus the keyword phrases people actually search for. The
// catchy hero headline stays catchy (it's for humans); this is what
// search engines read instead.
export const metadata: Metadata = {
  title: `${BRAND} - Build a Free Website for Couples`,
  description:
    "Make a beautiful website for the two of you in minutes. Add your photos, your story and your dates - a couple website builder for anniversaries, relationship reveals, and keepsake pages. Free to build.",
  alternates: { canonical: siteUrl() },
};

// The page opens on a dark hero - the browser's own chrome should match it
// rather than flash the light default from the root layout.
export const viewport: Viewport = {
  themeColor: "#160f14",
  colorScheme: "dark",
  viewportFit: "cover",
};

const GIFT_CARDS = [
  {
    icon: "🎁",
    title: "The Ultimate Digital Gift",
    body: "Better than flowers that die or chocolates that get eaten. A permanent keepsake layout of how you met, your favorite dates, and inside jokes.",
  },
  {
    icon: "🚀",
    title: "Perfect for a “Hard Launch”",
    body: "Get a clean, custom web link made perfectly to share in your Instagram or TikTok bio to make it official.",
  },
  {
    icon: "⏳",
    title: "Milestone & Anniversary Trackers",
    body: "A live counter showing exactly how many days you've been together, with countdowns to your next big trip or anniversary.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#organization`,
        name: BRAND,
        url: siteUrl(),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        name: BRAND,
        url: siteUrl(),
        description:
          "A website builder for couples - photos, your story, and your dates, turned into a page you can share.",
        publisher: { "@id": `${siteUrl()}/#organization` },
      },
      {
        "@type": "Product",
        name: `${BRAND} couple website`,
        description:
          "A custom website for the two of you: your photos, your story and your dates on your own web address.",
        brand: { "@id": `${siteUrl()}/#organization` },
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: PRICE_LABEL.replace(/[^0-9.]/g, ""),
          availability: "https://schema.org/InStock",
          url: siteUrl(),
        },
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Structured data for search engines - no visible effect. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingHero
        price={PRICE_LABEL}
        exampleUrl={siteUrl().replace(/^https?:\/\//, "")}
      />

      {/* ---------------------------------------------------- perfect gift */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-4xl sm:text-5xl">
              The perfect surprise gift
            </h2>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
              For a girlfriend, boyfriend, or partner who has everything
              except a place to keep the two of you.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {GIFT_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div className="h-full border border-line bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(28,25,23,0.25)]">
                  <span aria-hidden className="text-3xl">
                    {card.icon}
                  </span>
                  <h3 className="mt-4 font-display text-xl">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- how */}
      <section id="how" className="mx-auto w-full max-w-4xl px-6 py-24">
        <Reveal>
          <h2 className="text-center font-display text-4xl">
            Three steps, no design skills
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="mt-16 grid gap-14 sm:grid-cols-3">
            <Step
              n="01"
              title="Name Your Page"
              body="Enter your names and claim your custom web address in seconds."
            />
            <Step
              n="02"
              title="Drop in Your Memories"
              body="Drag in photos from your camera roll, write your story, and pick your favorite color theme."
            />
            <Step
              n="03"
              title="Gift it or Share it"
              body="Get a private link instantly to share as a surprise gift, or go public when you are ready to show the world."
            />
          </ol>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-14 text-center text-sm text-muted">
            Not sure what that looks like?{" "}
            <Link
              href="/demo"
              className="text-accent underline underline-offset-4"
            >
              See an example
            </Link>
          </p>
        </Reveal>
      </section>

      {/* ----------------------------------------------------------- play */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-5xl gap-16 px-6 py-24 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-12">
          <Reveal className="order-2 text-center lg:order-1 lg:text-left">
            <h2 className="font-display text-4xl sm:text-5xl">
              Not ready for a whole page yet?
            </h2>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted lg:mx-0">
              Make a bucket list or a &quot;how well do you know us&quot;
              quiz, completely free, with no sign-up and no account. Just a
              title, and you&apos;ve got a link to send.
            </p>
            <Link
              href="/play"
              className="mt-8 inline-block bg-accent px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-white uppercase shadow-[0_8px_24px_-8px_rgba(156,63,91,0.4)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(156,63,91,0.55)] active:translate-y-0"
            >
              Try it free
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="order-1 lg:order-2">
            <PlayPreviewCard />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- pricing */}
      <section id="pricing" className="relative overflow-hidden border-t border-line bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 15%, rgba(163,129,58,0.14) 0%, rgba(163,129,58,0) 70%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl sm:text-5xl">
            One Small Price. Lifetime Keepsake.
          </h2>

          <p className="mt-8 font-display text-6xl sm:text-7xl">{PRICE_LABEL}</p>
          <p className="mt-3 text-sm text-muted">Once. Not a subscription.</p>
          <p className="mt-2 text-sm text-accent">
            Cheaper than a single dinner date. Kept forever.
          </p>

          <ul className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
            {[
              `Your own premium custom web address (${siteUrl().replace(/^https?:\/\//, "")}/your-names)`,
              "Unlimited photo uploads, edits, and updates",
              "Fully mobile-responsive (looks like a native app on every phone)",
              "Live countdown widgets & interactive date bucket lists",
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
            className="mt-12 inline-block bg-accent px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-white uppercase shadow-[0_8px_24px_-8px_rgba(156,63,91,0.4)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(156,63,91,0.55)] active:translate-y-0"
          >
            Start, it&apos;s free to try
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-line px-6 py-10 text-center text-sm text-muted">
        <span className="inline-flex items-center gap-2 font-display text-lg text-foreground">
          <BrandMark size={16} color="var(--accent)" />
          {BRAND}
        </span>
        <span className="mx-2">·</span>
        Websites for couples
        <span className="mx-2">·</span>
        <Link href="/play" className="underline underline-offset-4 hover:text-accent">
          Free bucket list &amp; quiz
        </Link>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="/privacy" className="underline underline-offset-4 hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms" className="underline underline-offset-4 hover:text-accent">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="text-center sm:text-left">
      <span
        aria-hidden
        className="mx-auto block h-1.5 w-1.5 rotate-45 bg-accent sm:mx-0"
      />
      <span className="mt-4 block font-display text-5xl text-accent">{n}</span>
      <h3 className="mt-3 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </li>
  );
}

/**
 * The /play product's own coral-and-mint language, borrowed for one card so
 * the homepage shows what that free tool actually looks like rather than
 * describing it in two identical bordered boxes.
 */
function PlayPreviewCard() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(255,111,129,0.45)]">
      <p
        className="text-xs font-bold tracking-wide uppercase"
        style={{ color: PLAY_COLORS.mint }}
      >
        Bucket list
      </p>
      <div className="mt-3 space-y-2">
        <div
          className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
          style={{ background: PLAY_COLORS.mintSoft }}
        >
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: PLAY_COLORS.mint }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path
                d="M3 8.5 6.5 12 13 4.5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            className="text-sm"
            style={{ color: PLAY_COLORS.ink, textDecoration: "line-through" }}
          >
            Watch the sunrise together
          </span>
        </div>
        <div
          className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
          style={{ background: "#faf3ec" }}
        >
          <span
            aria-hidden
            className="h-5 w-5 shrink-0 rounded-full border-2"
            style={{ borderColor: `${PLAY_COLORS.ink}33` }}
          />
          <span className="text-sm" style={{ color: PLAY_COLORS.ink }}>
            Visit Hunza Valley
          </span>
        </div>
      </div>

      <p
        className="mt-6 text-xs font-bold tracking-wide uppercase"
        style={{ color: PLAY_COLORS.coral }}
      >
        Quiz
      </p>
      <div
        className="mt-3 rounded-2xl px-3.5 py-3"
        style={{ background: PLAY_COLORS.coralSoft }}
      >
        <p className="text-sm font-semibold" style={{ color: PLAY_COLORS.ink }}>
          Where was our first trip?
        </p>
      </div>
    </div>
  );
}
