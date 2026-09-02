import Link from "next/link";
import { BRAND } from "@/lib/env";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md">
        <p className="text-xs tracking-[0.28em] text-muted uppercase">
          Nothing here
        </p>
        <h1 className="mt-5 font-display text-5xl">Page not found</h1>
        <p className="mt-4 leading-relaxed text-muted">
          This address doesn&apos;t belong to anyone yet — or the couple hasn&apos;t made
          their page public.
        </p>
        <Link
          href="/"
          className="mt-9 inline-block border border-line px-7 py-3 text-xs tracking-[0.2em] uppercase hover:border-accent hover:text-accent"
        >
          Go to {BRAND}
        </Link>
      </div>
    </main>
  );
}
