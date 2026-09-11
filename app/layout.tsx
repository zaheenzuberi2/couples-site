import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BRAND, GOOGLE_SITE_VERIFICATION, siteUrl } from "@/lib/env";
import { HelpChat } from "@/components/chatbot/help-chat";
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
  // Lets Next resolve the opengraph-image / twitter-image routes (and any
  // other relative metadata URL) to a real absolute URL instead of the
  // localhost fallback it uses when this is unset.
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${BRAND}, a website for the two of you`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Send us your photos and a few words. We turn them into a website you can share with everyone you love.",
  // The auto-detected icon.tsx/apple-icon.tsx files are capped at the sizes
  // those devices expect (32px, 180px) - this adds a real 512px mark for
  // anything else that wants a proper logo (PWA installs, brand-kit tools).
  icons: {
    other: { rel: "icon", url: "/brand-logo", sizes: "512x512" },
  },
  // Set once: paste the "content" value from Search Console's HTML tag
  // method into GOOGLE_SITE_VERIFICATION in Vercel's env vars. Left out of
  // the page entirely until then, rather than rendering an empty tag.
  ...(GOOGLE_SITE_VERIFICATION && {
    verification: { google: GOOGLE_SITE_VERIFICATION },
  }),
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
      <body className="min-h-full flex flex-col">
        {children}
        <HelpChat />
        <Analytics />
      </body>
    </html>
  );
}
