"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify, validateSlug } from "@/lib/slug";
import type { SiteMode, ThemeName } from "@/lib/types";

export type ActionResult = { ok: boolean; message?: string };

const MODES: SiteMode[] = ["wedding", "keepsake"];
const THEMES: ThemeName[] = ["blush", "midnight", "sage", "gold"];

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function nullableDate(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  return value === "" ? null : value;
}

/** Every action starts here: no session, no writes. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/**
 * Ownership is enforced twice on purpose: RLS in Postgres is the real
 * boundary, and the explicit owner_id filter here means a policy mistake
 * still can't turn into a cross-account write.
 */
async function requireOwnedSite(siteId: string) {
  const { supabase, user } = await requireUser();
  const { data: site } = await supabase
    .from("sites")
    .select("id, owner_id, is_paid, slug")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!site) redirect("/dashboard");
  return { supabase, user, site };
}

function refresh() {
  revalidatePath("/dashboard");
  revalidatePath("/preview", "layout");
}

/* ------------------------------------------------------------ create */

export async function createSite(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  const partnerOne = text(formData, "partner_one");
  const partnerTwo = text(formData, "partner_two");
  if (!partnerOne || !partnerTwo) {
    return { ok: false, message: "Both names are needed." };
  }

  const modeRaw = text(formData, "mode") as SiteMode;
  const mode: SiteMode = MODES.includes(modeRaw) ? modeRaw : "wedding";

  const slug = slugify(text(formData, "slug"));
  const check = validateSlug(slug);
  if (!check.ok) return { ok: false, message: check.reason };

  const { data: existing } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    return { ok: false, message: "That web address is taken. Try another." };
  }

  const { error } = await supabase.from("sites").insert({
    owner_id: user.id,
    slug,
    mode,
    partner_one: partnerOne,
    partner_two: partnerTwo,
  });

  if (error) {
    // Unique violation: someone claimed the slug between the check and here.
    if (error.code === "23505") {
      return { ok: false, message: "That web address was just taken." };
    }
    return { ok: false, message: "Could not create your page. Try again." };
  }

  refresh();
  redirect("/dashboard");
}

/* ------------------------------------------------------------ details */

export async function saveDetails(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const siteId = text(formData, "site_id");
  const { supabase, site } = await requireOwnedSite(siteId);

  const themeRaw = text(formData, "theme") as ThemeName;
  const theme: ThemeName = THEMES.includes(themeRaw) ? themeRaw : "blush";

  const patch: Record<string, unknown> = {
    partner_one: text(formData, "partner_one"),
    partner_two: text(formData, "partner_two"),
    tagline: text(formData, "tagline"),
    story: String(formData.get("story") ?? ""),
    event_date: nullableDate(formData, "event_date"),
    theme,
    venue_note: text(formData, "venue_note"),
    rsvp_enabled: formData.get("rsvp_enabled") === "on",
    rsvp_deadline: nullableDate(formData, "rsvp_deadline"),
  };

  // Slug changes are allowed, but a live page changing address breaks every
  // invitation already sent - so only allow it before the page goes public.
  const requestedSlug = slugify(text(formData, "slug"));
  if (requestedSlug && requestedSlug !== site.slug) {
    if (site.is_paid) {
      return {
        ok: false,
        message:
          "Your page is already live, so the web address is locked. Message us if you truly need it changed.",
      };
    }
    const check = validateSlug(requestedSlug);
    if (!check.ok) return { ok: false, message: check.reason };

    const { data: clash } = await supabase
      .from("sites")
      .select("id")
      .eq("slug", requestedSlug)
      .neq("id", siteId)
      .maybeSingle();
    if (clash) return { ok: false, message: "That web address is taken." };

    patch.slug = requestedSlug;
  }

  const { error } = await supabase.from("sites").update(patch).eq("id", siteId);
  if (error) return { ok: false, message: "Could not save. Try again." };

  refresh();
  return { ok: true, message: "Saved" };
}

/* ------------------------------------------------------------- events */

export async function addEvent(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  const { count } = await supabase
    .from("site_events")
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId);

  await supabase.from("site_events").insert({
    site_id: siteId,
    title: text(formData, "title") || "New event",
    sort_order: count ?? 0,
  });

  refresh();
}

export async function saveEvent(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  const startsAt = text(formData, "starts_at");

  await supabase
    .from("site_events")
    .update({
      title: text(formData, "title"),
      // datetime-local gives "2027-02-14T19:00" with no zone; Postgres reads
      // it in the server's zone, which is what the couple means locally.
      starts_at: startsAt === "" ? null : startsAt,
      venue: text(formData, "venue"),
      address: text(formData, "address"),
      map_url: text(formData, "map_url") || null,
      dress_code: text(formData, "dress_code"),
    })
    .eq("id", text(formData, "event_id"))
    .eq("site_id", siteId);

  refresh();
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  await supabase
    .from("site_events")
    .delete()
    .eq("id", text(formData, "event_id"))
    .eq("site_id", siteId);

  refresh();
}

/* ----------------------------------------------------------- timeline */

export async function addTimelineEntry(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  const { count } = await supabase
    .from("site_timeline")
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId);

  await supabase.from("site_timeline").insert({
    site_id: siteId,
    title: text(formData, "title") || "A moment",
    sort_order: count ?? 0,
  });

  refresh();
}

export async function saveTimelineEntry(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  await supabase
    .from("site_timeline")
    .update({
      title: text(formData, "title"),
      happened_on: nullableDate(formData, "happened_on"),
      body: String(formData.get("body") ?? ""),
    })
    .eq("id", text(formData, "entry_id"))
    .eq("site_id", siteId);

  refresh();
}

export async function deleteTimelineEntry(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  await supabase
    .from("site_timeline")
    .delete()
    .eq("id", text(formData, "entry_id"))
    .eq("site_id", siteId);

  refresh();
}

/* ------------------------------------------------------------- photos */

export async function setHeroPhoto(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase } = await requireOwnedSite(siteId);

  await supabase
    .from("sites")
    .update({ hero_photo: text(formData, "image_path") || null })
    .eq("id", siteId);

  refresh();
}

export async function deletePhoto(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase, site } = await requireOwnedSite(siteId);

  const imagePath = text(formData, "image_path");

  await supabase
    .from("site_photos")
    .delete()
    .eq("id", text(formData, "photo_id"))
    .eq("site_id", siteId);

  // Remove the file too, or storage fills with orphans nobody can see.
  if (imagePath) await supabase.storage.from("couple-photos").remove([imagePath]);

  // Clear the hero if it pointed at the photo just deleted.
  const { data: current } = await supabase
    .from("sites")
    .select("hero_photo")
    .eq("id", site.id)
    .maybeSingle();
  if (current?.hero_photo === imagePath) {
    await supabase.from("sites").update({ hero_photo: null }).eq("id", siteId);
  }

  refresh();
}

/* ------------------------------------------------------------ publish */

export async function setPublished(formData: FormData): Promise<void> {
  const siteId = text(formData, "site_id");
  const { supabase, site } = await requireOwnedSite(siteId);

  const wanted = formData.get("published") === "true";

  // The paywall. Publishing is the one thing payment actually gates, so it is
  // checked on the server rather than by hiding a button.
  if (wanted && !site.is_paid) redirect("/dashboard?upgrade=1");

  await supabase
    .from("sites")
    .update({ is_published: wanted })
    .eq("id", siteId);

  refresh();
}
