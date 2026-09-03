"use client";

import { useState } from "react";
import {
  addQuizQuestion,
  deleteQuizQuestion,
  saveQuizQuestion,
} from "@/app/play/actions";
import type { PlayQuizQuestion } from "@/lib/play-types";
import { PLAY_COLORS, PlayButton, PlayCard, playInputClass } from "@/components/play/ui";

const MAX_OPTIONS = 4;
const OPTION_LABELS = ["A", "B", "C", "D"];

export default function PlayQuizEditor({
  editToken,
  slug,
  questions,
}: {
  editToken: string;
  slug: string;
  questions: PlayQuizQuestion[];
}) {
  return (
    <PlayCard>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-baloo)", color: PLAY_COLORS.ink }}
      >
        Quiz
      </h2>
      <p className="mt-1 text-sm" style={{ color: PLAY_COLORS.inkSoft }}>
        Guests play for fun and land on a live leaderboard.
      </p>

      <div className="mt-5 space-y-4">
        {questions.map((q) => (
          <QuestionForm key={q.id} editToken={editToken} slug={slug} question={q} />
        ))}
      </div>

      <NewQuestionForm editToken={editToken} slug={slug} />
    </PlayCard>
  );
}

function QuestionForm({
  editToken,
  slug,
  question,
}: {
  editToken: string;
  slug: string;
  question: PlayQuizQuestion;
}) {
  const [options, setOptions] = useState<string[]>(padOptions(question.options));
  const [correct, setCorrect] = useState(question.correct_index);

  return (
    <form
      action={saveQuizQuestion}
      className="rounded-2xl p-5"
      style={{ background: "#faf3ec" }}
    >
      <input type="hidden" name="edit_token" value={editToken} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="question_id" value={question.id} />
      <input type="hidden" name="correct_index" value={correct} />

      <input
        name="question"
        defaultValue={question.question}
        placeholder="Who said 'I love you' first?"
        className={playInputClass}
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((value, i) => (
          <OptionRow
            key={i}
            name={`option_${i}`}
            label={OPTION_LABELS[i]}
            value={value}
            onChange={(v) => {
              const next = [...options];
              next[i] = v;
              setOptions(next);
            }}
            selected={correct === i}
            onSelect={() => setCorrect(i)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <PlayButton type="submit" variant="secondary">
          Save
        </PlayButton>
        <button
          type="submit"
          formAction={deleteQuizQuestion}
          className="text-xs font-semibold"
          style={{ color: PLAY_COLORS.coral }}
        >
          Remove
        </button>
      </div>
    </form>
  );
}

function NewQuestionForm({ editToken, slug }: { editToken: string; slug: string }) {
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  return (
    <form
      action={addQuizQuestion}
      className="mt-4 rounded-2xl border-2 border-dashed p-5"
      style={{ borderColor: `${PLAY_COLORS.ink}22` }}
    >
      <input type="hidden" name="edit_token" value={editToken} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="correct_index" value={correct} />

      <input
        name="question"
        placeholder="What's their favourite food?"
        className={playInputClass}
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((value, i) => (
          <OptionRow
            key={i}
            name={`option_${i}`}
            label={OPTION_LABELS[i]}
            value={value}
            onChange={(v) => {
              const next = [...options];
              next[i] = v;
              setOptions(next);
            }}
            selected={correct === i}
            onSelect={() => setCorrect(i)}
          />
        ))}
      </div>

      <PlayButton type="submit" className="mt-4">
        Add question
      </PlayButton>
    </form>
  );
}

function OptionRow({
  name,
  label,
  value,
  onChange,
  selected,
  onSelect,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{
        background: selected ? PLAY_COLORS.mintSoft : "#fff",
        border: `2px solid ${selected ? PLAY_COLORS.mint : "transparent"}`,
      }}
    >
      <input
        type="radio"
        checked={selected}
        onChange={onSelect}
        aria-label="Correct answer"
        style={{ accentColor: PLAY_COLORS.mint }}
      />
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${label}`}
        className="w-full bg-transparent text-base outline-none sm:text-sm"
      />
    </label>
  );
}

function padOptions(options: string[]): string[] {
  const padded = [...options];
  while (padded.length < MAX_OPTIONS) padded.push("");
  return padded.slice(0, MAX_OPTIONS);
}
