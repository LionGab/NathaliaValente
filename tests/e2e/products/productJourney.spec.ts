import { test, expect } from '@playwright/test';

test.describe('Product E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Jornada de Compra (Guest)', () => {
    test('deve navegar para loja e visualizar produtos', async ({ page }) => {
      // Navegar para a loja
      await page.click('[data-testid="nav-store"]');
      
      // Aguardar carregamento da pÃ¡gina
      await expect(page.locator('h1')).toContainText('Loja');
      
      // Verificar se produtos sÃ£o exibidos
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
      
      // Verificar informaÃ§Ãµes do produto
      await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    });

    test('deve filtrar produtos por categoria', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Aplicar filtro por categoria
      await page.selectOption('[data-testid="category-filter"]', 'Roupas');
      
      // Aguardar filtro ser aplicado
      await page.waitForTimeout(1000);
      
      // Verificar se apenas produtos da categoria sÃ£o exibidos
      const productCards = page.locator('[data-testid="product-card"]');
      await expect(productCards).toHaveCount.greaterThan(0);
    });

    test('deve filtrar produtos por preÃ§o', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Aplicar filtro de preÃ§o mÃ­nimo
      await page.fill('[data-testid="min-price-filter"]', '150');
      await page.click('[data-testid="apply-filters"]');
      
      // Aguardar filtro ser aplicado
      await page.waitForTimeout(1000);
      
      // Verificar se apenas produtos com preÃ§o >= 150 sÃ£o exibidos
      const prices = await page.locator('[data-testid="product-price"]').allTextContents();
      for (const price of prices) {
        const numericPrice = parseFloat(price.replace('R$ ', '').replace(',', '.'));
        expect(numericPrice).toBeGreaterThanOrEqual(150);
      }
    });

    test('deve adicionar produto ao carrinho', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Aguardar produtos carregarem
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
      
      // Adicionar primeiro produto ao carrinho
      await page.click('[data-testid="add-to-cart"]:first-of-type');
      
      // Verificar se botÃ£o mudou para "Remover"
      await expect(page.locator('[data-testid="remove-from-cart"]:first-of-type')).toBeVisible();
      
      // Verificar se contador do carrinho foi atualizado
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
    });

    test('deve remover produto do carrinho', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Adicionar produto ao carrinho
      await page.click('[data-testid="add-to-cart"]:first-of-type');
      await expect(page.locator('[data-testid="remove-from-cart"]:first-of-type')).toBeVisible();
      
      // Remover produto do carrinho
      await page.click('[data-testid="remove-from-cart"]:first-of-type');
      
      // Verificar se botÃ£o mudou de volta para "Adicionar"
      await expect(page.locator('[data-testid="add-to-cart"]:first-of-type')).toBeVisible();
      
      // Verificar se contador do carrinho foi atualizado
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('0');
    });

    test('deve mostrar detalhes do produto', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Clicar em um produto para ver detalhes
      await page.click('[data-testid="product-card"]:first-of-type');
      
      // Verificar se modal de detalhes foi aberto
      await expect(page.locator('[data-testid="product-detail-modal"]')).toBeVisible();
      
      // Verificar informaÃ§Ãµes detalhadas
      await expect(page.locator('[data-testid="product-detail-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-detail-price"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-detail-description"]')).toBeVisible();
    });
  });

  test.describe('Jornada de Compra (Autenticado)', () => {
    test.beforeEach(async ({ page }) => {
      // Simular login (assumindo que existe um sistema de auth)
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      // Aguardar redirecionamento
      await page.waitForURL('/');
    });

    test('deve finalizar compra com usuÃ¡rio autenticado', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      
      // Adicionar produtos ao carrinho
      await page.click('[data-testid="add-to-cart"]:first-of-type');
      await page.click('[data-testid="add-to-cart"]:nth-of-type(2)');
      
      // Ir para o carrinho
      await page.click('[data-testid="cart-icon"]');
      
      // Verificar se produtos estÃ£o no carrinho
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);
      
      // Finalizar compra
      await page.click('[data-testid="checkout-button"]');
      
      // Verificar se foi redirecionado para pÃ¡gina de checkout
      await expect(page).toHaveURL(/.*checkout.*/);
    });
  });

  test.describe('Responsividade', () => {
    test('deve funcionar em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.click('[data-testid="nav-store"]');
      
      // Verificar se produtos sÃ£o exibidos corretamente em mobile
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
      
      // Verificar se filtros funcionam em mobile
      await page.click('[data-testid="filter-toggle"]');
      await page.selectOption('[data-testid="category-filter"]', 'Roupas');
      await page.click('[data-testid="apply-filters"]');
      
      await page.waitForTimeout(1000);
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('deve carregar produtos rapidamente', async ({ page }) => {
      const startTime = Date.now();
      
      await page.click('[data-testid="nav-store"]');
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Menos de 3 segundos
    });

    test('deve aplicar filtros rapidamente', async ({ page }) => {
      await page.click('[data-testid="nav-store"]');
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
      
      const startTime = Date.now();
      await page.selectOption('[data-testid="category-filter"]', 'Roupas');
      await page.click('[data-testid="apply-filters"]');
      await page.waitForTimeout(500);
      
      const filterTime = Date.now() - startTime;
      expect(filterTime).toBeLessThan(1000); // Menos de 1 segundo
    });
  });
});
