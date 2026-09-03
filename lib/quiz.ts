/**
 * The quiz editor (both the website's old one and the standalone /play one)
 * keeps a fixed 4-slot form (option_0..option_3), so a blank slot in the
 * middle is normal, not an error - someone filling A and C but skipping B
 * is a real shape. Blanks are dropped here, and correct_index (which points
 * at a slot in the original 4, from the radio that was picked) is remapped
 * to where that same option lands after the drop - getting this wrong
 * would silently record the wrong answer as correct.
 */
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

export function quizOptionsFrom(formData: FormData): {
  options: string[];
  correctIndex: number;
} {
  const slots = Array.from({ length: MAX_OPTIONS }, (_, i) =>
    String(formData.get(`option_${i}`) ?? "").trim()
  );
  const pickedSlot = Math.min(
    Math.max(0, Number(formData.get("correct_index") ?? 0)),
    MAX_OPTIONS - 1
  );

  const options: string[] = [];
  let correctIndex = 0;
  slots.forEach((value, slot) => {
    if (!value) return;
    if (slot === pickedSlot) correctIndex = options.length;
    options.push(value);
  });

  return { options, correctIndex };
}

export function hasEnoughOptions(options: string[]): boolean {
  return options.length >= MIN_OPTIONS;
}
