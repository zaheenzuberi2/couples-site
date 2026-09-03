import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayRoomPublic } from "@/lib/play-data";
import { PLAY_COLORS } from "@/components/play/ui";
import PlayBucketListView from "@/components/play/bucket-list-view";
import PlayQuizWidget from "@/components/play/quiz-widget";

export async function generateMetadata({
  params,
}: PageProps<"/play/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPlayRoomPublic(slug);
  if (!bundle) return { title: "Not found" };

  return {
    title: bundle.room.title || "Bucket list & quiz",
    description: "A bucket list and a little quiz, made with Ours Play.",
  };
}

export default async function PlayPublicPage({
  params,
}: PageProps<"/play/[slug]">) {
  const { slug } = await params;
  const bundle = await getPlayRoomPublic(slug);

  if (!bundle) notFound();

  const { room, bucketItems, quizQuestions } = bundle;

  if (bucketItems.length === 0 && quizQuestions.length === 0) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-3xl font-extrabold"
          style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
        >
          {room.title || "Nothing here yet"}
        </h1>
        <p className="mt-3 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
          Whoever made this hasn&apos;t added anything yet. Check back soon.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1
        className="text-center text-3xl font-extrabold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        {room.title}
      </h1>

      <div className="mt-8 space-y-6">
        {bucketItems.length > 0 && <PlayBucketListView items={bucketItems} />}
        {quizQuestions.length > 0 && (
          <PlayQuizWidget roomId={room.id} questions={quizQuestions} />
        )}
      </div>

      <p className="mt-10 text-center text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
        Made with{" "}
        <Link href="/play" className="underline underline-offset-4">
          Ours Play
        </Link>
      </p>
    </main>
  );
}
