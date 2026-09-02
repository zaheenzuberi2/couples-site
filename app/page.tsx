import Link from "next/link";
import MarketingHero from "@/components/marketing-hero";
import { BRAND } from "@/lib/env";
import { TIER_ORDER, TIERS } from "@/lib/tiers";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingHero priceFrom={TIERS.basic.price} />

      {/* ----------------------------------------------------- two modes */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-5xl gap-px bg-line sm:grid-cols-2">
          <Mode
            title="A wedding invitation"
            body="Your names and date up front, and every event on the schedule (mehndi, barat, walima) with venues, maps and dress code. Guests RSVP on the page, and the replies land in your dashboard. (Event schedule and RSVPs are on the Standard and Premium packages.)"
          />
          <Mode
            title="A keepsake"
            body="No guest list, no schedule. Just how you met, where you've been, and the photographs, laid out like something worth reading twice. An anniversary gift that isn't flowers."
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
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-xs tracking-[0.28em] text-muted uppercase">
            Three packages
          </p>
          <h2 className="mt-3 font-display text-4xl">Pick what you need</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Once, not a subscription. Build for free on any package and pay
            when you&apos;re ready to go public.
          </p>

          <div className="mx-auto mt-14 grid gap-6 text-left sm:grid-cols-3">
            {TIER_ORDER.map((t) => (
              <PricingCard key={t} tier={t} featured={t === "standard"} />
            ))}
          </div>

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

function PricingCard({
  tier,
  featured,
}: {
  tier: keyof typeof TIERS;
  featured: boolean;
}) {
  const config = TIERS[tier];
  return (
    <div
      className={`flex flex-col p-7 ${
        featured
          ? "border-2 border-accent bg-background"
          : "border border-line bg-background"
      }`}
    >
      {featured && (
        <span className="mb-3 self-start bg-accent px-2.5 py-1 text-[0.65rem] tracking-[0.14em] text-white uppercase">
          Most couples pick this
        </span>
      )}
      <h3 className="font-display text-2xl">{config.name}</h3>
      <p className="mt-1 font-display text-4xl">{config.price}</p>
      <p className="mt-2 text-sm text-muted">{config.tagline}</p>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {config.features.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
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
        className={`mt-7 inline-block px-6 py-3 text-center text-xs tracking-[0.18em] uppercase ${
          featured
            ? "bg-accent text-white"
            : "border border-line hover:border-accent hover:text-accent"
        }`}
      >
        Start with {config.name}
      </Link>
    </div>
  );
}

function Mode({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-card p-10">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-muted">{body}</p>
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
