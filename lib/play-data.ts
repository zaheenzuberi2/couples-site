import "server-only";

import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  PlayBucketItem,
  PlayBundle,
  PlayQuizQuestion,
  PlayRoom,
} from "@/lib/play-types";

/**
 * play_rooms has no RLS select policy at all - edit_token lives on that row
 * and RLS can't hide a single column, only whole rows. So every read here
 * goes through the service-role client, and the public lookup strips
 * edit_token before it ever reaches a client component.
 */
async function loadRoomChildren(roomId: string) {
  const db = createAdminClient();
  const [bucketItems, quizQuestions] = await Promise.all([
    db
      .from("play_bucket_items")
      .select("*")
      .eq("room_id", roomId)
      .order("sort_order", { ascending: true }),
    db
      .from("play_quiz_questions")
      .select("*")
      .eq("room_id", roomId)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    bucketItems: (bucketItems.data ?? []) as PlayBucketItem[],
    quizQuestions: (quizQuestions.data ?? []) as PlayQuizQuestion[],
  };
}

/** For the public share page. The returned room never carries edit_token. */
export const getPlayRoomPublic = cache(async function getPlayRoomPublic(
  slug: string
): Promise<Omit<PlayBundle, "room"> & { room: Omit<PlayRoom, "edit_token"> } | null> {
  if (!isSupabaseConfigured) return null;
  const db = createAdminClient();

  const { data: room } = await db
    .from("play_rooms")
    .select("id, slug, title, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!room) return null;

  const children = await loadRoomChildren(room.id);
  return { room, ...children };
});

/**
 * For the edit page. Includes edit_token because the visitor already has
 * it (it's literally in the URL they're on) - this is what lets the edit
 * page display the share link and stamp forms with the token.
 */
export const getPlayRoomByEditToken = cache(
  async function getPlayRoomByEditToken(
    token: string
  ): Promise<PlayBundle | null> {
    if (!token || token.length < 8) return null;
    if (!isSupabaseConfigured) return null;
    const db = createAdminClient();

    const { data: room } = await db
      .from("play_rooms")
      .select("*")
      .eq("edit_token", token)
      .maybeSingle();

    if (!room) return null;

    const children = await loadRoomChildren(room.id);
    return { room: room as PlayRoom, ...children };
  }
);
