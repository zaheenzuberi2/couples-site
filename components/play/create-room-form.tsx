"use client";

import { useActionState } from "react";
import { createRoom, type ActionResult } from "@/app/play/actions";
import { PlayButton, PlayCard, playInputClass } from "@/components/play/ui";

const initial: ActionResult = { ok: true };

export default function CreateRoomForm() {
  const [state, formAction, pending] = useActionState(createRoom, initial);

  return (
    <PlayCard className="mx-auto max-w-md">
      <form action={formAction} className="space-y-4">
        <label
          htmlFor="title"
          className="block text-sm font-semibold"
          style={{ color: "#3a3230" }}
        >
          What&apos;s this for?
        </label>
        <input
          id="title"
          name="title"
          required
          autoFocus
          placeholder="Sarah & Ali's bucket list"
          className={playInputClass}
        />

        {state.message && !state.ok && (
          <p role="alert" className="text-sm" style={{ color: "#ff6f81" }}>
            {state.message}
          </p>
        )}

        <PlayButton type="submit" disabled={pending} className="w-full">
          {pending ? "Making your link…" : "Create my link"}
        </PlayButton>
      </form>
    </PlayCard>
  );
}
