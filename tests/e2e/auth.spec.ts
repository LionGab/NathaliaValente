import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.getByText("ClubNath")).toBeVisible();
    await expect(page.getByText("Sua comunidade exclusiva")).toBeVisible();
    await expect(page.getByText("Continuar com Google")).toBeVisible();
    await expect(page.getByText("Continuar com Apple")).toBeVisible();
    await expect(page.getByText("Continuar com Instagram")).toBeVisible();
  });

  test("should toggle between login and signup modes", async ({ page }) => {
    await expect(page.getByText("Entrar")).toHaveClass(/bg-white/);
    
    await page.getByText("Criar Conta").click();
    await expect(page.getByText("Criar Conta")).toHaveClass(/bg-white/);
    
    await expect(page.getByLabel("Nome completo")).toBeVisible();
  });

  test("should login with demo mode", async ({ page }) => {
    await page.getByText("🚀 Entrar como Demo").click();
    await expect(page.getByText("Conectando...")).toBeVisible();
    await page.waitForTimeout(2000);
  });
});
