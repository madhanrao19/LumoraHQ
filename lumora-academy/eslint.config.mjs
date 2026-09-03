import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // e2e/global-setup.ts builds a throwaway production instance into its
    // own dist dir (see next.config.ts) so it doesn't collide with a `next
    // dev` instance's cache — that compiled output isn't source, same as
    // .next/**.
    ".next-e2e/**",
  ]),
]);

export default eslintConfig;
