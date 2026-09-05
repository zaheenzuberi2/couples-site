"use client";

import { useState } from "react";
import Link from "next/link";
import { COUPLE_GAME_QUESTIONS } from "@/components/play/couple-game-questions";
import { PLAY_COLORS, PlayButton, PlayCard, playInputClass } from "@/components/play/ui";

type Stage = "names" | "play" | "result";

export default function CoupleGame() {
  const [stage, setStage] = useState<Stage>("names");
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  const total = COUPLE_GAME_QUESTIONS.length;
  // Derived from answers.length rather than tracked separately, so a fast
  // double-tap can't advance the question shown without also recording the
  // answer that went with it.
  const index = answers.length;

  function startGame(e: React.FormEvent) {
    e.preventDefault();
    if (!nameA.trim() || !nameB.trim()) return;
    setStage("play");
  }

  function pick(name: string) {
    setAnswers((prev) => {
      if (prev.length >= total) return prev;
      const next = [...prev, name];
      if (next.length === total) setStage("result");
      return next;
    });
  }

  function playAgain() {
    setAnswers([]);
    setStage("play");
  }

  const countA = answers.filter((a) => a === nameA).length;
  const countB = answers.filter((a) => a === nameB).length;

  return (
    <PlayCard>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        Who&apos;s More Likely?
      </h2>
      <p className="mt-1 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
        {total} questions. No sign-up, just point fingers.
      </p>

      <div className="mt-5">
        {stage === "names" && (
          <form onSubmit={startGame} className="space-y-3">
            <input
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              placeholder="Your name"
              required
              className={playInputClass}
            />
            <input
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              placeholder="Their name"
              required
              className={playInputClass}
            />
            <PlayButton type="submit" className="w-full">
              Start the game
            </PlayButton>
          </form>
        )}

        {stage === "play" && (
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: PLAY_COLORS.mint }}>
              Question {index + 1} of {total}
            </p>
            <h3 className="mt-2 text-xl font-bold" style={{ color: PLAY_COLORS.ink }}>
              {COUPLE_GAME_QUESTIONS[index]}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => pick(nameA)}
                className="rounded-2xl px-4 py-5 text-center text-sm font-semibold transition-transform active:scale-95"
                style={{ background: PLAY_COLORS.coralSoft, color: PLAY_COLORS.ink }}
              >
                {nameA}
              </button>
              <button
                type="button"
                onClick={() => pick(nameB)}
                className="rounded-2xl px-4 py-5 text-center text-sm font-semibold transition-transform active:scale-95"
                style={{ background: PLAY_COLORS.mintSoft, color: PLAY_COLORS.ink }}
              >
                {nameB}
              </button>
            </div>
          </div>
        )}

        {stage === "result" && (
          <div>
            <div className="flex items-center justify-center gap-6 text-center">
              <div>
                <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.coral }}>
                  {countA}
                </p>
                <p className="mt-1 text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
                  {nameA}
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.mint }}>
                  {countB}
                </p>
                <p className="mt-1 text-xs" style={{ color: PLAY_COLORS.inkSoft }}>
                  {nameB}
                </p>
              </div>
            </div>

            <ol className="mt-6 space-y-1.5 text-left">
              {COUPLE_GAME_QUESTIONS.map((q, i) => (
                <li
                  key={q}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm"
                  style={{ background: "#faf3ec" }}
                >
                  <span style={{ color: PLAY_COLORS.ink }}>{q}</span>
                  <span className="shrink-0 font-semibold" style={{ color: PLAY_COLORS.inkSoft }}>
                    {answers[i]}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PlayButton type="button" variant="ghost" onClick={playAgain}>
                Play again
              </PlayButton>
              <Link
                href="/login"
                className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
                style={{ background: PLAY_COLORS.coral }}
              >
                Save This to a Gift Website
              </Link>
            </div>
          </div>
        )}
      </div>
    </PlayCard>
  );
}
