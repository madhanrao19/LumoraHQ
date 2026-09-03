"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import type { ApiCollection, Subject } from "../../../lib/types";

export default function SubjectsPage() {
  const { lang } = useParams<{ lang: string }>();
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiCollection<Subject>>("/api/v1/subjects", { auth: false })
      .then((res) => setSubjects(res.data))
      .catch(() => setError("Could not load subjects."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!subjects) return <p className="text-zinc-500">Loading subjects…</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Subjects</h1>
      <ul className="flex flex-col gap-2">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Link
              href={`/${lang}/subjects/${subject.id}`}
              className="block rounded border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {subject.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
