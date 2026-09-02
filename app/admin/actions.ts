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
