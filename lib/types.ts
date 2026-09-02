export type SiteMode = "wedding" | "keepsake";

export type ThemeName = "blush" | "midnight" | "sage" | "gold";

/** Package purchased. See lib/tiers.ts for what each one includes. */
export type Tier = "basic" | "standard" | "premium";

export type Site = {
  id: string;
  owner_id: string;
  slug: string;
  preview_token: string;
  mode: SiteMode;
  tier: Tier;
  is_paid: boolean;
  is_published: boolean;
  partner_one: string;
  partner_two: string;
  tagline: string;
  story: string;
  event_date: string | null;
  hero_photo: string | null;
  theme: ThemeName;
  venue_note: string;
  rsvp_enabled: boolean;
  rsvp_deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteEvent = {
  id: string;
  site_id: string;
  title: string;
  starts_at: string | null;
  venue: string;
  address: string;
  map_url: string | null;
  dress_code: string;
  sort_order: number;
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

export type Rsvp = {
  id: string;
  site_id: string;
  guest_name: string;
  guest_email: string;
  attending: boolean;
  party_size: number;
  message: string;
  created_at: string;
};

/** Everything a public page needs, fetched in one go. */
export type SiteBundle = {
  site: Site;
  events: SiteEvent[];
  photos: SitePhoto[];
  timeline: TimelineEntry[];
};
