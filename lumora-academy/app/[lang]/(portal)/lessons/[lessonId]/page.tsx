"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import type { ApiResource, Lesson, LessonProgress } from "../../../../lib/types";

export default function LessonPage() {
  const { lang, lessonId } = useParams<{ lang: string; lessonId: string }>();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    apiFetch<ApiResource<Lesson>>(`/api/v1/lessons/${lessonId}`, {
      auth: false,
    })
      .then((res) => setLesson(res.data))
      .catch(() => setError("Could not load this lesson."));
  }, [lessonId]);

  async function markComplete() {
    setMarking(true);
    try {
      const res = await apiFetch<ApiResource<LessonProgress>>(
        `/api/v1/lessons/${lessonId}/progress`,
        { method: "POST" },
      );
      setCompletedAt(res.data.completed_at);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark complete.");
    } finally {
      setMarking(false);
    }
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!lesson) return <p className="text-zinc-500">Loading…</p>;

  return (
    <article className="flex flex-col gap-4">
      <Link href={`/${lang}/topics/${lesson.topic_id}`} className="text-sm underline">
        ← Back to topic
      </Link>
      <h1 className="text-xl font-semibold">{lesson.title}</h1>
      <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
        {lesson.body}
      </div>
      {user?.role === "student" && (
        <div>
          <button
            type="button"
            onClick={markComplete}
            disabled={marking || !!completedAt}
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {completedAt ? "Completed" : marking ? "Marking…" : "Mark complete"}
          </button>
        </div>
      )}
    </article>
  );
}
