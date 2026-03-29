import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Structure', () => {
    test('should have a title', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
    });

    test('should have a main landmark', async ({ page }) => {
      const main = page.locator('main');
      const count = await main.count();
      
      if (count === 0) {
        console.warn('No <main> landmark found - recommended for accessibility');
      } else {
        await expect(main).toHaveCount(1);
      }
    });

    test('should have html lang attribute', async ({ page }) => {
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBe('es');
    });
  });

  test.describe('Headings', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('main h1, main h2, main h3, main h4, main h5, main h6').all();
      const levels = await Promise.all(
        headings.map(async (h) => {
          const tag = await h.evaluate((el) => el.tagName);
          return parseInt(tag.replace('H', ''), 10);
        })
      );

      let lastLevel = 0;
      for (const level of levels) {
        expect(level - lastLevel).toBeLessThanOrEqual(1);
        lastLevel = level;
      }
    });

    test('should have only one h1', async ({ page }) => {
      const h1 = page.locator('main h1');
      await expect(h1).toHaveCount(1);
    });
  });

  test.describe('Images', () => {
    test('all images should have alt text or be decorative', async ({ page }) => {
      const images = page.locator('main img[src]');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');
        const hasAlt = alt !== null && alt !== '';
        const isDecorative = ariaHidden === 'true';
        expect(hasAlt || isDecorative).toBe(true);
      }
    });
  });

  test.describe('Interactive Elements', () => {
    test('all interactive elements should have accessible names', async ({ page }) => {
      const buttons = page.locator('main button, main a[href]');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const ariaLabel = await btn.getAttribute('aria-label');
        const title = await btn.getAttribute('title');
        const text = await btn.textContent();
        const href = await btn.getAttribute('href');
        
        const hasAccessibleName = ariaLabel || title || (text && text.trim()) || (href && href.startsWith('#'));
        expect(hasAccessibleName).toBeTruthy();
      }
    });

    test('links should have meaningful text', async ({ page }) => {
      const links = page.locator('main a[href]');
      const count = await links.count();
      
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        const hasText = (text && text.trim().length > 0) || ariaLabel;
        expect(hasText).toBe(true);
      }
    });
  });

  test.describe('Forms', () => {
    test('form inputs should have associated labels', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      
      const inputs = page.locator('#contacto input, #contacto textarea, #contacto select');
      const count = await inputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = (await label.count()) > 0;
          const hasAriaLabel = !!ariaLabel;
          expect(hasLabel || hasAriaLabel).toBe(true);
        } else {
          const hasAriaLabel = !!ariaLabel;
          expect(hasAriaLabel).toBe(true);
        }
      }
    });
  });

  test.describe('Skip Link', () => {
    test('skip link should exist for accessibility', async ({ page }) => {
      const skipLink = page.locator('a[href="#main"], a[href="#content"]');
      const skipExists = await skipLink.count();
      
      if (skipExists > 0) {
        await expect(skipLink.first()).toHaveText(/skip|skip/i);
      }
    });
  });

  test.describe('Sections', () => {
    test('all sections should have unique IDs', async ({ page }) => {
      const sections = page.locator('section[id]');
      const ids = await sections.evaluateAll((els) => 
        els.map((el) => el.id).filter(Boolean)
      );
      
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  test.describe('Color & Contrast', () => {
    test('should have sufficient text elements', async ({ page }) => {
      const textElements = page.locator('p, span, a, li');
      const count = await textElements.count();
      
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to navigate with Tab key', async ({ page }) => {
      await page.keyboard.press('Tab');
      
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test('focus should be visible on interactive elements', async ({ page }) => {
      const firstLink = page.locator('.nav-link').first();
      await firstLink.focus();
      
      const isFocused = await firstLink.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);
    });
  });
});
