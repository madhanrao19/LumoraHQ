import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./support/axe";
import { readSeed } from "./support/seed-data";
import { addStudent, login, registerParent, uniqueEmail } from "./support/users";

let studentEmail: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await registerParent(page, {
    name: "Assessment Parent",
    email: uniqueEmail("parent-assessment"),
  });
  studentEmail = uniqueEmail("student-assessment");
  await addStudent(page, { name: "Assessment Student", email: studentEmail });
  await page.close();
});

test.describe("Taking an assessment", () => {
  test("Student views questions, submits answers, and sees a score", async ({ page }) => {
    const seed = readSeed();

    await login(page, studentEmail);
    await expect(page).toHaveURL(/\/en\/?$/);

    await page.goto(`/en/assessments/${seed.assessmentId}`);
    await expect(
      page.getByRole("heading", { name: seed.assessmentTitle }),
    ).toBeVisible();
    await expectNoAxeViolations(page, "/en/assessments/:id (before submit)");

    // Q1 (multiple choice): the correct option, per global-setup.ts seeding.
    await page.getByLabel("Chlorophyll").check();
    // Q2 (free text): aria-label is the question prompt itself.
    await page
      .getByLabel("What do plants produce during photosynthesis?")
      .fill("oxygen");

    await page.getByRole("button", { name: "Submit" }).click();

    // Exact match: the score also reappears inside "Past attempts" below
    // (e.g. "Score: 100% — 9/3/2026, 11:17 PM"), which a substring match
    // would ambiguously match too.
    await expect(page.getByText("Score: 100%", { exact: true })).toBeVisible();
    await expectNoAxeViolations(page, "/en/assessments/:id (after submit)");
  });
});
