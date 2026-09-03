import type { ReactNode } from "react";

/** Shared chrome for the editor, so every section looks like one product. */

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs tracking-[0.16em] text-muted uppercase"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

// text-base (16px), not text-sm - anything smaller makes iOS Safari zoom the
// whole viewport in on focus, which is exactly the kind of thing that makes
// a site feel like a web page and not an app.
export const inputClass =
  "w-full border border-line bg-card px-3.5 py-2.5 text-base outline-none focus:border-accent sm:text-sm";

export const buttonClass =
  "bg-accent px-6 py-3 text-xs tracking-[0.2em] text-white uppercase transition-opacity disabled:opacity-50";

export const ghostButtonClass =
  "border border-line px-4 py-2 text-xs tracking-[0.16em] uppercase text-muted hover:border-accent hover:text-accent";
