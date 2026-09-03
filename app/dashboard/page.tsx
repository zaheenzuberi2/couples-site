import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import BucketListEditor from "@/components/editor/bucket-list-editor";
import CreateSiteForm from "@/components/editor/create-site-form";
import DetailsForm from "@/components/editor/details-form";
import EventsEditor from "@/components/editor/events-editor";
import PhotoManager from "@/components/editor/photo-manager";
import QuizEditor from "@/components/editor/quiz-editor";
import PublishPanel from "@/components/editor/publish-panel";
import RsvpList from "@/components/editor/rsvp-list";
import TimelineEditor from "@/components/editor/timeline-editor";
import { BRAND, isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getMySite, getRsvps } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { tierConfig } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Your page",
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

  const config = bundle ? tierConfig(bundle.site.tier) : null;

  const rsvps =
    bundle && bundle.site.mode === "wedding" && bundle.site.rsvp_enabled
      ? await getRsvps(bundle.site.id)
      : [];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link href="/" className="font-display text-2xl">
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
                <p className="mt-1 text-sm text-muted">
                  {bundle.site.mode === "wedding"
                    ? "Wedding invitation"
                    : "Keepsake page"}
                </p>
              </div>
              <a
                href={`/preview/${bundle.site.preview_token}`}
                className="ml-auto border border-line px-5 py-2.5 text-xs tracking-[0.18em] uppercase hover:border-accent hover:text-accent"
              >
                View page
              </a>
            </div>

            <PublishPanel
              site={bundle.site}
              publicUrl={`${siteUrl()}/${bundle.site.slug}`}
              previewUrl={`${siteUrl()}/preview/${bundle.site.preview_token}`}
              highlightUpgrade={upgrade === "1"}
            />

            <DetailsForm site={bundle.site} />

            {bundle.site.mode === "wedding" && config?.events && (
              <EventsEditor siteId={bundle.site.id} events={bundle.events} />
            )}

            <TimelineEditor
              siteId={bundle.site.id}
              entries={bundle.timeline}
              mode={bundle.site.mode}
            />

            <BucketListEditor siteId={bundle.site.id} items={bundle.bucketList} />

            <QuizEditor siteId={bundle.site.id} questions={bundle.quizQuestions} />

            <PhotoManager
              siteId={bundle.site.id}
              photos={bundle.photos}
              heroPhoto={bundle.site.hero_photo}
              maxPhotos={config?.maxPhotos ?? Infinity}
            />

            {bundle.site.mode === "wedding" && bundle.site.rsvp_enabled && (
              <RsvpList rsvps={rsvps} />
            )}
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
