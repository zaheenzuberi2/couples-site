"use client";

import { useRef, useState } from "react";
import { submitPaymentProof } from "@/app/dashboard/actions";
import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_IBAN,
  BANK_NAME,
} from "@/lib/env";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { tierConfig } from "@/lib/tiers";
import type { Site } from "@/lib/types";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/**
 * The manual-payment step. Bank transfer only - there's no gateway wired in
 * (Stripe doesn't operate in Pakistan), so this shows the account to send
 * to and lets the couple attach proof. It never marks anything paid itself:
 * that stays a human decision in /admin, after actually checking the bank.
 */
export default function PaymentPanel({ site }: { site: Site }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const config = tierConfig(site.tier);
  const submittedAt = justSubmitted ? new Date().toISOString() : site.payment_submitted_at;
  const alreadySubmitted = Boolean(site.payment_screenshot) || justSubmitted;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Attach a JPG, PNG, WebP or PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 10 MB.");
      return;
    }

    setBusy(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${site.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setBusy(false);
      setError("That didn't upload. Try again.");
      return;
    }

    const body = new FormData();
    body.set("site_id", site.id);
    body.set("image_path", path);
    body.set("note", note);
    await submitPaymentProof(body);

    setBusy(false);
    setJustSubmitted(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <p className="text-sm leading-relaxed">
        You picked the <span className="font-medium">{config.name}</span>{" "}
        package, <span className="font-medium">{config.price}</span>, once.
        That buys your public address and everything the {config.name} plan
        includes, for as long as you need it.
      </p>

      <div className="mt-5 border border-line bg-background p-5">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">
          Send by bank transfer
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Account title" value={BANK_ACCOUNT_NAME} />
          <Row label="Account number" value={BANK_ACCOUNT_NUMBER} />
          <Row label="IBAN" value={BANK_IBAN} />
          <Row label="Bank" value={BANK_NAME} />
        </dl>
      </div>

      <div className="mt-5">
        {alreadySubmitted ? (
          <div className="border border-line bg-background p-5 text-sm">
            <p className="font-medium">Screenshot received</p>
            <p className="mt-1 text-muted">
              {submittedAt
                ? `Sent ${formatDate(submittedAt)}. `
                : ""}
              We&apos;ll switch your page on once we&apos;ve checked it against the
              account, usually the same day.
            </p>
            <label
              htmlFor="payment-proof-input"
              className="mt-3 inline-block cursor-pointer text-xs tracking-[0.14em] text-accent uppercase underline underline-offset-4"
            >
              {busy ? "Uploading…" : "Send a different screenshot"}
            </label>
          </div>
        ) : (
          <p className="text-sm text-muted">
            After you&apos;ve sent it, attach a screenshot of the transfer below
            so we can match it to your page.
          </p>
        )}

        <input
          ref={inputRef}
          id="payment-proof-input"
          type="file"
          accept={ACCEPTED.join(",")}
          disabled={busy}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="sr-only"
        />

        {!alreadySubmitted && (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anything that helps us match it: reference number, sender name…"
              className="mt-3 w-full resize-none border border-line bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
            <label
              htmlFor="payment-proof-input"
              className={`mt-3 inline-block cursor-pointer border border-line px-5 py-2.5 text-xs tracking-[0.16em] uppercase hover:border-accent hover:text-accent ${
                busy ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {busy ? "Uploading…" : "Attach screenshot"}
            </label>
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-accent">
            {error}
          </p>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
