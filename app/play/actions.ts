"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, validateSlug } from "@/lib/slug";
import { hasEnoughOptions, quizOptionsFrom } from "@/lib/quiz";

export type ActionResult = { ok: boolean; message?: string };

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Resolves a room from its edit_token via the service-role client - this
 * IS the authorization check for every owner-side write below. No token
 * match means no room comes back, and every action here just no-ops in
 * that case rather than erroring, so a stale or tampered token fails quietly
 * instead of leaking whether a token almost worked.
 */
async function requireRoom(editToken: string) {
  const db = createAdminClient();
  const { data: room } = await db
    .from("play_rooms")
    .select("id, edit_token")
    .eq("edit_token", editToken)
    .maybeSingle();
  return { db, room };
}

function refresh(editToken: string, slug?: string) {
  revalidatePath(`/play/edit/${editToken}`);
  if (slug) revalidatePath(`/play/${slug}`);
}

/* ------------------------------------------------------------ create */

export async function createRoom(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const title = text(formData, "title");
  if (!title) return { ok: false, message: "Give it a title first." };

  const db = createAdminClient();

  let slug = slugify(title);
  const check = validateSlug(slug);
  if (!check.ok) slug = `${slug || "our"}-${Math.random().toString(36).slice(2, 6)}`;

  // Slugs are shared with couple sites at the domain root, but play rooms
  // live under /play/<slug> - a different namespace - so only a clash with
  // another play room (or a reserved word, caught above) matters here.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await db
      .from("play_rooms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${slugify(title) || "our"}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const { data: room, error } = await db
    .from("play_rooms")
    .insert({ slug, title })
    .select("edit_token")
    .single();

  if (error || !room) {
    return { ok: false, message: "Could not create that. Try again." };
  }

  redirect(`/play/edit/${room.edit_token}`);
}

/* --------------------------------------------------------- bucket list */

export async function addBucketItem(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  const item = text(formData, "item");
  if (!item) return;

  const { count } = await db
    .from("play_bucket_items")
    .select("id", { count: "exact", head: true })
    .eq("room_id", room.id);

  await db
    .from("play_bucket_items")
    .insert({ room_id: room.id, item, sort_order: count ?? 0 });

  refresh(editToken, text(formData, "slug"));
}

export async function toggleBucketItem(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  await db
    .from("play_bucket_items")
    .update({ done: formData.get("done") === "true" })
    .eq("id", text(formData, "item_id"))
    .eq("room_id", room.id);

  refresh(editToken, text(formData, "slug"));
}

export async function deleteBucketItem(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  await db
    .from("play_bucket_items")
    .delete()
    .eq("id", text(formData, "item_id"))
    .eq("room_id", room.id);

  refresh(editToken, text(formData, "slug"));
}

/* ---------------------------------------------------------------- quiz */

export async function addQuizQuestion(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  const question = text(formData, "question");
  const { options, correctIndex } = quizOptionsFrom(formData);
  if (!question || !hasEnoughOptions(options)) return;

  const { count } = await db
    .from("play_quiz_questions")
    .select("id", { count: "exact", head: true })
    .eq("room_id", room.id);

  await db.from("play_quiz_questions").insert({
    room_id: room.id,
    question,
    options,
    correct_index: correctIndex,
    sort_order: count ?? 0,
  });

  refresh(editToken, text(formData, "slug"));
}

export async function saveQuizQuestion(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  const question = text(formData, "question");
  const { options, correctIndex } = quizOptionsFrom(formData);
  if (!question || !hasEnoughOptions(options)) return;

  await db
    .from("play_quiz_questions")
    .update({ question, options, correct_index: correctIndex })
    .eq("id", text(formData, "question_id"))
    .eq("room_id", room.id);

  refresh(editToken, text(formData, "slug"));
}

export async function deleteQuizQuestion(formData: FormData): Promise<void> {
  const editToken = text(formData, "edit_token");
  const { db, room } = await requireRoom(editToken);
  if (!room) return;

  await db
    .from("play_quiz_questions")
    .delete()
    .eq("id", text(formData, "question_id"))
    .eq("room_id", room.id);

  refresh(editToken, text(formData, "slug"));
}
