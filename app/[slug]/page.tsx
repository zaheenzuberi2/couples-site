import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CouplePage from "@/components/couple-page";
import { getPublicSite, photoUrl } from "@/lib/data";
import { formatDate } from "@/lib/format";

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
  const title =
    site.mode === "wedding" && site.event_date
      ? `${names}, ${formatDate(site.event_date)}`
      : names;

  const image = photoUrl(site.hero_photo ?? bundle.photos[0]?.image_path);

  return {
    title,
    description: site.tagline || site.story.slice(0, 160) || names,
    openGraph: {
      title,
      description: site.tagline || names,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: site.tagline || names,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const bundle = await getPublicSite(slug);

  if (!bundle) notFound();

  return <CouplePage bundle={bundle} />;
}
