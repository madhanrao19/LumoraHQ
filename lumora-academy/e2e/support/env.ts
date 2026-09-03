// Shared constants for the E2E harness (global setup/teardown + specs).
//
// Port choice: 3000 is already occupied by an unrelated, pre-existing
// `next dev` instance in this environment (started outside this test run) —
// using 3100 here avoids fighting over it or having to kill a server this
// suite doesn't own.
import os from "node:os";
import path from "node:path";

export const API_PORT = 8000;
export const WEB_PORT = 3100;

export const API_URL = `http://127.0.0.1:${API_PORT}`;
export const WEB_URL = `http://127.0.0.1:${WEB_PORT}`;

// lumora-api is a sibling package of lumora-academy in the monorepo.
export const API_DIR = path.resolve(__dirname, "../../../lumora-api");

export const TMP_DIR = path.join(os.tmpdir(), "lumora-academy-e2e");
export const DB_PATH = path.join(TMP_DIR, "database.sqlite");
export const SEED_FILE = path.join(TMP_DIR, "seed.json");
export const PIDS_FILE = path.join(TMP_DIR, "pids.json");
export const API_LOG_FILE = path.join(TMP_DIR, "api-server.log");
export const WEB_LOG_FILE = path.join(TMP_DIR, "web-server.log");

// Env overrides passed to every `php artisan` invocation against lumora-api
// for this suite: an isolated, disposable sqlite db instead of the
// pgsql/redis stack lumora-api/.env is normally configured for, and
// array/sync/log drivers so nothing depends on Redis running locally.
// APP_ENV/AI_*_PROVIDER are left unset so the app keeps using NullAiProvider
// (see lumora-api/app/AiGateway/Providers/NullAiProvider.php) — no live AI
// credentials needed for the Tutor flow.
export function apiEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DB_CONNECTION: "sqlite",
    DB_DATABASE: DB_PATH,
    DB_URL: "",
    SESSION_DRIVER: "array",
    CACHE_STORE: "array",
    QUEUE_CONNECTION: "sync",
    MAIL_MAILER: "array",
    BROADCAST_CONNECTION: "log",
  };
}

export type SeedData = {
  subjectId: number;
  topicId: number;
  lessonId: number;
  lessonTitle: string;
  assessmentId: number;
  assessmentTitle: string;
  q1Id: number;
  q2Id: number;
};
