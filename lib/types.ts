export type ThemeName = "blush" | "midnight" | "sage" | "gold";

export type Site = {
  id: string;
  owner_id: string;
  slug: string;
  preview_token: string;
  is_paid: boolean;
  is_published: boolean;
  partner_one: string;
  partner_two: string;
  tagline: string;
  story: string;
  event_date: string | null;
  hero_photo: string | null;
  theme: ThemeName;
  payment_screenshot: string | null;
  payment_note: string;
  payment_submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SitePhoto = {
  id: string;
  site_id: string;
  image_path: string;
  caption: string;
  sort_order: number;
  created_at: string;
};

export type TimelineEntry = {
  id: string;
  site_id: string;
  title: string;
  happened_on: string | null;
  body: string;
  sort_order: number;
};

/** Everything a public page needs, fetched in one go. */
export type SiteBundle = {
  site: Site;
  photos: SitePhoto[];
  timeline: TimelineEntry[];
};
