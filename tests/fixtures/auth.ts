import { test as base, expect } from '@playwright/test';

// Fixture para usuÃ¡rio autenticado
export const test = base.extend<{
  authenticatedPage: any;
  guestPage: any;
}>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Simular login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/');
    
    await use(page);
    await context.close();
  },
  
  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/');
    await use(page);
    await context.close();
  }
});

export { expect };
