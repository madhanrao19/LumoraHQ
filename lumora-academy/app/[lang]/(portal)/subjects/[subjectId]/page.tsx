"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import type { ApiCollection, Topic } from "../../../../lib/types";

export default function SubjectTopicsPage() {
  const { lang, subjectId } = useParams<{ lang: string; subjectId: string }>();
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiCollection<Topic>>(
      `/api/v1/topics?subject_id=${subjectId}`,
      { auth: false },
    )
      .then((res) => setTopics(res.data))
      .catch(() => setError("Could not load topics."));
  }, [subjectId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!topics) return <p className="text-zinc-500">Loading topics…</p>;

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/${lang}/subjects`} className="text-sm underline">
        ← Subjects
      </Link>
      <h1 className="text-xl font-semibold">Topics</h1>
      {topics.length === 0 && (
        <p className="text-zinc-500">No topics in this subject yet.</p>
      )}
      <ul className="flex flex-col gap-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={`/${lang}/topics/${topic.id}`}
              className="block rounded border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
