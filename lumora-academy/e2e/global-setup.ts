// Boots a real lumora-api instance (sqlite, no external services) and a real
// production lumora-academy instance (`next build && next start` — see
// note below on why not `next dev`) for the E2E run, and seeds the
// curriculum content the specs browse. Playwright calls this once before
// any test file runs.
//
// What's automated vs. manual: this whole thing IS the automated path —
// `npm run test:e2e` needs nothing pre-started. The only prerequisites are
// what's already required to develop either app locally: PHP 8.5+ with
// pdo_sqlite (composer install already run in lumora-api/vendor) and Node
// with lumora-academy's npm install already run.
//
// build+start over dev: tried `next dev` first. Next.js 16 allows only one
// `next dev` per project directory (a real, currently-running one from
// outside this suite occupies E:\Dev\LumoraHQ\lumora-academy already) — a
// second one starts, then self-terminates once it notices the existing
// lock, which made the suite flaky/non-functional. `next build && next
// start` has no such lock and is also closer to a real deployed instance.
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  API_DIR,
  API_LOG_FILE,
  API_PORT,
  API_URL,
  DB_PATH,
  PIDS_FILE,
  SEED_FILE,
  TMP_DIR,
  WEB_LOG_FILE,
  WEB_PORT,
  WEB_URL,
  apiEnv,
} from "./support/env";

const ACADEMY_DIR = path.resolve(__dirname, "..");
const E2E_DIST_DIR = ".next-e2e";

function killTree(pid: number | undefined): void {
  if (!pid) return;
  try {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    // Already exited — fine.
  }
}

function writePids(apiPid?: number, webPid?: number): void {
  fs.writeFileSync(PIDS_FILE, JSON.stringify({ apiPid, webPid }));
}

async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`);
}

function seedContent(): void {
  // Fully-qualified class names since `tinker --execute` runs as a plain
  // script, not the interactive PsySH shell (no auto-imports there).
  // Content mirrors lumora-api's own factories — created via
  // `php artisan tinker`, not by editing any lumora-api file.
  const script = `
$subject = \\App\\Models\\Subject::factory()->create(['name' => 'E2E Science', 'order' => 1]);
$grade = \\App\\Models\\GradeLevel::factory()->create(['name' => 'E2E Grade 5']);
$topic = \\App\\Models\\Topic::factory()->create(['subject_id' => $subject->id, 'grade_level_id' => $grade->id, 'name' => 'E2E Photosynthesis Basics']);
$lesson = \\App\\Models\\Lesson::factory()->published()->create(['topic_id' => $topic->id, 'title' => 'Photosynthesis Overview', 'body' => 'Photosynthesis is how plants convert sunlight into energy. Chlorophyll captures light in the leaves.']);
$assessment = \\App\\Models\\Assessment::factory()->published()->create(['topic_id' => $topic->id, 'title' => 'E2E Photosynthesis Quiz']);
$q1 = \\App\\Models\\Question::factory()->published()->create(['topic_id' => $topic->id, 'prompt' => 'Which pigment captures sunlight?', 'options' => ['A' => 'Chlorophyll', 'B' => 'Melanin', 'C' => 'Keratin'], 'answer' => 'A']);
$q2 = \\App\\Models\\Question::factory()->published()->create(['topic_id' => $topic->id, 'prompt' => 'What do plants produce during photosynthesis?', 'options' => null, 'type' => 'short_answer', 'answer' => 'oxygen']);
$assessment->questions()->attach($q1->id, ['order' => 1]);
$assessment->questions()->attach($q2->id, ['order' => 2]);
echo 'SEED_JSON:' . json_encode(['subjectId' => $subject->id, 'topicId' => $topic->id, 'lessonId' => $lesson->id, 'lessonTitle' => $lesson->title, 'assessmentId' => $assessment->id, 'assessmentTitle' => $assessment->title, 'q1Id' => $q1->id, 'q2Id' => $q2->id]);
`;

  const output = execFileSync("php", ["artisan", "tinker", "--execute", script], {
    cwd: API_DIR,
    env: apiEnv(),
    encoding: "utf-8",
  });

  const line = output.split("\n").find((l) => l.startsWith("SEED_JSON:"));
  if (!line) {
    throw new Error(`Seeding produced no SEED_JSON line. Full output:\n${output}`);
  }
  fs.writeFileSync(SEED_FILE, line.slice("SEED_JSON:".length));
}

export default async function globalSetup(): Promise<void> {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, "");
  fs.rmSync(path.join(ACADEMY_DIR, E2E_DIST_DIR), { recursive: true, force: true });

  let apiServer: ChildProcess | undefined;
  let webServer: ChildProcess | undefined;

  try {
    console.log(`[e2e] migrating fresh sqlite db at ${DB_PATH}`);
    execFileSync("php", ["artisan", "migrate:fresh", "--force"], {
      cwd: API_DIR,
      env: apiEnv(),
      stdio: "inherit",
    });

    console.log("[e2e] seeding curriculum content");
    seedContent();

    console.log(`[e2e] starting lumora-api on ${API_URL}`);
    const apiLog = fs.openSync(API_LOG_FILE, "w");
    apiServer = spawn(
      "php",
      ["artisan", "serve", "--host=127.0.0.1", `--port=${API_PORT}`],
      {
        cwd: API_DIR,
        env: apiEnv(),
        stdio: ["ignore", apiLog, apiLog],
        windowsHide: true,
      },
    );
    writePids(apiServer.pid, undefined);
    await waitForHttp(`${API_URL}/up`, 30_000);

    const webEnv = {
      ...process.env,
      NEXT_PUBLIC_API_BASE_URL: API_URL,
      E2E_DIST_DIR,
    };
    const nextBin = path.join(ACADEMY_DIR, "node_modules", "next", "dist", "bin", "next");

    console.log("[e2e] building lumora-academy for the E2E run");
    execFileSync(process.execPath, [nextBin, "build"], {
      cwd: ACADEMY_DIR,
      env: webEnv,
      stdio: "inherit",
    });

    console.log(`[e2e] starting lumora-academy (next start) on ${WEB_URL}`);
    const webLog = fs.openSync(WEB_LOG_FILE, "w");
    webServer = spawn(
      process.execPath,
      [nextBin, "start", "-p", String(WEB_PORT), "-H", "127.0.0.1"],
      {
        cwd: ACADEMY_DIR,
        env: webEnv,
        stdio: ["ignore", webLog, webLog],
        windowsHide: true,
      },
    );
    writePids(apiServer.pid, webServer.pid);
    await waitForHttp(WEB_URL, 30_000);

    console.log("[e2e] both servers up");
  } catch (err) {
    // Setup failed partway through — kill whatever we did manage to start
    // rather than leaving it orphaned for globalTeardown (which never runs
    // if globalSetup throws).
    killTree(apiServer?.pid);
    killTree(webServer?.pid);
    fs.rmSync(PIDS_FILE, { force: true });
    throw err;
  }
}
