import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/env";
import { confirmSignIn } from "./actions";

export const metadata: Metadata = {
  title: "Confirm sign-in",
  robots: { index: false, follow: false },
};

/**
 * Where a magic-link email actually lands. Rendering this page never touches
 * Supabase - it only reads the code out of the URL and hands it to a form.
 * The exchange itself happens in confirmSignIn, which only runs on a real
 * click. See that file for why the split exists.
 */
export default async function ConfirmSignInPage({
  searchParams,
}: PageProps<"/auth/confirm">) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : "";
  const next = typeof params.next === "string" ? params.next : "/dashboard";

  if (!code) redirect("/login?error=missing_code");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2.5 font-display text-3xl">
          <BrandMark size={26} color="var(--accent)" />
          {BRAND}
        </div>

        <h1 className="mt-8 font-display text-4xl">Finish signing in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          One more tap to confirm it&apos;s really you.
        </p>

        <form action={confirmSignIn} className="mt-8">
          <input type="hidden" name="code" value={code} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="w-full bg-accent py-3.5 text-xs font-medium tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
          >
            Confirm sign-in
          </button>
        </form>
      </div>
    </main>
  );
}
