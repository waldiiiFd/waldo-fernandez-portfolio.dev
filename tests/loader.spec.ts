import { test, expect } from '@playwright/test';

test.describe('Loader', () => {
  test.describe('Loader Element', () => {
    test('should have loader element on initial load', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loader = page.locator('#page-loader');
      await expect(loader).toBeAttached();
    });

    test('should have W monogram structure', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const mark = page.locator('.page-loader__mark');
      await expect(mark).toBeAttached();
    });

    test('should have a single stroke path and progress line', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.page-loader__stroke')).toHaveCount(1);
      await expect(page.locator('.page-loader__line')).toHaveCount(1);
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