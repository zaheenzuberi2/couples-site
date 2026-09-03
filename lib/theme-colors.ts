import type { ThemeName } from "@/lib/types";

/**
 * The --paper / --ink / --gilt values for each theme, kept in sync with
 * app/globals.css by hand (there are only four). Two jobs:
 *   - --paper sets the browser's own chrome color (address bar on Android,
 *     status bar background on iOS), so a couple's page feels like it owns
 *     the whole screen, not just the content area
 *   - all three drive the per-couple OG image, so a shared link looks like
 *     it belongs to their page before anyone even clicks it
 */
export const THEME_COLORS: Record<
  ThemeName,
  { paper: string; ink: string; gilt: string }
> = {
  blush: { paper: "#fffaf8", ink: "#3b2430", gilt: "#b5647c" },
  midnight: { paper: "#14161f", ink: "#f2ece4", gilt: "#c9a86a" },
  sage: { paper: "#fbfdfa", ink: "#22302a", gilt: "#5f7d63" },
  gold: { paper: "#fdfaf3", ink: "#2b2419", gilt: "#a3813a" },
};

/** Back-compat for callers that only need the browser-chrome color. */
export const THEME_PAPER_COLOR: Record<ThemeName, string> = Object.fromEntries(
  Object.entries(THEME_COLORS).map(([name, c]) => [name, c.paper])
) as Record<ThemeName, string>;
