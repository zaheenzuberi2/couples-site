import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, PRICE_LABEL, siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms for using ${BRAND}.`,
  alternates: { canonical: `${siteUrl()}/terms` },
};

const UPDATED = "September 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link href="/" className="text-xs text-muted underline underline-offset-4">
        ← Back to {BRAND}
      </Link>

      <h1 className="mt-6 font-display text-4xl">Terms of Service</h1>
      <p className="mt-2 text-xs text-muted">Last updated {UPDATED}</p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted">
        <Section title="The product">
          <p>
            {BRAND} lets you build a website for the two of you: your photos,
            your story and your dates, on your own web address. Building a
            website is free. Your website is only reachable at its public address
            once you&apos;ve paid {PRICE_LABEL} and published it. Until
            then it lives at a private preview link only you have.
          </p>
        </Section>

        <Section title="Payment">
          <p>
            Payment is a one-time {PRICE_LABEL} fee, made by bank transfer.
            You upload a screenshot of the transfer, we confirm it by hand
            and unlock publishing, usually within a day. There&apos;s no
            subscription and no recurring charge.
          </p>
        </Section>

        <Section title="Refunds">
          <p>
            If your payment hasn&apos;t been confirmed yet, email us and
            we&apos;ll refund it, no questions asked. Once your website is
            published, the fee covers the work already done and isn&apos;t
            refundable, but if something&apos;s actually wrong on our end,
            email us and we&apos;ll make it right.
          </p>
        </Section>

        <Section title="Your content">
          <p>
            Your photos and words stay yours. Uploading them to {BRAND}{" "}
            doesn&apos;t transfer ownership to us. We host them so your
            website can display them, nothing more. Don&apos;t upload anything
            you don&apos;t have the right to share, or anything illegal,
            harassing, or intended to impersonate someone without consent.
            We can take down content or suspend a website that violates this.
          </p>
        </Section>

        <Section title="The free tools">
          <p>
            The bucket list and quiz maker at{" "}
            <Link href="/play" className="underline underline-offset-4">
              /play
            </Link>{" "}
            are free, with no account and no purchase required. Because
            there&apos;s no login, the edit link is the only way to recover
            a room. If it&apos;s lost, we can&apos;t recover it for you.
          </p>
        </Section>

        <Section title="Availability">
          <p>
            We aim to keep websites up reliably, but we don&apos;t guarantee
            uninterrupted access and aren&apos;t liable for loss caused by
            downtime, data loss, or a lost link. Keep a copy of anything
            irreplaceable.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms as the product changes. Continuing to
            use {BRAND} after an update means you accept the new terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:mzaheen3307@gmail.com" className="underline underline-offset-4">
              mzaheen3307@gmail.com
            </a>
            .
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
