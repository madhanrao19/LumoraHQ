"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import type {
  ApiCollection,
  AssessmentAttempt,
  LessonProgress,
} from "../../../../lib/types";

export default function StudentDetailPage() {
  const { lang, studentId } = useParams<{ lang: string; studentId: string }>();
  const [progress, setProgress] = useState<LessonProgress[] | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[] | null>(null);
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
    </div>
  );
}
