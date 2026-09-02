"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; attending: boolean }
  | { kind: "error"; message: string };

/**
 * Guests submit straight to Supabase with the anon key. The "guest submits
 * rsvp" RLS policy is what allows the insert, and only for a site that is
 * live and has RSVPs switched on - so there is nothing to protect here
 * beyond basic input sanity.
 */
export default function RsvpForm({ siteId }: { siteId: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [attending, setAttending] = useState(true);

  async function handleSubmit(formData: FormData) {
    const guestName = String(formData.get("guest_name") ?? "").trim();
    if (!guestName) {
      setStatus({ kind: "error", message: "Please tell us your name." });
      return;
    }

    setStatus({ kind: "sending" });

    const partySizeRaw = Number(formData.get("party_size") ?? 1);
    const partySize = Number.isFinite(partySizeRaw)
      ? Math.min(20, Math.max(1, Math.trunc(partySizeRaw)))
      : 1;

    const supabase = createClient();
    const { error } = await supabase.from("rsvps").insert({
      site_id: siteId,
      guest_name: guestName,
      guest_email: String(formData.get("guest_email") ?? "").trim(),
      attending,
      party_size: attending ? partySize : 1,
      message: String(formData.get("message") ?? "").trim(),
    });

    if (error) {
      setStatus({
        kind: "error",
        message: "That didn't go through. Please try again in a moment.",
      });
      return;
    }

    setStatus({ kind: "done", attending });
  }

  if (status.kind === "done") {
    return (
      <div
        className="mt-10 border p-10 text-center"
        style={{ borderColor: "var(--rule)" }}
      >
        <p className="display text-3xl">Thank you</p>
        <p className="mt-3 text-sm" style={{ color: "var(--whisper)" }}>
          {status.attending
            ? "We can't wait to celebrate with you."
            : "We'll miss you. Thank you for letting us know."}
        </p>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form action={handleSubmit} className="mt-10 space-y-6">
      <Field label="Your name" htmlFor="guest_name">
        <input
          id="guest_name"
          name="guest_name"
          required
          autoComplete="name"
          className="w-full border-b bg-transparent py-2.5 outline-none focus:border-b-2"
          style={{ borderColor: "var(--rule)" }}
        />
      </Field>

      <Field label="Email (optional)" htmlFor="guest_email">
        <input
          id="guest_email"
          name="guest_email"
          type="email"
          autoComplete="email"
          className="w-full border-b bg-transparent py-2.5 outline-none focus:border-b-2"
          style={{ borderColor: "var(--rule)" }}
        />
      </Field>

      <fieldset>
        <legend className="eyebrow">Will you be there?</legend>
        <div className="mt-3 flex gap-3">
          <Choice
            selected={attending}
            onClick={() => setAttending(true)}
            label="Joyfully accepts"
          />
          <Choice
            selected={!attending}
            onClick={() => setAttending(false)}
            label="Regretfully declines"
          />
        </div>
      </fieldset>

      {attending && (
        <Field label="How many of you?" htmlFor="party_size">
          <input
            id="party_size"
            name="party_size"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
            className="w-24 border-b bg-transparent py-2.5 outline-none focus:border-b-2"
            style={{ borderColor: "var(--rule)" }}
          />
        </Field>
      )}

      <Field label="A note for the couple (optional)" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full resize-none border-b bg-transparent py-2.5 outline-none focus:border-b-2"
          style={{ borderColor: "var(--rule)" }}
        />
      </Field>

      {status.kind === "error" && (
        <p role="alert" className="text-sm" style={{ color: "#b3261e" }}>
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full py-3.5 text-xs tracking-[0.22em] uppercase transition-opacity disabled:opacity-50"
        style={{ background: "var(--gilt)", color: "var(--paper)" }}
      >
        {sending ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow block">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Choice({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex-1 border px-4 py-3 text-xs tracking-[0.14em] uppercase transition-colors"
      style={{
        borderColor: selected ? "var(--gilt)" : "var(--rule)",
        background: selected ? "var(--gilt)" : "transparent",
        color: selected ? "var(--paper)" : "var(--whisper)",
      }}
    >
      {label}
    </button>
  );
}
