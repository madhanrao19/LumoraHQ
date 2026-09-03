import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./support/axe";
import { addStudent, login, registerParent, uniqueEmail } from "./support/users";

let studentEmail: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await registerParent(page, {
    name: "Tutor Parent",
    email: uniqueEmail("parent-tutor"),
  });
  studentEmail = uniqueEmail("student-tutor");
  await addStudent(page, { name: "Tutor Student", email: studentEmail });
  await page.close();
});

test.describe("Asking the AI Tutor", () => {
  test("Student asks a question and a response appears", async ({ page }) => {
    await login(page, studentEmail);
    await expect(page).toHaveURL(/\/en\/?$/);

    await page.goto("/en/tutor");
    await expect(
      page.getByText("Ask the Tutor a question about your lessons to get started."),
    ).toBeVisible();
    await expectNoAxeViolations(page, "/en/tutor (empty)");

    const question = "What is photosynthesis and why is chlorophyll important?";
    await page.getByLabel("Ask the Tutor").fill(question);
    await page.getByRole("button", { name: "Send" }).click();

    // This local environment has no real AI provider configured — it runs
    // on NullAiProvider (lumora-api/app/AiGateway/Providers/NullAiProvider.php),
    // whose deterministic echo output always fails the safety classifier
    // closed to "block" (see TutorOutcome::fromClassifierOutput). So the
    // real, expected local-env behavior is the safe fallback message with a
    // "block" badge — not a live model answer. What this test verifies is
    // the actual flow: the question is echoed, a response bubble appears,
    // and the outcome badge renders — real Tutor UX plumbing, not the
    // content of a real model's reply (out of scope per the task brief).
    await expect(page.getByText(question)).toBeVisible();
    await expect(
      page.getByText("I can't help with that. Please ask a parent, teacher, or another trusted adult."),
    ).toBeVisible();
    await expect(page.getByText("block")).toBeVisible();
    await expectNoAxeViolations(page, "/en/tutor (after response)");
  });
});
