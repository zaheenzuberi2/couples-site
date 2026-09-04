import { SUPABASE_URL } from "@/lib/env";

/**
 * Public URL for a file in the couple-photos bucket.
 *
 * Lives in its own module (not lib/data.ts) because the photo manager is a
 * Client Component, and lib/data.ts is marked "server-only".
 */
export function photoUrlClient(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;
  // Already absolute, or a local /public asset (used by the /demo page,
  // which has no real Supabase row behind it) - use as-is either way.
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith("/"))
    return imagePath;
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/couple-photos/${imagePath}`;
}
