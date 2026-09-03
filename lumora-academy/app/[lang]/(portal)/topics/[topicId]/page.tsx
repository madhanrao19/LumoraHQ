"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import type { ApiCollection, Assessment, Lesson } from "../../../../lib/types";

export default function TopicPage() {
  const { lang, topicId } = useParams<{ lang: string; topicId: string }>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiCollection<Lesson>>(`/api/v1/topics/${topicId}/lessons`, {
        auth: false,
      }),
      apiFetch<ApiCollection<Assessment>>(
        `/api/v1/topics/${topicId}/assessments`,
        { auth: false },
      ),
    ])
      .then(([lessonsRes, assessmentsRes]) => {
        setLessons(lessonsRes.data);
        setAssessments(assessmentsRes.data);
      })
      .catch(() => setError("Could not load this topic's content."));
  }, [topicId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!lessons || !assessments) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href={`/${lang}/subjects`} className="text-sm underline">
        ← Subjects
      </Link>

      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Lessons</h1>
        {lessons.length === 0 && (
          <p className="text-zinc-500">No published lessons yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/${lang}/lessons/${lesson.id}`}
                className="block rounded border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Assessments</h2>
        {assessments.length === 0 && (
          <p className="text-zinc-500">No published assessments yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {assessments.map((assessment) => (
            <li key={assessment.id}>
              <Link
                href={`/${lang}/assessments/${assessment.id}`}
                className="block rounded border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                {assessment.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
