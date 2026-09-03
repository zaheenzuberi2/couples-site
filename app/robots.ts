import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * Everything a couple's public page and the /play landing page are meant to
 * be found; everything that's a private link (preview/edit tokens), an
 * auth-gated screen, or plain app chrome is kept out of the index. Token
 * URLs specifically must never be crawled - they're unguessable secrets on
 * purpose (see [[couples-website-builder]]) and a crawler indexing one would
 * defeat that.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/admin",
        "/login",
        "/auth/",
        "/preview/",
        "/play/edit/",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
