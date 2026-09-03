import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./support/axe";
import { readSeed } from "./support/seed-data";
import { addStudent, login, registerParent, uniqueEmail } from "./support/users";

let studentEmail: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await registerParent(page, {
    name: "Curriculum Parent",
    email: uniqueEmail("parent-curriculum"),
  });
  studentEmail = uniqueEmail("student-curriculum");
  await addStudent(page, { name: "Curriculum Student", email: studentEmail });
  await page.close();
});

test.describe("Browsing curriculum and completing a lesson", () => {
  test("Student browses Subjects -> Topics -> Lessons, views a lesson, and marks it complete", async ({
    page,
  }) => {
    const seed = readSeed();

    await login(page, studentEmail);
    await expect(page).toHaveURL(/\/en\/?$/);

    await page.goto("/en/subjects");
    await expectNoAxeViolations(page, "/en/subjects");
    await page.getByRole("link", { name: "E2E Science" }).click();

    await expect(page).toHaveURL(/\/en\/subjects\/\d+$/);
    await expectNoAxeViolations(page, "/en/subjects/:id (topics)");
    await page.getByRole("link", { name: "E2E Photosynthesis Basics" }).click();

    await expect(page).toHaveURL(/\/en\/topics\/\d+$/);
    await expectNoAxeViolations(page, "/en/topics/:id (lessons + assessments)");
    await page.getByRole("link", { name: seed.lessonTitle }).click();

    await expect(page).toHaveURL(`/en/lessons/${seed.lessonId}`);
    await expect(
      page.getByRole("heading", { name: seed.lessonTitle }),
    ).toBeVisible();
    await expectNoAxeViolations(page, "/en/lessons/:id (before complete)");

    const completeButton = page.getByRole("button", { name: "Mark complete" });
    await expect(completeButton).toBeVisible();
    await completeButton.click();
    await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
    await expectNoAxeViolations(page, "/en/lessons/:id (after complete)");
  });
});
