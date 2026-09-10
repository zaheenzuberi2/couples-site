"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/env";
import {
  POPULAR_IDS,
  entriesByCategory,
  entryById,
  matchQuery,
  type HelpEntry,
  type HelpLink,
} from "@/components/chatbot/faq-knowledge";
import { submitContactRequest } from "@/app/contact/actions";

/**
 * A self-serve help bubble. It is a keyword matcher over a hand written FAQ
 * (see faq-knowledge.ts), not a model, so it costs nothing to run and never
 * makes up an answer. When it cannot help, it offers a "leave your number"
 * box that writes straight to contact_requests for the owner to follow up.
 *
 * Mounted once in the root layout. It renders nothing on a couple's own
 * published page or the private preview - a support widget there would be
 * noise for their visitors - so it only shows on the marketing and product
 * surfaces listed in SHOW_ON.
 */

const STORAGE_KEY = "ours-help-chat";

// Prefix match. A single-segment path not covered here (a couple slug) or a
// preview / admin route never shows the bubble.
const SHOW_ON = [
  "/login",
  "/play",
  "/dashboard",
  "/privacy",
  "/terms",
  "/auth",
  "/demo",
];

function isShownOn(pathname: string): boolean {
  if (pathname === "/") return true;
  return SHOW_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const CONTACT_INTENT =
  /\b(call|phone|whats ?app|contact|human|agent|representative|speak|talk to|reach you|reach out|ring me|message me|get in touch)\b/i;

type Msg = {
  role: "user" | "bot";
  text: string;
  /** Set on a bot answer that came from a knowledge base entry. */
  entryId?: string;
  /** Related question ids shown as follow-up chips. */
  relatedIds?: string[];
  /** Show the "leave your number" button under this message. */
  cta?: boolean;
  /** Show the popular-question chips under this message (the fallback). */
  popular?: boolean;
};

const GREETING: Msg = {
  role: "bot",
  text: `Hi. Ask me anything about ${BRAND}, the price, sign-in, publishing, the free games. Pick one below or type your question.`,
  popular: true,
  cta: true,
};

/**
 * Read the saved transcript as the lazy initial state. Guarded for SSR, and
 * safe against a hydration mismatch because the message list only renders
 * once the panel is open, which always starts closed on both server and
 * client.
 */
function loadInitialMessages(): Msg[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw) as { messages?: Msg[] };
    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed.messages.slice(-40);
    }
  } catch {
    // fall through
  }
  return [GREETING];
}

export function HelpChat() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadInitialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"chat" | "contact">("chat");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const answerTimerRef = useRef<number | null>(null);

  // Persist the transcript so a reload keeps the conversation. Open state is
  // deliberately not saved: a help bubble that reopens itself on every page
  // is a nuisance.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages: messages.slice(-40) })
      );
    } catch {
      // Private mode or storage disabled - the widget still works, it just
      // forgets between reloads.
    }
  }, [messages]);

  // Escape closes. Only bound while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the field when the chat opens.
  useEffect(() => {
    if (open && mode === "chat") {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open, mode]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending, mode, open]);

  useEffect(() => {
    return () => {
      if (answerTimerRef.current) window.clearTimeout(answerTimerRef.current);
    };
  }, []);

  // One place for the "reply after a short beat" behaviour, so a typed
  // question and a tapped chip look and feel identical.
  const scheduleBot = useCallback(
    (make: () => Msg) => {
      setPending(true);
      if (answerTimerRef.current) window.clearTimeout(answerTimerRef.current);
      answerTimerRef.current = window.setTimeout(
        () => {
          setMessages((m) => [...m, make()]);
          setPending(false);
        },
        reduceMotion ? 0 : 440
      );
    },
    [reduceMotion]
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setMessages((m) => [...m, { role: "user", text }]);
      setInput("");
      scheduleBot(() => {
        const matches = matchQuery(text, 3);
        const wantsContact = CONTACT_INTENT.test(text);
        if (matches.length === 0) {
          return {
            role: "bot",
            text: "I could not find a sure answer to that one. These are the things people ask most, or leave your number and we will get back to you.",
            popular: true,
            cta: true,
          };
        }
        const [top, ...rest] = matches;
        return {
          role: "bot",
          text: top.entry.a,
          entryId: top.entry.id,
          relatedIds: rest.map((r) => r.entry.id),
          cta: wantsContact || top.entry.id === "misc-contact",
        };
      });
    },
    [scheduleBot]
  );

  const askEntry = useCallback(
    (entry: HelpEntry) => {
      setMessages((m) => [...m, { role: "user", text: entry.q }]);
      const relatedIds = entriesByCategory(entry.cat)
        .filter((e) => e.id !== entry.id)
        .slice(0, 2)
        .map((e) => e.id);
      scheduleBot(() => ({
        role: "bot",
        text: entry.a,
        entryId: entry.id,
        relatedIds,
        cta: entry.id === "misc-contact",
      }));
    },
    [scheduleBot]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const popular = useMemo(
    () => POPULAR_IDS.map((id) => entryById(id)).filter(Boolean) as HelpEntry[],
    []
  );

  if (!isShownOn(pathname)) return null;

  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="help-chat-panel"
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="fixed right-4 bottom-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_16px_36px_-12px_rgba(156,63,91,0.6)] transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="x"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              initial={reduceMotion ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path
                d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H9l-4 3.5V16H5.5A1.5 1.5 0 014 14.5v-9z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="help-chat-panel"
            role="dialog"
            aria-label={`${BRAND} help`}
            className="fixed inset-x-2 bottom-2 top-2 z-[90] flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,0.4)] sm:inset-auto sm:right-4 sm:bottom-24 sm:top-auto sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:w-[400px]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              {mode === "contact" && (
                <button
                  type="button"
                  onClick={() => setMode("chat")}
                  aria-label="Back to questions"
                  className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M15 6l-6 6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <span className="flex items-center gap-2 font-display text-lg">
                <BrandMark size={20} color="var(--accent)" />
                {mode === "contact" ? "Leave your number" : "Ask us anything"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close help chat"
                className="-mr-2 ml-auto flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {mode === "chat" ? (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
                  aria-live="polite"
                >
                  {messages.map((m, i) => (
                    <MessageRow
                      key={i}
                      msg={m}
                      popular={popular}
                      onAsk={askEntry}
                      onContact={() => setMode("contact")}
                    />
                  ))}
                  {pending && <TypingDots reduceMotion={Boolean(reduceMotion)} />}
                </div>

                <div className="border-t border-line px-3 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => setMode("contact")}
                    className="text-xs text-muted underline underline-offset-4 hover:text-accent"
                  >
                    Rather have someone contact you? Leave your number
                  </button>
                </div>

                <form
                  onSubmit={onSubmit}
                  className="flex items-center gap-2 border-t border-line p-3"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question"
                    aria-label="Type your question"
                    className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="M4 12l16-8-6 16-3-7-7-1z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <ContactPanel
                pathname={pathname}
                onDone={(confirmText) => {
                  setMessages((m) => [...m, { role: "bot", text: confirmText }]);
                  setMode("chat");
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* --------------------------------------------------------------- rendering */

function MessageRow({
  msg,
  popular,
  onAsk,
  onContact,
}: {
  msg: Msg;
  popular: HelpEntry[];
  onAsk: (entry: HelpEntry) => void;
  onContact: () => void;
}) {
  if (msg.role === "user") {
    return (
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-accent px-3.5 py-2.5 text-sm text-white">
        {msg.text}
      </p>
    );
  }

  const entry = msg.entryId ? entryById(msg.entryId) : undefined;
  const related = (msg.relatedIds ?? [])
    .map((id) => entryById(id))
    .filter(Boolean) as HelpEntry[];
  const links: HelpLink[] = entry?.links ?? [];

  return (
    <div className="max-w-[92%] space-y-2">
      <p className="max-w-[92%] rounded-2xl rounded-tl-sm bg-accent-soft px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
        {msg.text}
      </p>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              prefetch={false}
              className="inline-flex items-center gap-1 rounded-full border border-accent/30 px-3 py-1 text-xs text-accent hover:bg-accent-soft"
            >
              {l.label}
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-wide text-muted uppercase">
            Related
          </p>
          {related.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onAsk(e)}
              className="block w-full rounded-xl border border-line px-3 py-2 text-left text-xs leading-snug hover:border-accent hover:text-accent"
            >
              {e.q}
            </button>
          ))}
        </div>
      )}

      {msg.popular && (
        <div className="space-y-1.5">
          {popular.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onAsk(e)}
              className="block w-full rounded-xl border border-line px-3 py-2 text-left text-xs leading-snug hover:border-accent hover:text-accent"
            >
              {e.q}
            </button>
          ))}
        </div>
      )}

      {msg.cta && (
        <button
          type="button"
          onClick={onContact}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-white active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Leave your number
        </button>
      )}
    </div>
  );
}

function TypingDots({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <p className="w-fit rounded-2xl rounded-tl-sm bg-accent-soft px-3.5 py-2.5 text-sm text-muted">
        typing…
      </p>
    );
  }
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-accent-soft px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent/60"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- contact */

function ContactPanel({
  pathname,
  onDone,
}: {
  pathname: string;
  onDone: (confirmText: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Controlled so a validation bounce never wipes what they typed - React
  // resets an uncontrolled function-action form even when the action fails.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function action() {
    setBusy(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("phone", phone);
    formData.set("message", message);
    formData.set("page", pathname);
    const res = await submitContactRequest(formData);
    setBusy(false);
    if (res.ok) {
      onDone(res.message);
    } else {
      setError(res.message);
    }
  }

  return (
    <form
      action={action}
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
    >
      <p className="text-sm leading-relaxed text-muted">
        Drop your number and a line about what you need. We will call or
        message you back, usually within a day.
      </p>

      <label className="block text-sm">
        <span className="text-xs tracking-wide text-muted uppercase">
          Name (optional)
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs tracking-wide text-muted uppercase">
          Phone number
        </span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder="+92 3XX XXXXXXX"
          className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs tracking-wide text-muted uppercase">
          What is it about? (optional)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-auto w-full rounded-full bg-accent py-3 text-xs font-medium tracking-[0.2em] text-white uppercase transition-opacity disabled:opacity-50"
      >
        {busy ? "Sending…" : "Send my number"}
      </button>
      <p className="text-center text-[11px] text-muted">
        Only used to reply to you. See our{" "}
        <Link href="/privacy" prefetch={false} className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
