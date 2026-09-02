/**
 * Slugs sit at the root of the domain (yoursite.com/sarah-and-ali), so they
 * share a namespace with the app's own routes. Anything the app uses - now or
 * plausibly later - is reserved.
 */
const RESERVED = new Set([
  "admin",
  "api",
  "auth",
  "dashboard",
  "login",
  "logout",
  "signup",
  "preview",
  "pricing",
  "about",
  "contact",
  "help",
  "support",
  "terms",
  "privacy",
  "blog",
  "settings",
  "account",
  "billing",
  "new",
  "edit",
  "static",
  "public",
  "assets",
  "images",
  "favicon",
  "robots",
  "sitemap",
  "well-known",
  "rsvp",
  "gallery",
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** "Sarah" + "Ali" -> "sarah-and-ali" */
export function suggestSlug(partnerOne: string, partnerTwo: string): string {
  const a = slugify(partnerOne);
  const b = slugify(partnerTwo);
  if (a && b) return `${a}-and-${b}`;
  return a || b || "";
}

export type SlugCheck = { ok: true } | { ok: false; reason: string };

export function validateSlug(slug: string): SlugCheck {
  if (!slug) return { ok: false, reason: "Pick a web address for your page." };
  if (slug.length < 3)
    return { ok: false, reason: "That is too short - use at least 3 characters." };
  if (slug.length > 60)
    return { ok: false, reason: "That is too long - keep it under 60 characters." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return {
      ok: false,
      reason: "Use lowercase letters, numbers and hyphens only.",
    };
  if (RESERVED.has(slug))
    return { ok: false, reason: `"${slug}" is reserved. Try something else.` };
  return { ok: true };
}

export function isReserved(slug: string): boolean {
  return RESERVED.has(slug);
}
