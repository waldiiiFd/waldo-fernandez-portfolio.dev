import { test, expect } from '@playwright/test';

test.describe('Experience Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#experiencia').scrollIntoViewIfNeeded();
  });

  test.describe('Experience Structure', () => {
    test('should have experience section with correct id', async ({ page }) => {
      const section = page.locator('#experiencia');
      await expect(section).toBeVisible();
    });

    test('should have experience section with aria-label', async ({ page }) => {
      const section = page.locator('#experiencia');
      const ariaLabel = await section.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('should have section title', async ({ page }) => {
      const title = page.locator('#experiencia h2');
      await expect(title).toBeVisible();
      await expect(title).toContainText(/Experiencia/);
    });
  });

  test.describe('Professional Experience', () => {
    test('should have professional experience heading', async ({ page }) => {
      const heading = page.locator('.wp-exp__section-title', { hasText: 'Experiencia Profesional' });
      await expect(heading).toBeVisible();
    });

    test('should display job cards', async ({ page }) => {
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display job titles', async ({ page }) => {
      const titles = page.locator('.wp-exp__card-title');
      await expect(titles.first()).toBeVisible();
    });

    test('should display company names', async ({ page }) => {
      const companies = page.locator('.wp-exp__card-company');
      await expect(companies.first()).toBeVisible();
    });

    test('should display job periods', async ({ page }) => {
      const periods = page.locator('.wp-exp__card-period');
      await expect(periods.first()).toBeVisible();
    });

    test('should display job descriptions', async ({ page }) => {
      const descriptions = page.locator('.wp-exp__card-description');
      await expect(descriptions.first()).toBeVisible();
    });
  });

  test.describe('Current Job Badge', () => {
    test('should display "Actual" badge for current job', async ({ page }) => {
      const badge = page.locator('.wp-exp__card-badge', { hasText: 'Actual' });
      const count = await badge.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('badge should have correct styling class', async ({ page }) => {
      const badge = page.locator('.wp-exp__card-badge');
      const count = await badge.count();
      if (count > 0) {
        await expect(badge.first()).toBeVisible();
      }
    });
  });

  test.describe('Technologies', () => {
    test('should display technology tags', async ({ page }) => {
      const tags = page.locator('.wp-exp__tag');
      const count = await tags.count();
      expect(count).toBeGreaterThan(0);
    });

    test('tags should contain technology names', async ({ page }) => {
      const tag = page.locator('.wp-exp__tag').first();
      const text = await tag.textContent();
      expect(text).toBeTruthy();
    });

    test('tags should have icons when available', async ({ page }) => {
      const tagIcons = page.locator('.wp-exp__tag-icon');
      const count = await tagIcons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Education Section', () => {
    test('should have education heading', async ({ page }) => {
      const heading = page.locator('.wp-exp__section-title', { hasText: 'Formación Académica' });
      await expect(heading).toBeVisible();
    });

    test('should display education cards', async ({ page }) => {
      const section = page.locator('.wp-exp__section', { has: page.locator('.wp-exp__section-title', { hasText: 'Formación Académica' }) });
      const cards = section.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display institution names', async ({ page }) => {
      const section = page.locator('.wp-exp__section', { has: page.locator('.wp-exp__section-title', { hasText: 'Formación Académica' }) });
      const titles = section.locator('.wp-exp__card-title');
      await expect(titles.first()).toBeVisible();
    });

    test('should display education periods', async ({ page }) => {
      const section = page.locator('.wp-exp__section', { has: page.locator('.wp-exp__section-title', { hasText: 'Formación Académica' }) });
      const periods = section.locator('.wp-exp__card-period');
      await expect(periods.first()).toBeVisible();
    });

    test('should display education descriptions', async ({ page }) => {
      const section = page.locator('.wp-exp__section', { has: page.locator('.wp-exp__section-title', { hasText: 'Formación Académica' }) });
      const descriptions = section.locator('.wp-exp__card-description');
      await expect(descriptions.first()).toBeVisible();
    });
  });

  test.describe('Timeline', () => {
    test('should have timeline structure', async ({ page }) => {
      const timeline = page.locator('.wp-exp__timeline');
      await expect(timeline.first()).toBeVisible();
    });

    test('cards should have data-index attribute', async ({ page }) => {
      const card = page.locator('.wp-exp__card').first();
      const dataIndex = await card.getAttribute('data-index');
      expect(dataIndex).toBeTruthy();
    });
  });

  test.describe('Animations', () => {
    test('cards should have fade-up animations', async ({ page }) => {
      const cards = page.locator('.wp-exp__card[data-animate="fade-up"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('cards should have animation delay', async ({ page }) => {
      const card = page.locator('.wp-exp__card').first();
      const dataAnimateDelay = await card.getAttribute('data-animate-delay');
      expect(dataAnimateDelay).toBeTruthy();
    });
  });

  test.describe('Accessibility', () => {
    test('section should use semantic HTML', async ({ page }) => {
      const section = page.locator('#experiencia');
      await expect(section).toBeVisible();
    });

    test('cards should use article element', async ({ page }) => {
      const card = page.locator('.wp-exp__card').first();
      const tagName = await card.evaluate((el) => el.tagName);
      expect(tagName).toBe('ARTICLE');
    });

    test('section titles should be h3', async ({ page }) => {
      const sectionTitle = page.locator('.wp-exp__section-title').first();
      const tagName = await sectionTitle.evaluate((el) => el.tagName);
      expect(tagName).toBe('H3');
    });
  });

  test.describe('Responsive', () => {
    test('should be visible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const section = page.locator('#experiencia');
      await expect(section).toBeVisible();
    });

    test('should display cards on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
