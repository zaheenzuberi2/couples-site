import {
  addBucketItem,
  deleteBucketItem,
  toggleBucketItem,
} from "@/app/dashboard/actions";
import type { BucketItem } from "@/lib/types";
import { Section, ghostButtonClass, inputClass } from "./ui";

/**
 * Free on every plan. A checkbox list guests can see progress on, not a
 * to-do app - no due dates, no assignees, just "have we done this yet".
 */
export default function BucketListEditor({
  siteId,
  items,
}: {
  siteId: string;
  items: BucketItem[];
}) {
  const done = items.filter((i) => i.done).length;

  return (
    <Section
      title="Bucket list"
      hint="Things you want to do together. Guests see your progress, not a due date."
    >
      {items.length === 0 ? (
        <p className="mb-6 border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          Nothing here yet. This section stays hidden on your page until you
          add something.
        </p>
      ) : (
        <>
          <p className="mb-4 text-xs tracking-[0.14em] text-muted uppercase">
            {done} of {items.length} done
          </p>
          <ul className="divide-y divide-line border border-line bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <form action={toggleBucketItem}>
                  <input type="hidden" name="site_id" value={siteId} />
                  <input type="hidden" name="item_id" value={item.id} />
                  <input
                    type="hidden"
                    name="done"
                    value={item.done ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    aria-label={
                      item.done ? "Mark not done" : "Mark done"
                    }
                    className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                      item.done
                        ? "border-accent bg-accent text-white"
                        : "border-line"
                    }`}
                  >
                    {item.done && (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3 w-3"
                        aria-hidden
                      >
                        <path
                          d="M3 8.5 6.5 12 13 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </form>

                <span
                  className={`flex-1 text-sm ${item.done ? "text-muted line-through" : ""}`}
                >
                  {item.item}
                </span>

                <form action={deleteBucketItem}>
                  <input type="hidden" name="site_id" value={siteId} />
                  <input type="hidden" name="item_id" value={item.id} />
                  <button
                    type="submit"
                    className="text-[0.65rem] tracking-[0.14em] text-muted uppercase hover:text-accent"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}

      <form action={addBucketItem} className="mt-6 flex flex-wrap gap-3">
        <input type="hidden" name="site_id" value={siteId} />
        <input
          name="item"
          placeholder="Add something (e.g. Visit Hunza Valley)"
          className={`${inputClass} max-w-xs flex-1`}
        />
        <button type="submit" className={ghostButtonClass}>
          Add
        </button>
      </form>
    </Section>
  );
}
