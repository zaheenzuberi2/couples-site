import type { Metadata } from "next";
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
