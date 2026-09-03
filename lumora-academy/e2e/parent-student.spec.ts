import { expect, test } from "@playwright/test";
import { API_URL } from "./support/env";
import { expectNoAxeViolations } from "./support/axe";
import { readSeed } from "./support/seed-data";
import { PASSWORD, registerParent, uniqueEmail } from "./support/users";

async function fillAddStudentForm(
  page: import("@playwright/test").Page,
  { name, email }: { name: string; email: string },
) {
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirm password").fill(PASSWORD);
  await page.getByRole("button", { name: "Add student" }).click();
}

test.describe("Parent oversight of a Student", () => {
  test("Parent adds a Student and views their progress, attempts, Tutor conversation, and audit log", async ({
    page,
    request,
  }) => {
    const seed = readSeed();

    await registerParent(page, {
      name: "Oversight Parent",
      email: uniqueEmail("parent-oversight"),
    });

    await page.goto("/en/students");
    await expectNoAxeViolations(page, "/en/students (no students yet)");

    const studentEmail = uniqueEmail("student-oversight");
    await fillAddStudentForm(page, { name: "Oversight Student", email: studentEmail });

    const studentLink = page.getByRole("link", {
      name: `Oversight Student (${studentEmail})`,
    });
    await expect(studentLink).toBeVisible();
    await expectNoAxeViolations(page, "/en/students (with a student)");

    // Generate real activity for the Student via direct API calls. The
    // student-facing UI paths for lesson-complete / take-an-assessment /
    // ask-the-Tutor are already covered end-to-end in curriculum.spec.ts,
    // assessment.spec.ts, and tutor.spec.ts — this test's own focus is the
    // Parent's aggregated view of that data on the detail page.
    const studentLoginRes = await request.post(`${API_URL}/api/v1/login`, {
      data: { email: studentEmail, password: PASSWORD },
    });
    const { token: studentToken } = await studentLoginRes.json();
    const studentAuth = { Authorization: `Bearer ${studentToken}` };

    await request.post(`${API_URL}/api/v1/lessons/${seed.lessonId}/progress`, {
      headers: studentAuth,
    });
    await request.post(`${API_URL}/api/v1/assessments/${seed.assessmentId}/attempts`, {
      headers: studentAuth,
      data: { responses: { [seed.q1Id]: "A", [seed.q2Id]: "oxygen" } },
    });
    await request.post(`${API_URL}/api/v1/tutor/ask`, {
      headers: studentAuth,
      data: { question: "What is chlorophyll used for in photosynthesis?" },
    });

    await studentLink.click();
    await expect(page).toHaveURL(/\/en\/students\/\d+$/);
    await expectNoAxeViolations(page, "/en/students/:id (detail page)");

    await expect(
      page.getByRole("heading", { name: "Lesson progress" }),
    ).toBeVisible();
    await expect(page.getByText(`Lesson #${seed.lessonId}`)).toBeVisible();
    await expect(page.getByText(/completed/)).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Assessment attempts" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Assessment #${seed.assessmentId} — score: 100`),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Tutor conversation" }),
    ).toBeVisible();
    await expect(
      page.getByText("What is chlorophyll used for in photosynthesis?"),
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Audit log" })).toBeVisible();
    await expect(page.getByText(/tutor-answer|tutor-safety-classify/).first()).toBeVisible();
  });

  test("An unlinked Parent is blocked from another Parent's Student data, not shown it", async ({
    page,
  }) => {
    await registerParent(page, {
      name: "Parent A",
      email: uniqueEmail("parent-unlinked-a"),
    });
    await page.goto("/en/students");
    const studentEmail = uniqueEmail("student-unlinked");
    await fillAddStudentForm(page, { name: "Unlinked Student", email: studentEmail });

    const studentLink = page.getByRole("link", {
      name: `Unlinked Student (${studentEmail})`,
    });
    await expect(studentLink).toBeVisible();
    const href = await studentLink.getAttribute("href");
    const studentId = href?.split("/").pop();
    expect(studentId).toMatch(/^\d+$/);

    // Log out Parent A, register an unrelated Parent B.
    await page.evaluate(() => window.localStorage.clear());
    await registerParent(page, {
      name: "Parent B",
      email: uniqueEmail("parent-unlinked-b"),
    });

    await page.goto(`/en/students/${studentId}`);
    await expect(
      page.getByText("Could not load this student's data."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Lesson progress" }),
    ).not.toBeVisible();
  });
});
