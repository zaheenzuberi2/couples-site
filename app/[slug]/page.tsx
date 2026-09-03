import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import CouplePage from "@/components/couple-page";
import { getPublicSite } from "@/lib/data";
import { THEME_PAPER_COLOR } from "@/lib/theme-colors";

/**
 * The couple's public page, at the root of the domain: /sarah-and-ali
 *
 * RLS (not this file) is what keeps unpaid pages private - getPublicSite uses
 * the anon key, so an unpaid slug simply returns nothing and 404s.
 */

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPublicSite(slug);

  if (!bundle) return { title: "Not found" };

  const { site } = bundle;
  const names = [site.partner_one, site.partner_two]
    .filter(Boolean)
    .join(" & ");

  return {
    title: names,
    description: site.tagline || site.story.slice(0, 160) || names,
    // No manual openGraph.images/twitter.images here on purpose - the
    // opengraph-image.tsx file in this same segment generates a themed
    // card automatically, and Twitter falls back to og:image on its own
    // when twitter:image is absent.
    openGraph: {
      title: names,
      description: site.tagline || names,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: names,
      description: site.tagline || names,
    },
  };
}

export async function generateViewport({
  params,
}: PageProps<"/[slug]">): Promise<Viewport> {
  const { slug } = await params;
  const bundle = await getPublicSite(slug);
  if (!bundle) return {};

  const theme = bundle.site.theme;
  const color = THEME_PAPER_COLOR[theme];
  return {
    themeColor: color,
    colorScheme: theme === "midnight" ? "dark" : "light",
    viewportFit: "cover",
  };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const bundle = await getPublicSite(slug);

  if (!bundle) notFound();

  return <CouplePage bundle={bundle} />;
}
