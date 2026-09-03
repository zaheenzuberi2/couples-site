import {
  addBucketItem,
  deleteBucketItem,
  toggleBucketItem,
} from "@/app/play/actions";
import type { PlayBucketItem } from "@/lib/play-types";
import { PLAY_COLORS, PlayButton, PlayCard, playInputClass } from "@/components/play/ui";

export default function PlayBucketListEditor({
  editToken,
  slug,
  items,
}: {
  editToken: string;
  slug: string;
  items: PlayBucketItem[];
}) {
  const done = items.filter((i) => i.done).length;

  return (
    <PlayCard>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        Bucket list
      </h2>
      {items.length > 0 && (
        <p className="mt-1 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
          {done} of {items.length} done
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "#faf3ec" }}
            >
              <form action={toggleBucketItem}>
                <input type="hidden" name="edit_token" value={editToken} />
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="item_id" value={item.id} />
                <input
                  type="hidden"
                  name="done"
                  value={item.done ? "false" : "true"}
                />
                <button
                  type="submit"
                  aria-label={item.done ? "Mark not done" : "Mark done"}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: item.done ? PLAY_COLORS.mint : "#fff",
                    border: item.done ? "none" : `2px solid ${PLAY_COLORS.ink}33`,
                  }}
                >
                  {item.done && (
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path
                        d="M3 8.5 6.5 12 13 4.5"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </form>

              <span
                className="flex-1 text-sm"
                style={{
                  color: item.done ? PLAY_COLORS.inkSoft : PLAY_COLORS.ink,
                  textDecoration: item.done ? "line-through" : undefined,
                }}
              >
                {item.item}
              </span>

              <form action={deleteBucketItem}>
                <input type="hidden" name="edit_token" value={editToken} />
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="item_id" value={item.id} />
                <button
                  type="submit"
                  className="text-xs font-semibold"
                  style={{ color: PLAY_COLORS.coral }}
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addBucketItem} className="mt-5 flex flex-wrap gap-2.5">
        <input type="hidden" name="edit_token" value={editToken} />
        <input type="hidden" name="slug" value={slug} />
        <input
          name="item"
          placeholder="Visit Hunza Valley"
          className={`${playInputClass} max-w-xs flex-1`}
        />
        <PlayButton type="submit" variant="secondary">
          Add
        </PlayButton>
      </form>
    </PlayCard>
  );
}
