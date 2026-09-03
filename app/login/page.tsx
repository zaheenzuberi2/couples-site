import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import LoginForm from "@/components/login-form";
import { BRAND, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  const { error } = await searchParams;

  const errorMessage =
    error === "expired"
      ? "That link has expired. Send yourself a fresh one."
      : error === "missing_code"
        ? "That link was incomplete. Try again."
        : null;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 font-display text-3xl">
          <BrandMark size={26} color="var(--accent)" />
          {BRAND}
        </Link>

        <h1 className="mt-8 font-display text-4xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter your email and we&apos;ll send you a link. No password to remember,
          you have enough to plan already.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mt-6 border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm"
          >
            {errorMessage}
          </p>
        )}

        <LoginForm />
      </div>
    </main>
  );
}
