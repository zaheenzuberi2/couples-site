"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactResult = { ok: boolean; message: string };

/** Digits, spaces, dashes, brackets and one leading plus. 6 to 20 digits. */
function looksLikePhone(raw: string): boolean {
  if (!/^[+\d][\d\s()-]*$/.test(raw)) return false;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 20;
}

/**
 * The help chatbot's "have someone call me" box. Writes one row to
 * contact_requests via the service-role client (there is no session here,
 * and no RLS policy lets the anon key near this table), which the owner
 * clears from /admin. Kept deliberately small: a number, an optional name
 * and note, and the page it came from so a reply has context.
 */
export async function submitContactRequest(
  formData: FormData
): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const message = String(formData.get("message") ?? "").trim().slice(0, 1000);
  const page = String(formData.get("page") ?? "").trim().slice(0, 200);

  if (!phone) {
    return { ok: false, message: "Add a phone number so we can reach you." };
  }
  if (!looksLikePhone(phone)) {
    return {
      ok: false,
      message: "That number looks off. Include the country code, digits only.",
    };
  }

  try {
    const db = createAdminClient();
    const { error } = await db
      .from("contact_requests")
      .insert({ name, phone, message, page });

    if (error) {
      return { ok: false, message: "Could not send that just now. Try again." };
    }
  } catch {
    return { ok: false, message: "Could not send that just now. Try again." };
  }

  revalidatePath("/admin");
  return {
    ok: true,
    message: "Got it. We will call or message that number, usually within a day.",
  };
}
