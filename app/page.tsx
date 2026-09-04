import type { Metadata, Viewport } from "next";
import Link from "next/link";
import MarketingHero from "@/components/marketing-hero";
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

        <p className="mt-14 text-center text-sm text-muted">
          Not sure what that looks like?{" "}
          <Link href="/demo" className="text-accent underline underline-offset-4">
            See an example
          </Link>
        </p>
      </section>

      {/* ----------------------------------------------------------- play */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs tracking-[0.24em] text-accent uppercase">
              Free, no page required
            </p>
            <h2 className="mt-3 font-display text-4xl">
              Not ready for a whole page yet?
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted">
              Make a bucket list or a &quot;how well do you know us&quot;
              quiz in seconds. No sign-up, no account, just a title and a
              link to send.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="border border-line p-8">
              <h3 className="font-display text-2xl">
                How well do you know us?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Write a few questions, guests answer for fun, and a live
                leaderboard shows who knows you best.
              </p>
            </div>
            <div className="border border-line p-8">
              <h3 className="font-display text-2xl">Our bucket list</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Things you want to do together. Guests see your progress,
                not a due date.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/play"
              className="inline-block bg-accent px-8 py-3.5 text-xs tracking-[0.2em] text-white uppercase"
            >
              Try it free
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- pricing */}
      <section id="pricing" className="border-t border-line bg-card">
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
    <li>
      <span className="font-display text-3xl text-accent">{n}</span>
      <h3 className="mt-3 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </li>
  );
}
