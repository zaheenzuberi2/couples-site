"use client";

import { useState } from "react";
import {
  addQuizQuestion,
  deleteQuizQuestion,
  saveQuizQuestion,
} from "@/app/dashboard/actions";
import type { QuizQuestion } from "@/lib/types";
import { Field, Section, ghostButtonClass, inputClass } from "./ui";

const MAX_OPTIONS = 4;

/**
 * Free on every plan. Each question keeps 2-4 options in a fixed-width
 * form (option_0..option_3) rather than a dynamic array, since a quiz
 * question genuinely never needs more than four - simpler than wiring up
 * add/remove-option controls for a case that doesn't come up.
 */
export default function QuizEditor({
  siteId,
  questions,
}: {
  siteId: string;
  questions: QuizQuestion[];
}) {
  return (
    <Section
      title="Quiz"
      hint="A short 'how well do you know us' game for your guests, with a live leaderboard."
    >
      {questions.length === 0 && (
        <p className="mb-6 border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          Nothing here yet. This section (and the leaderboard) stays hidden
          on your page until you add a question.
        </p>
      )}

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionForm key={q.id} siteId={siteId} question={q} />
        ))}
      </div>

      <NewQuestionForm siteId={siteId} />
    </Section>
  );
}

function QuestionForm({
  siteId,
  question,
}: {
  siteId: string;
  question: QuizQuestion;
}) {
  const [options, setOptions] = useState<string[]>(
    padOptions(question.options)
  );
  const [correct, setCorrect] = useState(question.correct_index);

  return (
    <form
      action={saveQuizQuestion}
      className="border border-line bg-card p-5"
    >
      <input type="hidden" name="site_id" value={siteId} />
      <input type="hidden" name="question_id" value={question.id} />
      <input type="hidden" name="correct_index" value={correct} />

      <Field label="Question" htmlFor={`q-${question.id}`}>
        <input
          id={`q-${question.id}`}
          name="question"
          defaultValue={question.question}
          placeholder="Who said 'I love you' first?"
          className={inputClass}
        />
      </Field>

      <fieldset className="mt-4">
        <legend className="block text-xs tracking-[0.16em] text-muted uppercase">
          Options (mark the correct one)
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
      </fieldset>

      <div className="mt-5 flex items-center gap-3">
        <button type="submit" className={ghostButtonClass}>
          Save
        </button>
        <button
          type="submit"
          formAction={deleteQuizQuestion}
          className="text-xs tracking-[0.16em] text-muted uppercase hover:text-accent"
        >
          Remove
        </button>
      </div>
    </form>
  );
}

function NewQuestionForm({ siteId }: { siteId: string }) {
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  return (
    <form
      action={addQuizQuestion}
      className="mt-6 border border-dashed border-line p-5"
    >
      <input type="hidden" name="site_id" value={siteId} />
      <input type="hidden" name="correct_index" value={correct} />

      <Field label="New question" htmlFor="new-question">
        <input
          id="new-question"
          name="question"
          placeholder="What's his favourite food?"
          className={inputClass}
        />
      </Field>

      <fieldset className="mt-4">
        <legend className="block text-xs tracking-[0.16em] text-muted uppercase">
          Options (mark the correct one)
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
      </fieldset>

      <button type="submit" className={`${ghostButtonClass} mt-5`}>
        Add question
      </button>
    </form>
  );
}

const OPTION_LABELS = ["A", "B", "C", "D"];

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
      className={`flex items-center gap-2 border p-2 ${
        selected ? "border-accent bg-accent-soft" : "border-line"
      }`}
    >
      <input
        type="radio"
        checked={selected}
        onChange={onSelect}
        className="accent-[var(--accent)]"
        aria-label="Correct answer"
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
