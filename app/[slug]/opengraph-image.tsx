import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPublicSite } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { allowedTheme } from "@/lib/tiers";
import { THEME_COLORS } from "@/lib/theme-colors";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Every couple's page gets its own OG card, in their own theme - not a
 * crop of their hero photo (wrong aspect ratio, no guaranteed legible
 * contrast for the names) but a purpose-built card that always looks
 * intentional, photo or not.
 *
 * No custom font: a Google Fonts fetch is one more thing that can fail
 * during generation, and ImageResponse's built-in default renders reliably.
 */
export default async function Image({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const bundle = await getPublicSite(slug);
  if (!bundle) notFound();

  const { site } = bundle;
  const names = [site.partner_one, site.partner_two].filter(Boolean).join(" & ");
  const subtitle =
    site.mode === "wedding" && site.event_date
      ? formatDate(site.event_date)
      : site.tagline;

  const theme = allowedTheme(site.tier, site.theme);
  const colors = THEME_COLORS[theme];

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
          background: colors.paper,
        }}
      >
        <div
          style={{
            fontSize: 80,
            color: colors.ink,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {names}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 22,
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: colors.gilt,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    ),
    size
  );
}
