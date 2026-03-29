import { test, expect } from '@playwright/test';

test.describe('Loader', () => {
  test.describe('Loader Element', () => {
    test('should have loader element on initial load', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loader = page.locator('#page-loader');
      await expect(loader).toBeAttached();
    });

    test('should have newtons-cradle structure', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const cradle = page.locator('.newtons-cradle');
      await expect(cradle).toBeAttached();
    });

    test('should have 4 cradle dots', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const dots = page.locator('.newtons-cradle__dot');
      await expect(dots).toHaveCount(4);
    });
  });

  test.describe('Loader Lifecycle', () => {
    test('should exist on page before load completes', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loader = page.locator('#page-loader');
      const isAttached = await loader.count() > 0;
      expect(isAttached).toBe(true);
    });

    test('should be removed after page load', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      await page.waitForTimeout(1000);
      
      const loader = page.locator('#page-loader');
      const isRemoved = await loader.count() === 0;
      expect(isRemoved).toBe(true);
    });
  });

  test.describe('Loader Performance', () => {
    test('should not block page interaction after load', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      await page.waitForTimeout(600);
      
      const heading = page.locator('#inicio h1');
      await expect(heading).toBeVisible();
    });
  });
});
