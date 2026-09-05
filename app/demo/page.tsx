import type { Metadata, Viewport } from "next";
import Link from "next/link";
import CouplePage from "@/components/couple-page";
import { THEME_PAPER_COLOR } from "@/lib/theme-colors";
import type { SiteBundle } from "@/lib/types";

/**
 * A live, non-database example of a finished page - so a visitor can see
 * exactly what they'd get before signing up, without needing a real
 * couple's data. Deliberately noindex: this is a sales prop, not a real
 * page, and shouldn't compete with real customer pages in search results.
 */
export const metadata: Metadata = {
  title: "See an example",
  description: "A sample website, built with Ours.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: THEME_PAPER_COLOR.gold,
  colorScheme: "light",
  viewportFit: "cover",
};

const demoBundle: SiteBundle = {
  site: {
    id: "demo",
    owner_id: "demo",
    slug: "demo",
    preview_token: "demo",
    is_paid: true,
    is_published: true,
    partner_one: "Zara",
    partner_two: "Alina",
    tagline: "Two names, one story, ours to keep.",
    story:
      "We didn't plan any of this. A shared table at a friend's dinner, then a conversation that ran three hours too long.\n\nSince then it's been ordinary days that turned out to matter - the long drives, the bad jokes, the quiet nights we still remember better than the big ones.\n\nThis website is where we're keeping it, so we never have to explain it from memory again.",
    event_date: "2026-12-24",
    // No hero_photo set - CouplePage promotes photos[0] to the hero
    // automatically, same as it would for a real couple who hasn't set one.
    hero_photo: null,
    theme: "gold",
    payment_screenshot: null,
    payment_note: "",
    payment_submitted_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  // Illustrated character avatars (dicebear.com, CC0/MIT-licensed, no real
  // person's likeness) rather than photos of real strangers - this is a
  // fictional demo couple, so the photos should read as obviously fictional
  // too. Served from /public/demo, not Supabase.
  photos: [
    {
      id: "demo-photo-1",
      site_id: "demo",
      image_path: "/demo/photo-1.svg",
      caption: "",
      sort_order: 0,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "demo-photo-2",
      site_id: "demo",
      image_path: "/demo/photo-2.svg",
      caption: "Alina",
      sort_order: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "demo-photo-3",
      site_id: "demo",
      image_path: "/demo/photo-3.svg",
      caption: "The first trip",
      sort_order: 2,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "demo-photo-4",
      site_id: "demo",
      image_path: "/demo/photo-4.svg",
      caption: "Us, today",
      sort_order: 3,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  timeline: [
    {
      id: "demo-1",
      site_id: "demo",
      title: "Where it started",
      happened_on: "2023-05-12",
      body: "A dinner neither of us was supposed to be at, and a conversation that outlasted everyone else at the table.",
      sort_order: 0,
    },
    {
      id: "demo-2",
      site_id: "demo",
      title: "The first trip",
      happened_on: "2024-03-02",
      body: "Four days, one bad map, and the realisation we travel well together - which, it turns out, is rarer than it sounds.",
      sort_order: 1,
    },
    {
      id: "demo-3",
      site_id: "demo",
      title: "This year",
      happened_on: "2026-01-15",
      body: "Still choosing each other, on the ordinary days as much as the big ones.",
      sort_order: 2,
    },
  ],
};

export default function DemoPage() {
  return (
    <>
      {/* Banner is outside [data-theme] so it never inherits the page's own palette. */}
      <div className="pt-safe sticky top-0 z-50 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 text-sm">
          <span className="font-medium">Example website</span>
          <span className="text-muted">
            Sample names and story - this is what yours could look like.
          </span>
          <Link
            href="/login"
            className="ml-auto shrink-0 rounded-full bg-accent px-4 py-1.5 text-xs tracking-wide text-white"
          >
            Start your own
          </Link>
        </div>
      </div>

      <CouplePage bundle={demoBundle} />
    </>
  );
}
