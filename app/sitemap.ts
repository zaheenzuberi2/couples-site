import type { MetadataRoute } from "next";
import { siteUrl, isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Static pages plus every live couple page (paid + published). Uses the
 * service-role client since this needs to list slugs across all owners, not
 * just the caller's own - RLS would otherwise return nothing here.
 *
 * Play rooms (/play/[slug]) are deliberately left out: they're anonymous,
 * unmoderated, throwaway UGC with no unique-content guarantee, and crawling
 * thousands of "todo list" pages would dilute the domain rather than help
 * it rank for what actually matters (the couple-website product).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/play`, changeFrequency: "monthly", priority: 0.6 },
  ];

  if (!isSupabaseConfigured) return staticRoutes;

  const db = createAdminClient();
  const { data: sites } = await db
    .from("sites")
    .select("slug, updated_at")
    .eq("is_paid", true)
    .eq("is_published", true);

  const siteRoutes: MetadataRoute.Sitemap = (sites ?? []).map((site) => ({
    url: `${base}/${site.slug}`,
    lastModified: site.updated_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...siteRoutes];
}
