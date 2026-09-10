"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";

/**
 * Every admin action re-checks the caller. Server Actions are reachable by
 * anyone who can guess the action id, so gating the page is not enough.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorised");
  }
  return user;
}

/**
 * The manual payment switch. Flip it after a bank transfer clears; a payment
 * gateway would call the same thing from its webhook.
 */
export async function setPaid(formData: FormData): Promise<void> {
  await requireAdmin();

  const siteId = String(formData.get("site_id") ?? "");
  const paid = formData.get("paid") === "true";
  if (!siteId) return;

  const db = createAdminClient();

  // Marking a site paid publishes it too - a couple who has paid should not
  // have to find a second button. Un-paying takes it straight back down.
  await db
    .from("sites")
    .update({ is_paid: paid, is_published: paid })
    .eq("id", siteId);

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

/**
 * Permanently removes a site: the row (which cascades to its photos,
 * timeline, bucket list and quiz via foreign keys) plus every file it owns
 * in both storage buckets, since those aren't linked by a foreign key and
 * would otherwise sit there orphaned forever. Irreversible - the confirm
 * dialog on the button is the only safety net, there's no undo here.
 */
export async function deleteSite(formData: FormData): Promise<void> {
  await requireAdmin();

  const siteId = String(formData.get("site_id") ?? "");
  if (!siteId) return;

  const db = createAdminClient();

  for (const bucket of ["couple-photos", "payment-proofs"] as const) {
    const { data: files } = await db.storage.from(bucket).list(siteId);
    if (files && files.length > 0) {
      await db.storage
        .from(bucket)
        .remove(files.map((f) => `${siteId}/${f.name}`));
    }
  }

  await db.from("sites").delete().eq("id", siteId);

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

/**
 * Clears a "call me back" request off the admin list once it has been
 * actioned. Toggles rather than deletes, so the number stays on record.
 */
export async function setContactHandled(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (!id) return;

  const db = createAdminClient();
  await db.from("contact_requests").update({ handled }).eq("id", id);

  revalidatePath("/admin");
}
