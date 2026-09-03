import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./support/axe";
import { PASSWORD, uniqueEmail } from "./support/users";

test.describe("Registration and login", () => {
  test("a Parent can register via the real form and lands authenticated", async ({ page }) => {
    await page.goto("/en/register");
    await expectNoAxeViolations(page, "/en/register");

    const email = uniqueEmail("parent-register");
    await page.getByLabel("Name").fill("Pat Parent");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password").fill(PASSWORD);
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page).toHaveURL(/\/en\/?$/);

    // Confirm the issued Sanctum token actually authenticates — visit a
    // portal page that requires it.
    await page.goto("/en/students");
    await expect(page.getByRole("heading", { name: "My students" })).toBeVisible();
  });

  test("login page has no axe violations; wrong password is rejected, correct password succeeds", async ({
    page,
  }) => {
    const email = uniqueEmail("parent-login");
    await page.goto("/en/register");
    await page.getByLabel("Name").fill("Login Test Parent");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password").fill(PASSWORD);
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL(/\/en\/?$/);

    // Log out (clear the token) so the login form itself gets exercised.
    await page.evaluate(() => window.localStorage.clear());

    await page.goto("/en/login");
    await expectNoAxeViolations(page, "/en/login");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("the-wrong-password");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(
      page.getByText("The provided credentials are incorrect."),
    ).toBeVisible();
    // Still on the login page — no session was granted.
    await expect(page).toHaveURL(/\/en\/login$/);

    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});
