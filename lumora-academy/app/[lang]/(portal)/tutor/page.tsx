"use client";

// Student-only Tutor chat. Safety rule (see TutorMessage in ../../../lib/types):
// `message.answer` is always rendered verbatim, exactly as returned — the
// backend has already substituted the safe fallback text for any non-Pass
// outcome before it reaches this response. `outcome` is display-only (a
// small badge below), never a signal to alter what text is shown.
import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import type { ApiCollection, ApiResource, TutorMessage } from "../../../lib/types";

const QUESTION_MAX_LENGTH = 2000;

function OutcomeBadge({ outcome }: { outcome: TutorMessage["outcome"] }) {
  if (outcome === "pass") return null;
  const label = outcome === "escalate" ? "flagged for review" : outcome;
  return (
    <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200">
      {label}
    </span>
  );
}

export default function TutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TutorMessage[] | null>(null);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.role !== "student") return;
    apiFetch<ApiCollection<TutorMessage>>(`/api/v1/students/${user.id}/tutor-messages`)
      .then((res) => setMessages([...res.data].reverse())) // newest-first -> chronological
      .catch(() => setError("Could not load your Tutor conversation."));
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await apiFetch<ApiResource<TutorMessage>>("/api/v1/tutor/ask", {
        method: "POST",
        body: { question },
      });
      setMessages((prev) => [...(prev ?? []), res.data]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send that question.");
    } finally {
      setSending(false);
    }
  }

  if (user && user.role !== "student") {
    return <p className="text-zinc-500">Only Student accounts can use the Tutor.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Tutor</h1>

      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-4 dark:border-zinc-800">
        {!messages && !error && <p className="text-zinc-500">Loading…</p>}
        {messages && messages.length === 0 && (
          <p className="text-zinc-500">
            Ask the Tutor a question about your lessons to get started.
          </p>
        )}
        {messages?.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            <p className="self-end rounded bg-zinc-900 px-3 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              {message.question}
            </p>
            <p className="self-start rounded bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
              {message.answer}
              <OutcomeBadge outcome={message.outcome} />
            </p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label="Ask the Tutor"
          value={question}
          maxLength={QUESTION_MAX_LENGTH}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Ask a question…"
        />
        <button
          type="submit"
          disabled={sending || !question.trim()}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
