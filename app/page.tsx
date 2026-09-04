import type { Metadata, Viewport } from "next";
import Image from "next/image";
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
      <MarketingHero price={PRICE_LABEL} />

      {/* --------------------------------------------------------- pitch */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-5xl gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
          <Reveal className="text-center lg:text-left">
            <h2 className="font-display text-4xl sm:text-5xl">
              The ultimate digital gift
            </h2>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted lg:mx-0">
              Better than flowers that die or chocolates that get eaten. Just
              how you met, where you&apos;ve been, and the photographs, laid
              out like something worth reading twice. Perfect for hard
              launching your relationship, an anniversary, or just because.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <PagePreviewMockup />
          </Reveal>
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
              className="mt-8 inline-block bg-accent px-8 py-3.5 text-xs tracking-[0.2em] text-white uppercase"
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
          <p className="font-display text-6xl sm:text-7xl">{PRICE_LABEL}</p>
          <p className="mt-3 text-sm text-muted">Once. Not a subscription.</p>

          <ul className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
            {[
              "Your own web address",
              "Unlimited photos and edits",
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
 * Shows the actual product instead of describing it - a miniature of a real
 * themed page (the /demo couple, gold theme), inside a browser-chrome frame.
 * Links straight to /demo so "just a mockup" becomes the real thing on click.
 */
function PagePreviewMockup() {
  return (
    <Link
      href="/demo"
      className="group mx-auto block max-w-sm overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_70px_-30px_rgba(28,20,15,0.45)] transition-transform duration-500 ease-out hover:-translate-y-1.5"
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-background px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-3 truncate rounded-full border border-line px-3 py-1 text-[10px] tracking-wide text-muted">
          {siteUrl().replace(/^https?:\/\//, "")}/zara-and-ayesha
        </span>
      </div>

      <div
        data-theme="gold"
        className="px-8 py-10 text-center"
        style={{ background: "var(--paper)" }}
      >
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
