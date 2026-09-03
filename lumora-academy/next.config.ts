import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // e2e/global-setup.ts builds a throwaway production instance for the
  // Playwright suite (see playwright.config.ts) and points it at its own
  // dist dir via this env var, so that build never collides with a `next
  // dev` instance's .next/dev cache that might be running concurrently in
  // this same directory (Next 16 allows only one `next dev` per project
  // dir — see AGENTS.md). No-op for every normal dev/build command.
  ...(process.env.E2E_DIST_DIR ? { distDir: process.env.E2E_DIST_DIR } : {}),
};

export default nextConfig;
