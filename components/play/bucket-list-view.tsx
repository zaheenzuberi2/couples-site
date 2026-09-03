import type { PlayBucketItem } from "@/lib/play-types";
import { PLAY_COLORS, PlayCard } from "@/components/play/ui";

export default function PlayBucketListView({ items }: { items: PlayBucketItem[] }) {
  const done = items.filter((i) => i.done).length;

  return (
    <PlayCard>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        The bucket list
      </h2>
      <p className="mt-1 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
        {done} of {items.length} done
      </p>

      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "#faf3ec" }}
          >
            <span
              aria-hidden
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
            </span>
            <span
              className="text-sm"
              style={{
                color: item.done ? PLAY_COLORS.inkSoft : PLAY_COLORS.ink,
                textDecoration: item.done ? "line-through" : undefined,
              }}
            >
              {item.item}
            </span>
          </li>
        ))}
      </ul>
    </PlayCard>
  );
}
