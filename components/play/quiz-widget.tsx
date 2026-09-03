"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { PlayQuizAttempt, PlayQuizQuestion } from "@/lib/play-types";
import { PLAY_COLORS, PlayButton, PlayCard } from "@/components/play/ui";

type Stage = "name" | "quiz" | "result";

/**
 * A guest plays anonymously - just a display name, no account, same shape
 * as the website's old quiz widget. Scoring is client-side since the
 * correct answer ships with the question data already; the only write is
 * the finished score landing in play_quiz_attempts for the leaderboard.
 */
export default function PlayQuizWidget({
  roomId,
  questions,
}: {
  roomId: string;
  questions: PlayQuizQuestion[];
}) {
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<PlayQuizAttempt[] | null>(null);

  const total = questions.length;
  const current = questions[index];

  async function loadLeaderboard() {
    const supabase = createClient();
    const { data } = await supabase
      .from("play_quiz_attempts")
      .select("*")
      .eq("room_id", roomId)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(10);
    setLeaderboard((data ?? []) as PlayQuizAttempt[]);
  }

  function answer(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    const correct = optionIndex === current.correct_index;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 < total) {
        setIndex((i) => i + 1);
        setPicked(null);
      } else {
        submitScore(correct ? score + 1 : score);
      }
    }, 550);
  }

  async function submitScore(finalScore: number) {
    setSubmitting(true);
    const supabase = createClient();
    await supabase.from("play_quiz_attempts").insert({
      room_id: roomId,
      guest_name: name.trim() || "A guest",
      score: finalScore,
      total,
    });
    setSubmitting(false);
    setScore(finalScore);
    setStage("result");
    loadLeaderboard();
  }

  return (
    <PlayCard>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        How well do you know us?
      </h2>

      <div className="mt-5">
        {stage === "name" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStage("quiz");
            }}
          >
            <label htmlFor="quiz-name" className="text-sm font-semibold" style={{ color: PLAY_COLORS.ink }}>
              Your name
            </label>
            <input
              id="quiz-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="So we know who's playing"
              className="mt-2 w-full rounded-2xl border-2 border-transparent bg-[#faf3ec] px-4 py-3 text-base outline-none focus:border-[#ff6f81] sm:text-sm"
            />
            <PlayButton type="submit" className="mt-4 w-full">
              Start the quiz
            </PlayButton>
          </form>
        )}

        {stage === "quiz" && current && (
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: PLAY_COLORS.mint }}>
              Question {index + 1} of {total}
            </p>
            <h3 className="mt-2 text-xl font-bold" style={{ color: PLAY_COLORS.ink }}>
              {current.question}
            </h3>

            <div className="mt-4 space-y-2">
              {current.options.map((option, i) => {
                const isPicked = picked === i;
                const isCorrect = i === current.correct_index;
                const revealed = picked !== null;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => answer(i)}
                    disabled={picked !== null}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors"
                    style={{
                      background:
                        revealed && isCorrect
                          ? PLAY_COLORS.mintSoft
                          : revealed && isPicked
                            ? PLAY_COLORS.coralSoft
                            : "#faf3ec",
                      border: `2px solid ${
                        revealed && isCorrect
                          ? PLAY_COLORS.mint
                          : revealed && isPicked
                            ? PLAY_COLORS.coral
                            : "transparent"
                      }`,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="text-center">
            <p
              className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.coral }}
            >
              {score} / {total}
            </p>
            <p className="mt-1 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
              {submitting ? "Saving your score…" : "Nicely played."}
            </p>

            {leaderboard && leaderboard.length > 0 && (
              <div className="mt-6 text-left">
                <p className="text-center text-xs font-bold uppercase" style={{ color: PLAY_COLORS.mint }}>
                  Leaderboard
                </p>
                <ol className="mt-3 space-y-1.5">
                  {leaderboard.map((attempt, i) => (
                    <li
                      key={attempt.id}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm"
                      style={{ background: "#faf3ec" }}
                    >
                      <span style={{ color: PLAY_COLORS.ink }}>
                        {i + 1}. {attempt.guest_name}
                      </span>
                      <span style={{ color: PLAY_COLORS.inkSoft }}>
                        {attempt.score}/{attempt.total} · {formatDate(attempt.created_at)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </PlayCard>
  );
}
