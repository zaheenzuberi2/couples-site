import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/env";

export const alt = `${BRAND}, a website for the two of you`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE = "A website for the two of you";

// Deliberately no custom font here - ImageResponse's built-in default is
// what actually renders reliably at build time. A Google Fonts fetch is one
// more thing that can fail during static generation, and this card doesn't
// need to match the app's serif exactly to do its job.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#160f14",
        }}
      >
        <BrandMark size={80} color="#e8c98a" />
        <div style={{ marginTop: 36, fontSize: 88, color: "#f8f1e6" }}>
          {BRAND}
        </div>
        <div style={{ marginTop: 18, fontSize: 32, color: "#cbb8a3" }}>
          {TAGLINE}
        </div>
      </div>
    ),
    size
  );
}
