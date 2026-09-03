import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { BRAND } from "@/lib/env";
import "./globals.css";

// Font variables are named after the typeface, not the role. The @theme block
// maps role -> typeface; naming both ends "--font-display" would be circular.
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const body = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND}, a website for the two of you`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Send us your photos and a few words. We turn them into a website you can share with everyone you love.",
};

// Overridden per couple page (their own theme) and on the marketing
// homepage (its dark hero) - this is just the fallback for app chrome.
// Deliberately no viewportFit: "cover" here - that's opt-in per page (the
// marketing hero and couple pages set it themselves, alongside the
// pt-safe padding that makes it safe to). Everywhere else keeps the
// browser's default inset, which needs no extra padding to stay correct.
export const viewport: Viewport = {
  themeColor: "#fbf9f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
