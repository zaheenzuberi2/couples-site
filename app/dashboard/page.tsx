import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import CreateSiteForm from "@/components/editor/create-site-form";
import DetailsForm from "@/components/editor/details-form";
import PhotoManager from "@/components/editor/photo-manager";
import PublishPanel from "@/components/editor/publish-panel";
import TimelineEditor from "@/components/editor/timeline-editor";
import { BRAND, isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getMySite } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your website",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bundle = await getMySite();
  const { upgrade } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-display text-2xl">
            <BrandMark size={20} color="var(--accent)" />
            {BRAND}
          </Link>
          <span className="ml-auto hidden text-sm text-muted sm:inline">
            {user.email}
          </span>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-muted underline underline-offset-4">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        {!bundle ? (
          <CreateSiteForm />
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <div>
                <h1 className="font-display text-4xl">
                  {bundle.site.partner_one} &amp; {bundle.site.partner_two}
                </h1>
                <p className="mt-1 text-sm text-muted">Keepsake website</p>
              </div>
              <a
                href={`/preview/${bundle.site.preview_token}`}
                className="ml-auto border border-line px-5 py-2.5 text-xs tracking-[0.18em] uppercase hover:border-accent hover:text-accent"
              >
                View website
              </a>
            </div>

            <PublishPanel
              site={bundle.site}
              publicUrl={`${siteUrl()}/${bundle.site.slug}`}
              previewUrl={`${siteUrl()}/preview/${bundle.site.preview_token}`}
              highlightUpgrade={upgrade === "1"}
            />

            <DetailsForm site={bundle.site} />

            <TimelineEditor
              siteId={bundle.site.id}
              entries={bundle.timeline}
            />

            <PhotoManager
              siteId={bundle.site.id}
              photos={bundle.photos}
              heroPhoto={bundle.site.hero_photo}
            />

            <p className="mt-12 border-t border-line pt-8 text-sm text-muted">
              Looking for a bucket list or a &quot;how well do you know
              us&quot; quiz?{" "}
              <Link
                href="/play"
                className="text-accent underline underline-offset-4"
              >
                Make one for free
              </Link>{" "}
              — no website needed.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function SetupNotice() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="font-display text-4xl">Almost there</h1>
      <p className="mt-4 leading-relaxed text-muted">
        Supabase isn&apos;t configured yet. Add these to{" "}
        <code className="text-foreground">.env.local</code> and restart the dev
        server:
      </p>
      <pre className="mt-6 overflow-x-auto border border-line bg-card p-4 text-xs leading-relaxed">
        {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...`}
      </pre>
      <p className="mt-4 text-sm text-muted">
        Then run <code className="text-foreground">supabase-setup.sql</code> in
        the Supabase SQL editor.
      </p>
    </main>
  );
}
