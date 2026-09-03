import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// The one accessibility check this suite makes: automated axe-core scan
// against WCAG 2.2 AA's rule sets (ADR-0006's target), zero violations
// required. This catches a real but partial slice of WCAG issues — see the
// PR report for what it can't catch.
export async function expectNoAxeViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  const summary = results.violations
    .map(
      (v) =>
        `[${v.id}] ${v.impact}: ${v.help} (${v.nodes.length} node(s))\n` +
        v.nodes.map((n) => `    ${n.target.join(" ")}`).join("\n"),
    )
    .join("\n");

  expect(results.violations, `axe violations on ${label}:\n${summary}`).toEqual([]);
}
