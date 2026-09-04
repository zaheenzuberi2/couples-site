import Link from "next/link";
import { PLAY_COLORS } from "@/components/play/ui";

const MENU_ITEMS = [
  {
    emoji: "💌",
    title: "Gift Website",
    subtitle: "A full, permanent timeline site for your partner",
    href: "/login",
    prefetch: false,
    color: PLAY_COLORS.yellowSoft,
  },
  {
    emoji: "📝",
    title: "Bucket List",
    subtitle: "Everything you want to do together, in one link",
    href: "#create",
    color: PLAY_COLORS.mintSoft,
  },
  {
    emoji: "🧠",
    title: "Quiz",
    subtitle: "See how well they really know you",
    href: "#create",
    color: PLAY_COLORS.coralSoft,
  },
  {
    emoji: "🎲",
    title: "Couple Game",
    subtitle: "20 rounds of \"who's more likely to...\"",
    href: "/play/game",
    prefetch: false,
    color: PLAY_COLORS.yellowSoft,
  },
] as const;

export function PlayMenu() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          prefetch={"prefetch" in item ? item.prefetch : undefined}
          className="flex flex-col items-center gap-1.5 rounded-3xl px-3 py-5 text-center transition-transform active:scale-95"
          style={{ background: item.color }}
        >
          <span aria-hidden className="text-2xl">
            {item.emoji}
          </span>
          <span className="text-sm font-bold" style={{ color: PLAY_COLORS.ink }}>
            {item.title}
          </span>
          <span className="text-xs leading-snug" style={{ color: PLAY_COLORS.inkSoft }}>
            {item.subtitle}
          </span>
        </Link>
      ))}
    </div>
  );
}
