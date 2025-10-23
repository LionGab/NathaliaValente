import { test, expect } from "@playwright/test";

test.describe("Navigation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Login with demo mode
    await page.getByText("🚀 Entrar como Demo").click();
    await page.waitForTimeout(3000); // Wait for login to complete
  });

  test("should navigate between pages", async ({ page }) => {
    // Check if navigation is visible
    await expect(page.getByText("Feed")).toBeVisible();
    await expect(page.getByText("Grupos")).toBeVisible();
    await expect(page.getByText("Nath")).toBeVisible();
    await expect(page.getByText("Buscar")).toBeVisible();
    await expect(page.getByText("Frase")).toBeVisible();
    await expect(page.getByText("Perfil")).toBeVisible();
  });

  test("should show active state for current page", async ({ page }) => {
    // Feed should be active by default
    const feedButton = page.getByText("Feed").locator("..");
    await expect(feedButton).toHaveClass(/text-primary-600/);
  });

  test("should navigate to different pages", async ({ page }) => {
    // Navigate to Groups
    await page.getByText("Grupos").click();
    await page.waitForTimeout(1000);
    
    // Navigate to Chat
    await page.getByText("Nath").click();
    await page.waitForTimeout(1000);
    
    // Navigate to Search
    await page.getByText("Buscar").click();
    await page.waitForTimeout(1000);
    
    // Navigate to Daily Quote
    await page.getByText("Frase").click();
    await page.waitForTimeout(1000);
    
    // Navigate to Profile
    await page.getByText("Perfil").click();
    await page.waitForTimeout(1000);
  });
});
