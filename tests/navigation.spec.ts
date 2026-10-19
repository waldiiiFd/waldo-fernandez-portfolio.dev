import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Desktop Navigation', () => {
    test('should display navigation', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should display all nav links', async ({ page }) => {
      await expect(page.locator('nav [data-section="inicio"]').first()).toBeVisible();
      await expect(page.locator('nav [data-section="sobre-mi"]').first()).toBeVisible();
      await expect(page.locator('nav [data-section="experiencia"]').first()).toBeVisible();
      await expect(page.locator('nav [data-section="proyectos"]').first()).toBeVisible();
      await expect(page.locator('nav [data-section="contacto"]').first()).toBeVisible();
    });

    test('should have correct href attributes', async ({ page }) => {
      const links = page.locator('nav [data-section]');
      await expect(links.first()).toHaveAttribute('href', '#inicio');
    });

    test('should have logo with accessible name', async ({ page }) => {
      const logo = page.locator('[aria-label*="Waldo"]').first();
      await expect(logo).toBeVisible();
    });

    test('should highlight initial section', async ({ page }) => {
      const navLinks = page.locator('[data-section]');
      const firstLink = navLinks.first();
      await expect(firstLink).toHaveClass(/active/);
    });
  });

  test.describe('Smooth Scroll', () => {
    test('should scroll to experiencia section', async ({ page }) => {
      const link = page.locator('nav [data-section="experiencia"]').first();
      await link.click();
      await expect(page.locator('#experiencia')).toBeInViewport();
    });

    test('should scroll to proyectos section', async ({ page }) => {
      const link = page.locator('nav [data-section="proyectos"]').first();
      await link.click();
      await expect(page.locator('#proyectos')).toBeInViewport();
    });

    test('should scroll to contacto section', async ({ page }) => {
      const link = page.locator('nav [data-section="contacto"]').first();
      await link.click();
      await expect(page.locator('#contacto')).toBeInViewport();
    });

    test('should scroll to about section', async ({ page }) => {
      const link = page.locator('nav [data-section="sobre-mi"]').first();
      await link.click();
      await expect(page.locator('#sobre-mi')).toBeInViewport();
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should have mobile menu toggle on small viewport', async ({ page }) => {
      await expect(page.locator('#nav-toggle')).toBeVisible();
    });

    test('should keep the menu closed and unreachable by default', async ({ page }) => {
      await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#mobile-menu')).toBeHidden();
    });

    test('should open mobile menu when toggle clicked', async ({ page }) => {
      await page.locator('#nav-toggle').click();
      await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#mobile-menu')).toBeVisible();
    });

    test('should display all nav links in mobile menu', async ({ page }) => {
      await page.locator('#nav-toggle').click();
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();
      await expect(mobileMenu.locator('[data-section]')).toHaveCount(5);
    });

    test('should close with Escape and return focus to the toggle', async ({ page }) => {
      const toggle = page.locator('#nav-toggle');
      await toggle.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      await expect(page.locator('#mobile-menu')).toBeHidden();
    });

    test('should close after choosing a destination', async ({ page }) => {
      await page.locator('#nav-toggle').click();
      await page.locator('#mobile-menu [data-section="contacto"]').click();
      await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Header State', () => {
    test('should compact the header after scrolling', async ({ page }) => {
      const header = page.locator('#site-header');
      await expect(header).not.toHaveClass(/is-scrolled/);
      await page.evaluate(() => window.scrollTo(0, 400));
      await expect(header).toHaveClass(/is-scrolled/);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to navigate with Tab key', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test('should have visible focus indicators', async ({ page }) => {
      const firstLink = page.locator('.nav-link').first();
      await firstLink.focus();
      const isFocused = await firstLink.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);
    });
  });

  test.describe('Links', () => {
    test('should have valid internal links', async ({ page }) => {
      const links = page.locator('a[href^="#"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });

    test('external links should have proper attributes', async ({ page }) => {
      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();
      
      if (count > 0) {
        const firstExternal = externalLinks.first();
        await expect(firstExternal).toHaveAttribute('rel', /noopener/);
      }
    });
  });
});
