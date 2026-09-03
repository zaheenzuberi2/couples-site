import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CouplePage from "@/components/couple-page";
import { getSiteByPreviewToken } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { tierConfig } from "@/lib/tiers";

/**
 * Private preview. The token in the URL is the only credential, so this page
 * must never be indexed and never be linked to publicly.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: PageProps<"/preview/[token]">) {
  const { token } = await params;
  const bundle = await getSiteByPreviewToken(token);

  if (!bundle) notFound();

  const { site } = bundle;
  const live = site.is_paid && site.is_published;
  const publicUrl = `${siteUrl()}/${site.slug}`;
  const price = tierConfig(site.tier).price;

  return (
    <>
      {/* Banner is outside [data-theme] so it never inherits the couple's palette. */}
      <div className="pt-safe sticky top-0 z-50 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 text-sm">
          {live ? (
            <>
              <span className="font-medium text-accent">● Live</span>
              <a
                href={`/${site.slug}`}
                className="truncate text-muted underline underline-offset-4"
              >
                {publicUrl}
              </a>
            </>
          ) : (
            <>
              <span className="font-medium">Preview</span>
              <span className="text-muted">
                Only people with this link can see it.{" "}
                {site.is_paid
                  ? "Publish it to go live."
                  : `Go live at ${publicUrl.replace(/^https?:\/\//, "")} for ${price}.`}
              </span>
            </>
          )}
          <Link
            href="/dashboard"
            className="ml-auto shrink-0 rounded-full bg-accent px-4 py-1.5 text-xs tracking-wide text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      <CouplePage bundle={bundle} />
    </>
  );
}
