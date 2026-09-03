import "server-only";

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Site, SiteBundle, SitePhoto, TimelineEntry } from "@/lib/types";

// loadChildren runs the same queries against either the anon server client
// or the service-role admin client - both are plain SupabaseClient instances,
// just constructed with different keys.
type AnyClient = SupabaseClient;

/** Pull a site's children in parallel. */
async function loadChildren(
  db: AnyClient,
  siteId: string
): Promise<Omit<SiteBundle, "site">> {
  const [photos, timeline] = await Promise.all([
    db
      .from("site_photos")
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true }),
    db
      .from("site_timeline")
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    photos: (photos.data ?? []) as SitePhoto[],
    timeline: (timeline.data ?? []) as TimelineEntry[],
  };
}

/**
 * Public page lookup. Uses the anon client on purpose: RLS is what enforces
 * "paid and published", so an unpaid site is invisible here even if someone
 * guesses the slug.
 */
export const getPublicSite = cache(async function getPublicSite(
  slug: string
): Promise<SiteBundle | null> {
  if (!isSupabaseConfigured) return null;
  const db = await createClient();

  const { data: site } = await db
    .from("sites")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!site) return null;

  const children = await loadChildren(db, site.id);
  return { site: site as Site, ...children };
});

/**
 * Private preview lookup by unguessable token. Uses the service role because
 * the whole point is to show a site that is NOT yet paid for.
 *
 * The token is the credential, so it must match exactly - never fall back to
 * a partial match or a slug lookup here.
 */
export const getSiteByPreviewToken = cache(async function getSiteByPreviewToken(
  token: string
): Promise<SiteBundle | null> {
  if (!token || token.length < 8) return null;
  if (!isSupabaseConfigured) return null;

  const db = createAdminClient();

  const { data: site } = await db
    .from("sites")
    .select("*")
    .eq("preview_token", token)
    .maybeSingle();

  if (!site) return null;

  const children = await loadChildren(db, site.id);
  return { site: site as Site, ...children };
});

/** The signed-in user's site, if they have one. */
export async function getMySite(): Promise<SiteBundle | null> {
  if (!isSupabaseConfigured) return null;
  const db = await createClient();

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data: site } = await db
    .from("sites")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!site) return null;

  const children = await loadChildren(db, site.id);
  return { site: site as Site, ...children };
}

/**
 * Public URL for a file in the couple-photos bucket.
 * Re-exported from lib/photo-url so server and client share one implementation.
 */
export { photoUrlClient as photoUrl } from "@/lib/photo-url";
