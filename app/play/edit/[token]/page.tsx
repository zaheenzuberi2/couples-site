import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlayRoomByEditToken } from "@/lib/play-data";
import { siteUrl } from "@/lib/env";
import { PLAY_COLORS, PlayCard } from "@/components/play/ui";
import PlayBucketListEditor from "@/components/play/bucket-list-editor";
import PlayQuizEditor from "@/components/play/quiz-editor";
import CopyLinkButton from "@/components/play/copy-link-button";
import { GiftUpsellModal } from "@/components/play/gift-upsell-modal";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PlayEditPage({
  params,
}: PageProps<"/play/edit/[token]">) {
  const { token } = await params;
  const bundle = await getPlayRoomByEditToken(token);

  if (!bundle) notFound();

  const { room, bucketItems, quizQuestions } = bundle;
  const shareUrl = `${siteUrl()}/play/${room.slug}`;
  const editUrl = `${siteUrl()}/play/edit/${room.edit_token}`;

  return (
    <>
      <Suspense fallback={null}>
        <GiftUpsellModal />
      </Suspense>

      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1
          className="text-3xl font-extrabold"
          style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
        >
          {room.title || "Your bucket list & quiz"}
        </h1>

        <PlayCard
          className="mt-6"
          style={{ background: PLAY_COLORS.yellowSoft }}
        >
          <p className="text-sm font-semibold" style={{ color: PLAY_COLORS.ink }}>
            Bookmark this page
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: PLAY_COLORS.inkSoft }}>
            This link is the only way to come back and edit. There&apos;s no
            account, so if you lose it, it&apos;s gone.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code
              className="truncate rounded-xl px-3 py-2 text-xs"
              style={{ background: "#fff" }}
            >
              {editUrl}
            </code>
            <CopyLinkButton url={editUrl} />
          </div>
        </PlayCard>

        <PlayCard className="mt-4">
          <p className="text-sm font-semibold" style={{ color: PLAY_COLORS.ink }}>
            Share this with anyone
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate rounded-xl px-3 py-2 text-xs underline"
              style={{ background: "#faf3ec", color: PLAY_COLORS.coral }}
            >
              {shareUrl}
            </a>
            <CopyLinkButton url={shareUrl} />
          </div>
        </PlayCard>

        <div className="mt-8 space-y-6">
          <PlayBucketListEditor
            editToken={room.edit_token}
            slug={room.slug}
            items={bucketItems}
          />
          <PlayQuizEditor
            editToken={room.edit_token}
            slug={room.slug}
            questions={quizQuestions}
          />
        </div>
      </main>
    </>
  );
}
