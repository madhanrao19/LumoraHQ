// Shapes mirror the Laravel API's App\Http\Resources\* classes exactly
// (lumora-api/app/Http/Resources) — checked against source, not guessed.

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

// `options` is a free-form key => label map (e.g. { A: "Paris", B: "London" })
// for multiple-choice-style questions, or null for free-text ones — `type`
// itself is an unstandardized free string (see QuestionForm.php), so
// rendering branches on `options` shape, not `type` value.
export type Question = {
  id: number;
  type: string;
  prompt: string;
  options: Record<string, string> | null;
};

export type Assessment = {
  id: number;
  topic_id: number;
  title: string;
  published_at: string | null;
  questions: Question[];
};

export type LessonProgress = {
  id: number;
  lesson_id: number;
  completed_at: string | null;
};

export type AssessmentAttempt = {
  id: number;
  assessment_id: number;
  // Always ships as a list on the wire, not a { questionId: answer } object —
  // Laravel's JsonResource::filter() reindexes any nested array whose keys
  // are all numeric (question IDs always are), verified against a live
  // response. Untyped further since nothing here reads it.
  responses: unknown[];
  score: number | null;
  completed_at: string | null;
};

// outcome is display-only (e.g. a "flagged for review" badge on Escalate) —
// `answer` is always the safe, final text to render, already substituted
// server-side by TutorAgent for any non-Pass outcome. Never branch rendering
// of `answer` itself on `outcome`.
export type TutorOutcome = "pass" | "redirect" | "block" | "escalate";

export type TutorMessage = {
  id: number;
  question: string;
  answer: string;
  outcome: TutorOutcome;
  created_at: string;
};

// Parent-only (never Student — see UserPolicy::viewAuditLog / ADR-0021).
// `output` for a tutor-answer entry may be the pre-safety-substitution
// answer; that's intentional oversight visibility, not a bug to hide.
export type AiGatewayLog = {
  id: number;
  tier: string;
  provider: string;
  model: string | null;
  prompt_key: string;
  output: string;
  status: string;
  created_at: string;
};

export type ApiCollection<T> = { data: T[] };
export type ApiResource<T> = { data: T };
