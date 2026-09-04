import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const contentType = "image/png";

/**
 * A plain, large (512px) square logo mark - not a Next.js icon convention
 * file, since those (apple-icon, icon) are capped at sizes real devices
 * expect (180px, 32px). This exists purely so external tools that scrape
 * the site for a "logo" (brand kits, marketing generators) have something
 * bigger than a favicon to grab.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#160f14",
        }}
      >
        <BrandMark size={300} color="#e8c98a" />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
