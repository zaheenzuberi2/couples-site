import Link from "next/link";
import { BRAND, PRICE_LABEL } from "@/lib/env";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 py-6">
        <span className="font-display text-2xl">{BRAND}</span>
        <Link
          href="/login"
          className="ml-auto text-sm text-muted underline underline-offset-4 hover:text-accent"
        >
          Sign in
        </Link>
      </header>

      {/* ---------------------------------------------------------- hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <p className="text-xs tracking-[0.28em] text-muted uppercase">
          For the two of you
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,4.75rem)] leading-[1.02]">
          Send us your photos.
          <br />
          Get back a website.
        </h1>
        <p className="mx-auto mt-7 max-w-xl leading-relaxed text-muted">
          Write a few lines, upload the photos you love, and your own page is
          ready in minutes — your names, your story, your date. Share it with
          everyone you&apos;re inviting, or keep it just between you.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="bg-accent px-8 py-3.5 text-xs tracking-[0.2em] text-white uppercase"
          >
            Start your page
          </Link>
          <a
            href="#how"
            className="border border-line px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:border-accent hover:text-accent"
          >
            See how it works
          </a>
        </div>

        <p className="mt-5 text-xs text-muted">
          Free to build. {PRICE_LABEL} only when you&apos;re ready to go public.
        </p>
      </section>

      {/* ----------------------------------------------------- two modes */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-5xl gap-px bg-line sm:grid-cols-2">
          <Mode
            title="A wedding invitation"
            body="Your names and date up front, every event on the schedule — mehndi, barat, walima — with venues, maps and dress code. Guests RSVP on the page, and the replies land in your dashboard."
          />
          <Mode
            title="A keepsake"
            body="No guest list, no schedule. Just how you met, where you've been, and the photographs — laid out like something worth reading twice. An anniversary gift that isn't flowers."
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
            Once. Not a subscription, not per guest.
          </p>

          <ul className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
            {[
              "Your own web address",
              "Unlimited photos and edits",
              "RSVPs collected for you",
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
            Start — it&apos;s free to try
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
