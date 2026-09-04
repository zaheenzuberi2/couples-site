"use client";

import { useState } from "react";

/**
 * A real accordion (one open item, smooth slide via the grid-rows trick -
 * animating to height:auto isn't possible with a plain CSS transition, but
 * animating a grid track from 0fr to 1fr is, and needs no JS-measured
 * height). Swapped in for the old <details> version so the chevron can
 * rotate and the reveal can be a slide instead of an instant snap.
 */
export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="border-b border-line py-6 first:pt-0">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 text-left font-display text-xl"
            >
              {item.q}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
