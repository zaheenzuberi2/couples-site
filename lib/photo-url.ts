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
  // Already absolute - use as-is.
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/couple-photos/${imagePath}`;
}
