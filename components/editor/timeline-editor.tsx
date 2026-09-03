import {
  addTimelineEntry,
  deleteTimelineEntry,
  saveTimelineEntry,
} from "@/app/dashboard/actions";
import type { TimelineEntry } from "@/lib/types";
import { Field, Section, ghostButtonClass, inputClass } from "./ui";

export default function TimelineEditor({
  siteId,
  entries,
}: {
  siteId: string;
  entries: TimelineEntry[];
}) {
  return (
    <Section
      title="How it happened"
      hint="The moments worth keeping: first meeting, first trip, the proposal."
    >
      {entries.length === 0 && (
        <p className="mb-6 border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          Nothing here yet. This section stays hidden on your page until you add
          a moment.
        </p>
      )}

      <div className="space-y-6">
        {entries.map((entry) => (
          <form
            key={entry.id}
            action={saveTimelineEntry}
            className="border border-line bg-card p-5"
          >
            <input type="hidden" name="site_id" value={siteId} />
            <input type="hidden" name="entry_id" value={entry.id} />

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label="What happened" htmlFor={`t-title-${entry.id}`}>
                <input
                  id={`t-title-${entry.id}`}
                  name="title"
                  defaultValue={entry.title}
                  placeholder="The day we met"
                  className={inputClass}
                />
              </Field>

              <Field label="When" htmlFor={`t-date-${entry.id}`}>
                <input
                  id={`t-date-${entry.id}`}
                  name="happened_on"
                  type="date"
                  defaultValue={entry.happened_on ?? ""}
                  className={`${inputClass} sm:w-48`}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Tell it" htmlFor={`t-body-${entry.id}`}>
                <textarea
                  id={`t-body-${entry.id}`}
                  name="body"
                  rows={3}
                  defaultValue={entry.body}
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="submit" className={ghostButtonClass}>
                Save
              </button>
              <button
                type="submit"
                formAction={deleteTimelineEntry}
                className="text-xs tracking-[0.16em] text-muted uppercase hover:text-accent"
              >
                Remove
              </button>
            </div>
          </form>
        ))}
      </div>

      <form action={addTimelineEntry} className="mt-6 flex flex-wrap gap-3">
        <input type="hidden" name="site_id" value={siteId} />
        <input
          name="title"
          placeholder="Add a moment (e.g. The proposal)"
          className={`${inputClass} max-w-xs flex-1`}
        />
        <button type="submit" className={ghostButtonClass}>
          Add
        </button>
      </form>
    </Section>
  );
}
