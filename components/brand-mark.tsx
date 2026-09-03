/**
 * The one icon this whole product uses: two thin overlapping rings. Plain
 * geometry, not clipart - reused across the favicon, the apple touch icon,
 * and every OG card, so it's the one visual thread tying "Ours" together
 * wherever it shows up outside the app itself.
 */
export function BrandMark({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <circle cx="35" cy="30" r="26" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="65" cy="30" r="26" fill="none" stroke={color} strokeWidth="4" />
    </svg>
  );
}
