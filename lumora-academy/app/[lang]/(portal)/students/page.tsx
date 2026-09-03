"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import type { ApiCollection, ApiResource, User } from "../../../lib/types";

export default function StudentsPage() {
  const { lang } = useParams<{ lang: string }>();
  const { user } = useAuth();
  const [students, setStudents] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function loadStudents() {
    apiFetch<ApiCollection<User>>("/api/v1/students")
      .then((res) => setStudents(res.data))
      .catch(() => setError("Could not load students."));
  }

  useEffect(loadStudents, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);
    try {
      await apiFetch<ApiResource<User>>("/api/v1/students", {
        method: "POST",
        body: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      loadStudents();
    } catch (err) {
      setFormErrors(
        err instanceof ApiError && err.errors
          ? err.errors
          : { name: ["Could not create student."] },
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (user && user.role !== "parent") {
    return <p className="text-zinc-500">Only Parent accounts have students.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">My students</h1>
        {error && <p className="text-red-600">{error}</p>}
        {!students && !error && <p className="text-zinc-500">Loading…</p>}
        {students && students.length === 0 && (
          <p className="text-zinc-500">No students linked yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {students?.map((student) => (
            <li key={student.id}>
              <Link
                href={`/${lang}/students/${student.id}`}
                className="block rounded border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                {student.name} ({student.email})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex max-w-sm flex-col gap-3">
        <h2 className="text-lg font-semibold">Add a student</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {formErrors.name?.map((m) => (
              <span key={m} className="text-red-600">
                {m}
              </span>
            ))}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {formErrors.email?.map((m) => (
              <span key={m} className="text-red-600">
                {m}
              </span>
            ))}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {formErrors.password?.map((m) => (
              <span key={m} className="text-red-600">
                {m}
              </span>
            ))}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Confirm password
            <input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {submitting ? "Adding…" : "Add student"}
          </button>
        </form>
      </section>
    </div>
  );
}
