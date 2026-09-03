import type { ThemeName } from "@/lib/types";

/**
 * The --paper value for each theme, kept in sync with app/globals.css by
 * hand (there are only four). Used to set the browser's own chrome color
 * (address bar on Android, status bar background on iOS) so a couple's page
 * feels like it owns the whole screen, not just the content area - one of
 * the cheapest signals that a site was built rather than assembled.
 */
export const THEME_PAPER_COLOR: Record<ThemeName, string> = {
  blush: "#fffaf8",
  midnight: "#14161f",
  sage: "#fbfdfa",
  gold: "#fdfaf3",
};
