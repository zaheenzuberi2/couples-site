"use client";

import { useActionState, useState } from "react";
import { createSite, type ActionResult } from "@/app/dashboard/actions";
import { suggestSlug } from "@/lib/slug";
import { TIER_ORDER, TIERS } from "@/lib/tiers";
import type { Tier } from "@/lib/types";
import { Field, buttonClass, inputClass } from "./ui";

const initial: ActionResult = { ok: true };

export default function CreateSiteForm() {
  const [state, formAction, pending] = useActionState(createSite, initial);
  const [mode, setMode] = useState<"wedding" | "keepsake">("wedding");
  const [tier, setTier] = useState<Tier>("standard");
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  // The address writes itself from the two names until the couple edits it.
  const effectiveSlug = slugTouched ? slug : suggestSlug(one, two);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-4xl">Let&apos;s make your page</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Two names and a web address is all we need to start. Photos, your
        story and the schedule come next, and nothing is final.
      </p>

      <form action={formAction} className="mt-10 space-y-6">
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="tier" value={tier} />
        <input type="hidden" name="slug" value={effectiveSlug} />

        <fieldset>
          <legend className="block text-xs tracking-[0.16em] text-muted uppercase">
            What is this page for?
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ModeCard
              selected={mode === "wedding"}
              onClick={() => setMode("wedding")}
              title="Wedding"
              body="Invitation, event schedule and RSVPs from your guests."
            />
            <ModeCard
              selected={mode === "keepsake"}
              onClick={() => setMode("keepsake")}
              title="Keepsake"
              body="Your story and your photos, laid out as a gift page. No guest list."
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-xs tracking-[0.16em] text-muted uppercase">
            Which package?
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {TIER_ORDER.map((t) => (
              <TierCard
                key={t}
                selected={tier === t}
                onClick={() => setTier(t)}
                name={TIERS[t].name}
                price={TIERS[t].price}
                tagline={TIERS[t].tagline}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            You can start on any package. We&apos;ll confirm it when you message
            us to go live.
          </p>
        </fieldset>

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
          hint="Lowercase letters, numbers and hyphens. You can change this until your page goes live."
        >
          <div className="flex items-center border border-line bg-card focus-within:border-accent">
            <span className="shrink-0 py-2.5 pl-3.5 text-sm text-muted">/</span>
            <input
              id="slug_input"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="sarah-and-ali"
              className="w-full bg-transparent py-2.5 pr-3.5 text-sm outline-none"
            />
          </div>
        </Field>

        {state.message && !state.ok && (
          <p role="alert" className="text-sm text-accent">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Creating…" : "Create my page"}
        </button>
      </form>
    </div>
  );
}

function TierCard({
  selected,
  onClick,
  name,
  price,
  tagline,
}: {
  selected: boolean;
  onClick: () => void;
  name: string;
  price: string;
  tagline: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`border p-4 text-left transition-colors ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-line bg-card hover:border-accent"
      }`}
    >
      <span className="font-display text-lg">{name}</span>
      <span className="mt-0.5 block text-sm font-medium">{price}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted">
        {tagline}
      </span>
    </button>
  );
}

function ModeCard({
  selected,
  onClick,
  title,
  body,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`border p-4 text-left transition-colors ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-line bg-card hover:border-accent"
      }`}
    >
      <span className="font-display text-xl">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted">
        {body}
      </span>
    </button>
  );
}
