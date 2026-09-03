"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import type {
  ApiCollection,
  ApiResource,
  Assessment,
  AssessmentAttempt,
} from "../../../../lib/types";

export default function AssessmentPage() {
  const { lang, assessmentId } = useParams<{ lang: string; assessmentId: string }>();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [result, setResult] = useState<AssessmentAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<ApiResource<Assessment>>(`/api/v1/assessments/${assessmentId}`, {
      auth: false,
    })
      .then((res) => setAssessment(res.data))
      .catch(() => setError("Could not load this assessment."));
  }, [assessmentId]);

  useEffect(() => {
    if (user?.role !== "student") return;
    apiFetch<ApiCollection<AssessmentAttempt>>(
      `/api/v1/assessments/${assessmentId}/attempts`,
    )
      .then((res) => setAttempts(res.data))
      .catch(() => {
        // Past attempts are a nice-to-have below the fold — a failure here
        // shouldn't block viewing/taking the assessment itself.
      });
  }, [assessmentId, user, result]);

  function setResponse(questionId: number, value: string) {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiFetch<ApiResource<AssessmentAttempt>>(
        `/api/v1/assessments/${assessmentId}/attempts`,
        { method: "POST", body: { responses } },
      );
      setResult(res.data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not submit this attempt.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !assessment) return <p className="text-red-600">{error}</p>;
  if (!assessment) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/${lang}/topics/${assessment.topic_id}`}
        className="text-sm underline"
      >
        ← Back to topic
      </Link>

      <h1 className="text-xl font-semibold">{assessment.title}</h1>

      {result ? (
        <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-lg font-semibold">Score: {result.score}%</p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {assessment.questions.map((question) => (
            <fieldset
              key={question.id}
              className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <legend className="font-medium">{question.prompt}</legend>
              {question.options ? (
                <div className="mt-2 flex flex-col gap-1">
                  {Object.entries(question.options).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={key}
                        checked={responses[question.id] === key}
                        onChange={() => setResponse(question.id, key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  aria-label={question.prompt}
                  className="mt-2 w-full rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
                  value={responses[question.id] ?? ""}
                  onChange={(e) => setResponse(question.id, e.target.value)}
                />
              )}
            </fieldset>
          ))}

          {error && <p className="text-red-600">{error}</p>}

          {user?.role === "student" ? (
            <button
              type="submit"
              disabled={submitting}
              className="self-start rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          ) : (
            <p className="text-zinc-500">Only students can take assessments.</p>
          )}
        </form>
      )}

      {user?.role === "student" && attempts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Past attempts</h2>
          <ul className="flex flex-col gap-2">
            {attempts.map((attempt) => (
              <li
                key={attempt.id}
                className="rounded border border-zinc-200 p-3 dark:border-zinc-800"
              >
                Score: {attempt.score}%
                {attempt.completed_at &&
                  ` — ${new Date(attempt.completed_at).toLocaleString()}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
