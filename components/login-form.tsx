"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // window.origin keeps this correct on localhost, preview and production
        // without another env var to forget.
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });

    setBusy(false);

    if (error) {
      setError(
        error.message.toLowerCase().includes("rate")
          ? "Too many emails just now. Wait a minute and try again."
          : "We couldn't send that. Check the address and try again."
      );
      return;
    }

    setSent(email);
  }

  if (sent) {
    return (
      <div className="mt-8 border border-line bg-card p-6">
        <p className="font-display text-2xl">Check your email</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a sign-in link to <span className="text-foreground">{sent}</span>.
          It expires in an hour. Don&apos;t see it? Check your spam or
          junk folder too.
        </p>
        <button
          onClick={() => setSent(null)}
          className="mt-4 text-sm text-accent underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-8">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="w-full border border-line bg-card px-4 py-3 outline-none focus:border-accent"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full bg-accent py-3.5 text-xs tracking-[0.2em] text-white uppercase transition-opacity disabled:opacity-50"
      >
        {busy ? "Sending…" : "Email me a link"}
      </button>
    </form>
  );
}
