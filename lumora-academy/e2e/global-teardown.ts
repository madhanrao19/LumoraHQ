// Kills the lumora-api and next dev processes started in global-setup.ts.
// Windows-specific: `taskkill /T` kills the full process tree, since `next
// dev` forks its own server subprocess (confirmed by inspecting a running
// instance during development of this suite) that a plain SIGTERM/kill()
// on the parent pid alone would leave orphaned.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { PIDS_FILE } from "./support/env";

function killTree(pid: number): void {
  try {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    // Already exited — fine.
  }
}

export default async function globalTeardown(): Promise<void> {
  if (!fs.existsSync(PIDS_FILE)) return;

  const { apiPid, webPid } = JSON.parse(fs.readFileSync(PIDS_FILE, "utf-8"));
  if (apiPid) killTree(apiPid);
  if (webPid) killTree(webPid);
  fs.rmSync(PIDS_FILE, { force: true });
  console.log("[e2e] api and web servers stopped");
}
