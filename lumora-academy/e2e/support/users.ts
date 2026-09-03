import { expect, type Page } from "@playwright/test";

// Meets lumora-api's Password::defaults() rule (min length + confirmation) —
// verified directly against the running API before writing this suite.
export const PASSWORD = "Passw0rd!123";

let counter = 0;

// Unique per test run so parallel/rerun test executions never collide on
// lumora-api's `unique:users,email` validation rule.
export function uniqueEmail(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}@example.test`;
}

export async function registerParent(
  page: Page,
  { name, email }: { name: string; email: string },
) {
  await page.goto("/en/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirm password").fill(PASSWORD);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
}

export async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/en/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}

export async function addStudent(
  page: Page,
  { name, email }: { name: string; email: string },
) {
  await page.goto("/en/students");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirm password").fill(PASSWORD);
  await page.getByRole("button", { name: "Add student" }).click();
  await expect(page.getByText(`${name} (${email})`)).toBeVisible();
}
