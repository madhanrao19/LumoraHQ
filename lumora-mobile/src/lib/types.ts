// Shapes mirror the Laravel API's App\Http\Resources\* classes exactly
// (lumora-api/app/Http/Resources) — ported verbatim from lumora-academy's
// app/lib/types.ts, already checked against source there.

export type Role = "student" | "parent" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Subject = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

export type Topic = {
  id: number;
  subject_id: number;
  grade_level_id: number;
  name: string;
  slug: string;
  order: number;
};

export type Lesson = {
  id: number;
  topic_id: number;
  title: string;
  slug: string;
  body: string;
  published_at: string | null;
};

export type Assessment = {
  id: number;
  topic_id: number;
  title: string;
  published_at: string | null;
  questions: unknown[];
};

export type LessonProgress = {
  id: number;
  lesson_id: number;
  completed_at: string | null;
};

export type AssessmentAttempt = {
  id: number;
  assessment_id: number;
  responses: Record<string, unknown>;
  score: number | null;
  completed_at: string | null;
};

export type ApiCollection<T> = { data: T[] };
export type ApiResource<T> = { data: T };
