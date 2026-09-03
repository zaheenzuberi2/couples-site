import { PRICE_BASIC, PRICE_PREMIUM, PRICE_STANDARD } from "@/lib/env";
import type { ThemeName, Tier } from "@/lib/types";

/**
 * Single source of truth for what each package includes. Every place that
 * needs to know "can this couple use RSVPs?" or "how many photos?" reads
 * from here - the editor to grey things out, the server actions to clamp
 * writes, and the public page to render defensively even if a site was
 * downgraded after the fact.
 */
export type TierConfig = {
  name: string;
  price: string;
  tagline: string;
  maxPhotos: number;
  rsvp: boolean;
  events: boolean;
  themes: ThemeName[];
  priorityActivation: boolean;
  features: string[];
};

export const TIER_ORDER: Tier[] = ["basic", "standard", "premium"];

export const TIERS: Record<Tier, TierConfig> = {
  basic: {
    name: "Basic",
    price: PRICE_BASIC,
    tagline: "A beautiful page with your story and photos.",
    maxPhotos: 10,
    rsvp: false,
    events: false,
    themes: ["blush"],
    priorityActivation: false,
    features: [
      "Your own web address",
      "Story, timeline and up to 10 photos",
      "Bucket list and a \"how well do you know us\" quiz",
      "Works on every phone",
    ],
  },
  standard: {
    name: "Standard",
    price: PRICE_STANDARD,
    tagline: "Everything a wedding invitation needs.",
    maxPhotos: Infinity,
    rsvp: true,
    events: true,
    themes: ["blush"],
    priorityActivation: false,
    features: [
      "Everything in Basic",
      "Unlimited photos",
      "Event schedule for mehndi, barat, walima",
      "RSVPs collected for you",
    ],
  },
  premium: {
    name: "Premium",
    price: PRICE_PREMIUM,
    tagline: "The full page, every theme, done first.",
    maxPhotos: Infinity,
    rsvp: true,
    events: true,
    themes: ["blush", "midnight", "sage", "gold"],
    priorityActivation: true,
    features: [
      "Everything in Standard",
      "Every colour theme unlocked",
      "Priority activation, live the same day",
    ],
  },
};

export function tierConfig(tier: Tier): TierConfig {
  return TIERS[tier] ?? TIERS.standard;
}

/** Clamp a requested theme to one this tier is actually allowed to use. */
export function allowedTheme(tier: Tier, requested: ThemeName): ThemeName {
  const config = tierConfig(tier);
  return config.themes.includes(requested) ? requested : config.themes[0];
}
