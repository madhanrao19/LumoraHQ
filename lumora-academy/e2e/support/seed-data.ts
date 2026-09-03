import fs from "node:fs";
import { SEED_FILE, type SeedData } from "./env";

// Read once per worker process — global-setup already wrote this before any
// test file runs.
export function readSeed(): SeedData {
  return JSON.parse(fs.readFileSync(SEED_FILE, "utf-8")) as SeedData;
}
