"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { QuizAttempt, QuizQuestion } from "@/lib/types";

type Stage = "name" | "quiz" | "result";

/**
 * A guest plays anonymously - just a display name, no account. Scoring
 * happens entirely client-side (the correct answer ships with the question
 * data already, so there's nothing meaningful to hide server-side); the
 * only write is the finished score landing in quiz_attempts for the
 * leaderboard. RLS is what actually enforces this can only happen on a
 * live site.
 */
export default function QuizWidget({
  siteId,
  questions,
}: {
  siteId: string;
  questions: QuizQuestion[];
}) {
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[] | null>(null);

  const total = questions.length;
  const current = questions[index];

  async function loadLeaderboard() {
    const supabase = createClient();
    const { data } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("site_id", siteId)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(10);
    setLeaderboard((data ?? []) as QuizAttempt[]);
  }

  function answer(optionIndex: number) {
    if (picked !== null) return; // one answer per question
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
    await supabase.from("quiz_attempts").insert({
      site_id: siteId,
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
    <section
      id="quiz"
      className="px-6 py-24 sm:py-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="eyebrow">A little game</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            How well do you know us?
          </h2>
        </div>

        <div className="mt-10 border p-6 sm:p-8" style={{ borderColor: "var(--rule)" }}>
          {stage === "name" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStage("quiz");
              }}
              className="text-center"
            >
              <label htmlFor="quiz-name" className="eyebrow block">
                Your name
              </label>
              <input
                id="quiz-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So we know who's playing"
                className="mt-2 w-full border-b bg-transparent py-2.5 text-center text-base outline-none focus:border-b-2 sm:text-sm"
                style={{ borderColor: "var(--rule)" }}
              />
              <button
                type="submit"
                className="mt-6 w-full py-3.5 text-xs tracking-[0.22em] uppercase"
                style={{ background: "var(--gilt)", color: "var(--paper)" }}
              >
                Start the quiz
              </button>
            </form>
          )}

          {stage === "quiz" && current && (
            <div>
              <p className="eyebrow text-center">
                Question {index + 1} of {total}
              </p>
              <h3 className="display mt-3 text-center text-2xl sm:text-3xl">
                {current.question}
              </h3>

              <div className="mt-7 space-y-2.5">
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
                      className="w-full border px-4 py-3 text-left text-sm transition-colors"
                      style={{
                        borderColor:
                          revealed && isCorrect
                            ? "var(--gilt)"
                            : revealed && isPicked
                              ? "#b3261e"
                              : "var(--rule)",
                        background:
                          revealed && isCorrect
                            ? "var(--paper-alt)"
                            : "transparent",
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
              <p className="display text-3xl">
                {score} / {total}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--whisper)" }}>
                {submitting ? "Saving your score…" : "Nicely played."}
              </p>

              {leaderboard && leaderboard.length > 0 && (
                <div className="mt-8 text-left">
                  <p className="eyebrow text-center">Leaderboard</p>
                  <ol className="mt-4 divide-y" style={{ borderColor: "var(--rule)" }}>
                    {leaderboard.map((attempt, i) => (
                      <li
                        key={attempt.id}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm"
                        style={{
                          borderColor: "var(--rule)",
                          fontWeight:
                            attempt.guest_name === name.trim() &&
                            attempt.score === score
                              ? 600
                              : 400,
                        }}
                      >
                        <span>
                          {i + 1}. {attempt.guest_name}
                        </span>
                        <span style={{ color: "var(--whisper)" }}>
                          {attempt.score}/{attempt.total} ·{" "}
                          {formatDate(attempt.created_at)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
