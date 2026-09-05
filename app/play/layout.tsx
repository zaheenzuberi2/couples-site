import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import { BRAND } from "@/lib/env";

/**
 * A deliberately different register from the rest of the product. The
 * couple-website side is warm-neutral and quiet, on purpose, so the
 * couple's own page is the only thing that shouts. This is a free,
 * standalone toy anyone can use in ten seconds - it gets to be loud,
 * round and colourful instead.
 */
const display = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `Free bucket list & quiz · ${BRAND}`, template: `%s · ${BRAND} Play` },
  description:
    "Make a shareable bucket list or a 'how well do you know us' quiz in seconds. No account, no website required.",
};

export const viewport: Viewport = {
  themeColor: "#fff3e9",
  colorScheme: "light",
};

export default function PlayLayout({ children }: LayoutProps<"/play">) {
  return (
    <div
      className={`${display.variable} min-h-full flex-1`}
      style={{
        // A self-contained palette, scoped to this subtree only - none of
        // this leaks into the rest of the app, and none of the app's own
        // tokens leak in here either.
        background:
          "radial-gradient(ellipse 90% 60% at 20% 0%, #ffe8d6 0%, #fff8f0 55%), radial-gradient(ellipse 70% 50% at 100% 100%, #d7f5ee 0%, transparent 60%)",
        backgroundColor: "#fff8f0",
        color: "#3a3230",
        fontFamily: "var(--font-jost), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
