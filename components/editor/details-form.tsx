"use client";

import { useActionState } from "react";
import { saveDetails, type ActionResult } from "@/app/dashboard/actions";
import { tierConfig } from "@/lib/tiers";
import type { Site, ThemeName } from "@/lib/types";
import { Field, Section, buttonClass, inputClass } from "./ui";

const initial: ActionResult = { ok: true };

const THEMES: { name: ThemeName; label: string; swatch: string[] }[] = [
  { name: "blush", label: "Blush", swatch: ["#fffaf8", "#fbeef0", "#b5647c"] },
  { name: "midnight", label: "Midnight", swatch: ["#14161f", "#1c1f2b", "#c9a86a"] },
  { name: "sage", label: "Sage", swatch: ["#fbfdfa", "#eaf1ea", "#5f7d63"] },
  { name: "gold", label: "Gold", swatch: ["#fdfaf3", "#f6eeda", "#a3813a"] },
];

export default function DetailsForm({ site }: { site: Site }) {
  const [state, formAction, pending] = useActionState(saveDetails, initial);
  const isWedding = site.mode === "wedding";
  const config = tierConfig(site.tier);

  return (
    <form action={formAction}>
      <input type="hidden" name="site_id" value={site.id} />

      <Section title="The basics">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="One of you" htmlFor="partner_one">
              <input
                id="partner_one"
                name="partner_one"
                defaultValue={site.partner_one}
                required
                className={inputClass}
              />
            </Field>
            <Field label="And the other" htmlFor="partner_two">
              <input
                id="partner_two"
                name="partner_two"
                defaultValue={site.partner_two}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            label="Web address"
            htmlFor="slug"
            hint={
              site.is_paid
                ? "Locked, because invitations may already carry this link."
                : "Locks once your page goes live."
            }
          >
            <div className="flex items-center border border-line bg-card focus-within:border-accent">
              <span className="shrink-0 py-2.5 pl-3.5 text-sm text-muted">
                /
              </span>
              <input
                id="slug"
                name="slug"
                defaultValue={site.slug}
                readOnly={site.is_paid}
                className="w-full bg-transparent py-2.5 pr-3.5 text-sm outline-none read-only:text-muted"
              />
            </div>
          </Field>

          <Field
            label="A line about the two of you"
            htmlFor="tagline"
            hint="Sits under your names. Keep it short."
          >
            <input
              id="tagline"
              name="tagline"
              defaultValue={site.tagline}
              placeholder="Two families, one happy evening"
              className={inputClass}
            />
          </Field>

          <Field
            label={isWedding ? "The date" : "The date that matters"}
            htmlFor="event_date"
          >
            <input
              id="event_date"
              name="event_date"
              type="date"
              defaultValue={site.event_date ?? ""}
              className={`${inputClass} max-w-56`}
            />
          </Field>
        </div>
      </Section>

      <Section
        title={isWedding ? "Your story" : "Your letter"}
        hint="Leave a blank line between paragraphs."
      >
        <textarea
          name="story"
          rows={8}
          defaultValue={site.story}
          placeholder="We met on a Tuesday, which felt ordinary at the time…"
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </Section>

      <Section
        title="Look and feel"
        hint={
          config.themes.length < THEMES.length
            ? "Premium unlocks every colour theme."
            : undefined
        }
      >
        <fieldset>
          <legend className="sr-only">Colour theme</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {THEMES.map((theme) => {
              const locked = !config.themes.includes(theme.name);
              return (
                <label
                  key={theme.name}
                  className={`border border-line bg-card p-3 transition-colors ${
                    locked
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer has-checked:border-accent has-checked:bg-accent-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.name}
                    disabled={locked}
                    defaultChecked={site.theme === theme.name}
                    className="sr-only"
                  />
                  <span className="flex gap-1" aria-hidden>
                    {theme.swatch.map((colour) => (
                      <span
                        key={colour}
                        className="h-7 flex-1 border border-black/5"
                        style={{ background: colour }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 text-xs tracking-wide">
                    {theme.label}
                    {locked && (
                      <span className="text-[0.6rem] tracking-[0.1em] text-muted uppercase">
                        Premium
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Section>

      {isWedding && !config.rsvp && (
        <Section title="Guests">
          <p className="border border-dashed border-line px-5 py-6 text-sm leading-relaxed text-muted">
            RSVPs and the event schedule are part of the Standard and Premium
            packages. Message us to upgrade and they&apos;ll appear here.
          </p>
        </Section>
      )}

      {isWedding && config.rsvp && (
        <Section title="Guests">
          <div className="space-y-5">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="rsvp_enabled"
                defaultChecked={site.rsvp_enabled}
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <span className="text-sm">Collect RSVPs on my page</span>
                <span className="mt-0.5 block text-xs text-muted">
                  Replies appear in your dashboard. Guests never see them.
                </span>
              </span>
            </label>

            <Field label="Reply by" htmlFor="rsvp_deadline">
              <input
                id="rsvp_deadline"
                name="rsvp_deadline"
                type="date"
                defaultValue={site.rsvp_deadline ?? ""}
                className={`${inputClass} max-w-56`}
              />
            </Field>

            <Field
              label="A note about the venues"
              htmlFor="venue_note"
              hint="Parking, dress code, directions. Anything guests ask twice."
            >
              <textarea
                id="venue_note"
                name="venue_note"
                rows={3}
                defaultValue={site.venue_note}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </Section>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.message && (
          <span
            role="status"
            className={`text-sm ${state.ok ? "text-muted" : "text-accent"}`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
