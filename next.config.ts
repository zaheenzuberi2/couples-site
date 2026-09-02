import type { NextConfig } from "next";

/**
 * Couple photos are served from Supabase Storage, whose host is only known
 * from the environment. Derive the allowed image host instead of hardcoding
 * it, and fall back to unoptimized images if the URL is absent at build time
 * so a missing env var degrades quality rather than breaking the build.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost: string | null = null;
try {
  if (supabaseUrl) supabaseHost = new URL(supabaseUrl).hostname;
} catch {
  supabaseHost = null;
}

const nextConfig: NextConfig = {
  images: supabaseHost
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : { unoptimized: true },
};

export default nextConfig;
