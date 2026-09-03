import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Solid fill, not transparent - iOS composites this straight onto
          // the home screen, and a transparent apple-icon shows as black.
          background: "#160f14",
        }}
      >
        <BrandMark size={110} color="#e8c98a" />
      </div>
    ),
    { ...size }
  );
}
