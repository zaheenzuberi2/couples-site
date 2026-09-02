import { addEvent, deleteEvent, saveEvent } from "@/app/dashboard/actions";
import { toDatetimeLocal } from "@/lib/format";
import type { SiteEvent } from "@/lib/types";
import { Field, Section, ghostButtonClass, inputClass } from "./ui";

/**
 * One form per event. Save and Delete share the form's fields via
 * `formAction`, so there is no nested-form problem and no client JS.
 */
export default function EventsEditor({
  siteId,
  events,
}: {
  siteId: string;
  events: SiteEvent[];
}) {
  return (
    <Section
      title="The celebrations"
      hint="Mehndi, barat, walima, reception. Add one card per event."
    >
      {events.length === 0 && (
        <p className="mb-6 border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          No events yet. Add your first one below.
        </p>
      )}

      <div className="space-y-6">
        {events.map((event) => (
          <form
            key={event.id}
            action={saveEvent}
            className="border border-line bg-card p-5"
          >
            <input type="hidden" name="site_id" value={siteId} />
            <input type="hidden" name="event_id" value={event.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event name" htmlFor={`title-${event.id}`}>
                <input
                  id={`title-${event.id}`}
                  name="title"
                  defaultValue={event.title}
                  placeholder="Mehndi"
                  className={inputClass}
                />
              </Field>

              <Field label="When" htmlFor={`starts-${event.id}`}>
                <input
                  id={`starts-${event.id}`}
                  name="starts_at"
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(event.starts_at)}
                  className={inputClass}
                />
              </Field>

              <Field label="Venue" htmlFor={`venue-${event.id}`}>
                <input
                  id={`venue-${event.id}`}
                  name="venue"
                  defaultValue={event.venue}
                  placeholder="Pearl Continental"
                  className={inputClass}
                />
              </Field>

              <Field label="Dress code" htmlFor={`dress-${event.id}`}>
                <input
                  id={`dress-${event.id}`}
                  name="dress_code"
                  defaultValue={event.dress_code}
                  placeholder="Formal eastern"
                  className={inputClass}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address" htmlFor={`address-${event.id}`}>
                  <input
                    id={`address-${event.id}`}
                    name="address"
                    defaultValue={event.address}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field
                  label="Map link"
                  htmlFor={`map-${event.id}`}
                  hint="Paste a Google Maps share link so guests can navigate."
                >
                  <input
                    id={`map-${event.id}`}
                    name="map_url"
                    type="url"
                    defaultValue={event.map_url ?? ""}
                    placeholder="https://maps.app.goo.gl/…"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="submit" className={ghostButtonClass}>
                Save event
              </button>
              <button
                type="submit"
                formAction={deleteEvent}
                className="text-xs tracking-[0.16em] text-muted uppercase hover:text-accent"
              >
                Remove
              </button>
            </div>
          </form>
        ))}
      </div>

      <form action={addEvent} className="mt-6 flex flex-wrap gap-3">
        <input type="hidden" name="site_id" value={siteId} />
        <input
          name="title"
          placeholder="Add an event (e.g. Walima)"
          className={`${inputClass} max-w-xs flex-1`}
        />
        <button type="submit" className={ghostButtonClass}>
          Add
        </button>
      </form>
    </Section>
  );
}
