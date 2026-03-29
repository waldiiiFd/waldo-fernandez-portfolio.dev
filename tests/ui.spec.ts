import { test, expect } from '@playwright/test';

test.describe('UI - Componentes Visuales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Hero Section', () => {
    test('should display hero heading', async ({ page }) => {
      const heading = page.locator('#inicio h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Waldo/);
    });

    test('should display hero role', async ({ page }) => {
      const role = page.locator('.wp-hero__role');
      await expect(role).toBeVisible();
    });

    test('should display hero description', async ({ page }) => {
      const description = page.locator('.wp-hero__description');
      await expect(description).toBeVisible();
    });

    test('should display CTA buttons', async ({ page }) => {
      const ctas = page.locator('.wp-hero__cta');
      const count = await ctas.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have only one h1', async ({ page }) => {
      const h1 = page.locator('#inicio h1');
      await expect(h1).toHaveCount(1);
    });
  });

  test.describe('About Section', () => {
    test('should display about heading', async ({ page }) => {
      await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
      const heading = page.locator('#sobre-mi h2');
      await expect(heading).toBeVisible();
    });

    test('should display about content', async ({ page }) => {
      await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
      const content = page.locator('#sobre-mi p');
      await expect(content.first()).toBeVisible();
    });
  });

  test.describe('Experience Section', () => {
    test('should display experience heading', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const heading = page.locator('#experiencia h2');
      await expect(heading).toBeVisible();
    });

    test('should display experience cards', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display job titles', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const titles = page.locator('.wp-exp__card-title');
      await expect(titles.first()).toBeVisible();
    });
  });

  test.describe('Projects Section', () => {
    test('should display projects heading', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const heading = page.locator('#proyectos h2');
      await expect(heading).toBeVisible();
    });

    test('should display project cards', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const cards = page.locator('.wp-projects__card');
      await expect(cards.first()).toBeVisible();
    });

    test('should display project titles', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const titles = page.locator('.wp-projects__card-title');
      await expect(titles.first()).toBeVisible();
    });

    test('should display project thumbnails', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const images = page.locator('.wp-projects__card-image img');
      await expect(images.first()).toBeVisible();
    });

    test('should pagination exist when needed', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const pagination = page.locator('.wp-projects__pagination');
      const count = await pagination.count();
      if (count > 0) {
        await expect(pagination.first()).toBeVisible();
      }
    });
  });

  test.describe('Contact Section', () => {
    test('should display contact heading', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      const heading = page.locator('#contacto h2');
      await expect(heading).toBeVisible();
    });

    test('should display contact form', async ({ page }) => {
      const form = page.locator('#contact-form');
      await expect(form).toBeVisible();
    });

    test('should display all form fields', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await expect(page.locator('#nombre')).toBeVisible();
      await expect(page.locator('#correo')).toBeVisible();
      await expect(page.locator('#asunto')).toBeVisible();
      await expect(page.locator('#mensaje')).toBeVisible();
    });

    test('should display submit button', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      const submitBtn = page.locator('.wp-contact__submit');
      await expect(submitBtn).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should display social links', async ({ page }) => {
      const socialLinks = page.locator('footer a');
      const count = await socialLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Animations', () => {
    test('elements with data-animate should exist', async ({ page }) => {
      const animatedElements = page.locator('[data-animate]');
      const count = await animatedElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('hero section should have animations', async ({ page }) => {
      const heroElements = page.locator('#inicio [data-animate]');
      const count = await heroElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('projects should have animated cards', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const projectCards = page.locator('#proyectos .wp-projects__card[data-animate]');
      const count = await projectCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('experience cards should have animations', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      const cards = page.locator('.wp-exp__card[data-animate]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be readable on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      const heading = page.locator('#inicio h1');
      await expect(heading).toBeVisible();
    });

    test('should be readable on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      const heading = page.locator('#inicio h1');
      await expect(heading).toBeVisible();
    });

    test('should be readable on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      const heading = page.locator('#inicio h1');
      await expect(heading).toBeVisible();
    });
  });
});
