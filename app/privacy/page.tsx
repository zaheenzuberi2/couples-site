import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND} collects, stores and uses your information.`,
  alternates: { canonical: `${siteUrl()}/privacy` },
};

const UPDATED = "September 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link href="/" className="text-xs text-muted underline underline-offset-4">
        ← Back to {BRAND}
      </Link>

      <h1 className="mt-6 font-display text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-xs text-muted">Last updated {UPDATED}</p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted">
        <Section title="What we collect">
          <p>
            To build your page we collect what you give us directly: your
            names, your story, your photos, an event date if you add one,
            and your email address for signing in. If you pay by bank
            transfer, we also collect the payment screenshot and any note
            you attach, so we can confirm the payment manually.
          </p>
          <p className="mt-3">
            If you use the free bucket list or quiz tool at{" "}
            <Link href="/play" className="underline underline-offset-4">
              /play
            </Link>
            , no account is required - we only store what you type into it
            (the title, list items, quiz questions) and, if a guest plays
            your quiz, the name and score they enter.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Solely to run the product: to render your page, to let you edit
            it, to verify a manual payment, and to contact you about your
            own account if needed. We do not sell your information, and we
            do not use it for advertising or share it with data brokers.
          </p>
        </Section>

        <Section title="Where it's stored">
          <p>
            Your data (account, page content, photos, and payment
            screenshots) is stored with Supabase, our database and file
            storage provider. Your page is only publicly reachable once
            it&apos;s paid for and published - until then it sits behind a
            private, unguessable link that only you have.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use a single session cookie to keep you signed in. That&apos;s
            it - no advertising cookies, no third-party trackers, no
            analytics pixels that follow you elsewhere.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can edit or remove your photos and text at any time from
            your dashboard. To delete your account and everything attached
            to it, or to ask what data we hold on you, email us at{" "}
            <a href="mailto:mzaheen3307@gmail.com" className="underline underline-offset-4">
              mzaheen3307@gmail.com
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes in a meaningful way, we&apos;ll update the
            date at the top of this page.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
