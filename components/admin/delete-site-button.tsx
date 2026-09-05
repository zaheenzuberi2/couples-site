"use client";

import { deleteSite } from "@/app/admin/actions";

/**
 * The one genuinely irreversible action in the admin panel. A plain confirm()
 * is the entire safety net - deliberately lighter than a "type DELETE to
 * confirm" flow since this is a single-operator tool, not a multi-tenant one.
 */
export default function DeleteSiteButton({
  siteId,
  coupleName,
}: {
  siteId: string;
  coupleName: string;
}) {
  return (
    <form
      action={deleteSite}
      onSubmit={(e) => {
        if (
          !confirm(
            `Permanently delete ${coupleName}'s website? Their photos, RSVPs and payment proof all go with it. This can't be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="site_id" value={siteId} />
      <button
        type="submit"
        className="text-xs tracking-[0.14em] text-muted uppercase hover:text-red-700"
      >
        Delete
      </button>
    </form>
  );
}
