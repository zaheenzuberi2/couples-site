import type { ReactNode } from "react";

/**
 * The whole visual vocabulary for /play in one place: chunky rounded
 * cards, a coral/mint/yellow palette, soft shadows instead of hairline
 * borders. Deliberately not reusing the website's --accent/--gilt tokens -
 * this is a different product register on purpose.
 */

export const PLAY_COLORS = {
  coral: "#ff6f81",
  coralSoft: "#ffe3e7",
  mint: "#2bb8a3",
  mintSoft: "#d9f5ef",
  yellow: "#ffc857",
  yellowSoft: "#fff1d6",
  ink: "#3a3230",
  inkSoft: "#8a7f7a",
};

export function PlayCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl bg-white p-6 sm:p-8 ${className}`}
      style={{ boxShadow: "0 12px 32px -12px rgba(58,50,48,0.14)", ...style }}
    >
      {children}
    </div>
  );
}

export function PlayButton({
  children,
  variant = "primary",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: { background: PLAY_COLORS.coral, color: "#fff" },
    secondary: { background: PLAY_COLORS.mint, color: "#fff" },
    ghost: {
      background: "transparent",
      color: PLAY_COLORS.ink,
      border: `2px solid ${PLAY_COLORS.ink}22`,
    },
  }[variant];

  return (
    <button
      {...props}
      className={`rounded-full px-6 py-3 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-50 ${props.className ?? ""}`}
      style={styles}
    >
      {children}
    </button>
  );
}

export const playInputClass =
  "w-full rounded-2xl border-2 border-transparent bg-[#faf3ec] px-4 py-3 text-base outline-none transition-colors focus:border-[#ff6f81] sm:text-sm";
