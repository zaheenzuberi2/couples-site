/**
 * Central place for configuration.
 *
 * Deliberately forgiving: every value that CAN be derived at runtime is
 * derived rather than required, so a missing env var never takes the site
 * down in production. Only the two Supabase keys are genuinely required.
 */

/** Supabase project URL. */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * The public client key. Supabase renamed "anon key" to "publishable key",
 * and dashboards now show either depending on project age, so accept both.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/** Server-only. Bypasses RLS - never expose to the browser. */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the app has enough config to talk to Supabase at all. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Absolute origin of this deployment, used for magic-link redirects and
 * for showing couples their shareable URL.
 *
 * Derived in this order so it works with zero configuration:
 *   1. NEXT_PUBLIC_SITE_URL      - set this once you have a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL - stable production host on Vercel
 *   3. VERCEL_URL                - per-deployment host (preview builds)
 *   4. localhost                 - local dev
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Emails allowed into /admin (comma-separated in ADMIN_EMAILS).
 * Comparison is case-insensitive and whitespace-tolerant.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmails();
  // No admin configured = no admin access, rather than everyone being admin.
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

/**
 * Package prices, display only - the actual feature limits per tier live in
 * lib/tiers.ts. Kept as env vars so a price change never needs a deploy.
 */
export const PRICE_BASIC = process.env.NEXT_PUBLIC_PRICE_BASIC ?? "PKR 3,500";
export const PRICE_STANDARD =
  process.env.NEXT_PUBLIC_PRICE_STANDARD ?? "PKR 5,000";
export const PRICE_PREMIUM =
  process.env.NEXT_PUBLIC_PRICE_PREMIUM ?? "PKR 7,500";

/** Product name, so rebranding is a one-line change. */
export const BRAND = process.env.NEXT_PUBLIC_BRAND ?? "Ours";

/**
 * Bank details shown to a couple when they're ready to pay. Manual transfer
 * is the only payment path today - see [[couples-website-builder]] memory
 * for why (Stripe doesn't operate in Pakistan). Env-overridable so the
 * account on file never needs a code change.
 */
export const BANK_ACCOUNT_NAME =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "Muhammad Zaheen Zubairi";
export const BANK_ACCOUNT_NUMBER =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "00300114712815";
export const BANK_IBAN =
  process.env.NEXT_PUBLIC_BANK_IBAN ?? "PK15MEZN0000300114712815";
export const BANK_NAME =
  process.env.NEXT_PUBLIC_BANK_NAME ?? "Meezan Bank — Digital Centre";
