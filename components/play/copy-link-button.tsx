"use client";

import { useState } from "react";
import { PLAY_COLORS } from "@/components/play/ui";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be blocked (permissions, non-secure context) -
      // the link is still right there in the code element to select by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
      style={{ background: PLAY_COLORS.ink, color: "#fff" }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
