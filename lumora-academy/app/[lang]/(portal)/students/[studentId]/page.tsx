"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import type {
  ApiCollection,
  AssessmentAttempt,
  LessonProgress,
  TutorMessage,
} from "../../../../lib/types";

export default function StudentDetailPage() {
  const { lang, studentId } = useParams<{ lang: string; studentId: string }>();
  const [progress, setProgress] = useState<LessonProgress[] | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[] | null>(null);
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiCollection<LessonProgress>>(
        `/api/v1/students/${studentId}/progress`,
      ),
      apiFetch<ApiCollection<AssessmentAttempt>>(
        `/api/v1/students/${studentId}/attempts`,
      ),
    ])
      .then(([progressRes, attemptsRes]) => {
        setProgress(progressRes.data);
        setAttempts(attemptsRes.data);
      })
      .catch(() => setError("Could not load this student's data."));
  }, [studentId]);

  useEffect(() => {
    apiFetch<ApiCollection<TutorMessage>>(
      `/api/v1/students/${studentId}/tutor-messages`,
    )
      .then((res) => setTutorMessages([...res.data].reverse())) // newest-first -> chronological
      .catch(() => {
        // A 403 here (unlinked student) or any other failure just means this
        // read-only section stays empty — it shouldn't block the progress/
        // attempts sections above, which have their own access check.
      });
  }, [studentId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!progress || !attempts) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <Link href={`/${lang}/students`} className="text-sm underline">
        ← My students
      </Link>

      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Lesson progress</h1>
        {progress.length === 0 && (
          <p className="text-zinc-500">No lessons completed yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {progress.map((p) => (
            <li
              key={p.id}
              className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
            >
              Lesson #{p.lesson_id} —{" "}
              {p.completed_at
                ? `completed ${new Date(p.completed_at).toLocaleString()}`
                : "in progress"}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Assessment attempts</h2>
        {attempts.length === 0 && (
          <p className="text-zinc-500">No assessment attempts yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {attempts.map((a) => (
            <li
              key={a.id}
              className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
            >
              Assessment #{a.assessment_id} — score:{" "}
              {a.score ?? "not yet scored"}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Tutor conversation</h2>
        {tutorMessages === null && (
          <p className="text-zinc-500">Loading…</p>
        )}
        {tutorMessages && tutorMessages.length === 0 && (
          <p className="text-zinc-500">No Tutor conversation yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {tutorMessages?.map((message) => (
            <li
              key={message.id}
              className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <p className="font-medium">{message.question}</p>
              <p>
                {message.answer}
                {message.outcome !== "pass" && (
                  <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {message.outcome === "escalate" ? "flagged for review" : message.outcome}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
