"use client";

import { useActionState, useState } from "react";
import { createSite, type ActionResult } from "@/app/dashboard/actions";
import { suggestSlug } from "@/lib/slug";
import { Field, buttonClass, inputClass } from "./ui";

const initial: ActionResult = { ok: true };

export default function CreateSiteForm() {
  const [state, formAction, pending] = useActionState(createSite, initial);
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  // The address writes itself from the two names until the couple edits it.
  const effectiveSlug = slugTouched ? slug : suggestSlug(one, two);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-4xl">Let&apos;s make your website</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Two names and a web address is all we need to start. Photos, your
        story and the timeline come next, and nothing is final.
      </p>

      <form action={formAction} className="mt-10 space-y-6">
        <input type="hidden" name="slug" value={effectiveSlug} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="One of you" htmlFor="partner_one">
            <input
              id="partner_one"
              name="partner_one"
              required
              value={one}
              onChange={(e) => setOne(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="And the other" htmlFor="partner_two">
            <input
              id="partner_two"
              name="partner_two"
              required
              value={two}
              onChange={(e) => setTwo(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Your web address"
          htmlFor="slug_input"
          hint="Lowercase letters, numbers and hyphens. You can change this until your website goes live."
        >
          <div className="flex items-center border border-line bg-card focus-within:border-accent">
            <span className="shrink-0 py-2.5 pl-3.5 text-base text-muted sm:text-sm">/</span>
            <input
              id="slug_input"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="sarah-and-ali"
              className="w-full bg-transparent py-2.5 pr-3.5 text-base outline-none sm:text-sm"
            />
          </div>
        </Field>

        {state.message && !state.ok && (
          <p role="alert" className="text-sm text-accent">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Creating…" : "Create my website"}
        </button>
      </form>
    </div>
  );
}
