"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Does the actual token exchange - deliberately only reachable via a real
 * form submit (POST), never the GET that renders the confirm page. Email
 * security scanners (Outlook Safe Links, corporate gateways, etc.) fetch
 * links with a plain GET to check them for safety, which was silently
 * burning the single-use magic-link code before the person ever saw the
 * email. They don't submit forms, so gating the exchange behind a click
 * here keeps the code alive for the person who actually opens it.
 */
export async function confirmSignIn(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "");
  const requestedNext = String(formData.get("next") ?? "/dashboard");

  // Only ever redirect within this app - an open redirect here would let a
  // crafted magic link bounce a freshly-authenticated user off-site.
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  if (!code) redirect("/login?error=missing_code");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) redirect("/login?error=expired");
  redirect(next);
}
