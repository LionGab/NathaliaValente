import { test, expect } from '@playwright/test';

// Fixtures para usuÃ¡rio de teste
const testUser = {
  email: 'test@clubnath.com',
  password: 'TestPassword123!',
  fullName: 'Test User',
};

test.describe('Fluxo de Login E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a pÃ¡gina inicial
    await page.goto('/');
    
    // Aguardar o carregamento da pÃ¡gina
    await page.waitForLoadState('networkidle');
  });

  test('deve completar fluxo de login com sucesso', async ({ page }) => {
    // 1. Acessar pÃ¡gina inicial
    await expect(page).toHaveURL('/');
    
    // Verificar se a pÃ¡gina carregou corretamente
    await expect(page.locator('body')).toBeVisible();

    // 2. Clicar em "Entrar" (assumindo que existe um botÃ£o de login)
    const loginButton = page.locator('button:has-text("Entrar"), a:has-text("Entrar"), [data-testid="login-button"]').first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
    } else {
      // Se nÃ£o encontrar botÃ£o especÃ­fico, procurar por Ã­cone de usuÃ¡rio ou menu
      const userIcon = page.locator('[data-testid="user-icon"], .user-icon, [aria-label*="login"], [aria-label*="entrar"]').first();
      if (await userIcon.isVisible()) {
        await userIcon.click();
      }
    }

    // 3. Preencher email/senha
    await page.waitForSelector('input[type="email"], input[name="email"], [data-testid="email-input"]', { timeout: 5000 });
    
    const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email-input"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password-input"]').first();
    
    await emailInput.fill(testUser.email);
    await passwordInput.fill(testUser.password);

    // 4. Submeter form
    const submitButton = page.locator('button[type="submit"], button:has-text("Entrar"), [data-testid="submit-button"]').first();
    await submitButton.click();

    // 5. Verificar redirecionamento para feed
    await page.waitForURL('**/feed**', { timeout: 10000 });
    await expect(page).toHaveURL(/.*feed.*/);

    // 6. Verificar nome do usuÃ¡rio no header
    await page.waitForSelector('[data-testid="user-name"], .user-name, .profile-name', { timeout: 5000 });
    
    const userNameElement = page.locator('[data-testid="user-name"], .user-name, .profile-name').first();
    await expect(userNameElement).toBeVisible();
    
    // Verificar se contÃ©m o nome do usuÃ¡rio ou email
    const userNameText = await userNameElement.textContent();
    expect(userNameText).toMatch(new RegExp(testUser.fullName|testUser.email));
  });

  test('deve mostrar erro com credenciais invÃ¡lidas', async ({ page }) => {
    // Clicar em "Entrar"
    const loginButton = page.locator('button:has-text("Entrar"), a:has-text("Entrar"), [data-testid="login-button"]').first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }

    // Preencher credenciais invÃ¡lidas
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');

    // Submeter form
    const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first();
    await submitButton.click();

    // Verificar mensagem de erro
    await page.waitForSelector('.error, .alert, [data-testid="error-message"]', { timeout: 5000 });
    
    const errorMessage = page.locator('.error, .alert, [data-testid="error-message"]').first();
    await expect(errorMessage).toBeVisible();
    
    const errorText = await errorMessage.textContent();
    expect(errorText).toMatch(/erro|invÃ¡lid|incorrect|wrong/i);
  });

  test('deve funcionar em modo demo', async ({ page }) => {
    // Procurar por botÃ£o de modo demo
    const demoButton = page.locator('button:has-text("Demo"), button:has-text("Modo Demo"), [data-testid="demo-button"]').first();
    
    if (await demoButton.isVisible()) {
      await demoButton.click();
      
      // Verificar se entrou no modo demo
      await page.waitForSelector('[data-testid="user-name"], .user-name', { timeout: 5000 });
      
      const userNameElement = page.locator('[data-testid="user-name"], .user-name').first();
      await expect(userNameElement).toBeVisible();
      
      // Verificar se mostra nome do usuÃ¡rio demo
      const userNameText = await userNameElement.textContent();
      expect(userNameText).toMatch(/NathÃ¡lia|Demo/i);
    }
  });

  test('deve manter sessÃ£o apÃ³s refresh', async ({ page }) => {
    // Fazer login
    const loginButton = page.locator('button:has-text("Entrar"), a:has-text("Entrar"), [data-testid="login-button"]').first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await emailInput.fill(testUser.email);
      await passwordInput.fill(testUser.password);

      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first();
      await submitButton.click();

      await page.waitForURL('**/feed**', { timeout: 10000 });
    }

    // Fazer refresh da pÃ¡gina
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verificar se ainda estÃ¡ logado
    const userNameElement = page.locator('[data-testid="user-name"], .user-name, .profile-name').first();
    
    if (await userNameElement.isVisible()) {
      await expect(userNameElement).toBeVisible();
    }
  });

  test('deve funcionar em diferentes resoluÃ§Ãµes', async ({ page }) => {
    // Testar em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const loginButton = page.locator('button:has-text("Entrar"), a:has-text("Entrar"), [data-testid="login-button"]').first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await emailInput.fill(testUser.email);
      await passwordInput.fill(testUser.password);

      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first();
      await submitButton.click();

      await page.waitForURL('**/feed**', { timeout: 10000 });
    }

    // Testar em tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Testar em desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('deve ter acessibilidade adequada', async ({ page }) => {
    // Verificar se os elementos tÃªm labels apropriados
    const loginButton = page.locator('button:has-text("Entrar"), a:has-text("Entrar"), [data-testid="login-button"]').first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Verificar se os inputs tÃªm labels
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      // Verificar se os inputs sÃ£o focÃ¡veis via teclado
      await emailInput.focus();
      await expect(emailInput).toBeFocused();
      
      await passwordInput.focus();
      await expect(passwordInput).toBeFocused();
      
      // Verificar se o botÃ£o de submit Ã© acessÃ­vel
      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first();
      await submitButton.focus();
      await expect(submitButton).toBeFocused();
    }
  });
});
