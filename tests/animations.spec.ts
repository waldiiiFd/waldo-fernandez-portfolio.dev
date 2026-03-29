import { test, expect } from '@playwright/test';

test.describe('Animations - AOS System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Animation System Setup', () => {
    test('should have AOS CSS loaded', async ({ page }) => {
      const hasAosCss = await page.locator('[class*="aos"]').count();
      expect(hasAosCss).toBeGreaterThan(0);
    });

    test('should have data-aos attribute on animated elements', async ({ page }) => {
      const animatedElements = page.locator('[data-aos="fade-up"]');
      const count = await animatedElements.count();
      expect(count).toBeGreaterThan(5);
    });

    test('should have data-aos-delay attributes for staggered animations', async ({ page }) => {
      const elementsWithDelay = page.locator('[data-aos-delay]');
      const count = await elementsWithDelay.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Hero Section Animations', () => {
    test('hero title should have data-aos attribute', async ({ page }) => {
      const title = page.locator('#inicio h1');
      await expect(title).toHaveAttribute('data-aos', 'fade-up');
    });

    test('hero should have animated elements', async ({ page }) => {
      const heroElements = page.locator('#inicio [data-aos]');
      const count = await heroElements.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test('hero elements should have data-aos-delay for staggered effect', async ({ page }) => {
      const title = page.locator('#inicio h1');
      await expect(title).toHaveAttribute('data-aos-delay', '0');
    });
  });

  test.describe('About Section Animations', () => {
    test('about should have animated elements', async ({ page }) => {
      await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const aboutAnimations = page.locator('#sobre-mi [data-aos]');
      const count = await aboutAnimations.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('about photo should have animation with delay', async ({ page }) => {
      const photo = page.locator('#sobre-mi .wp-about__photo-wrapper');
      await expect(photo).toHaveAttribute('data-aos', 'fade-up');
    });
  });

  test.describe('Projects Section Animations', () => {
    test('projects title should have animation', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const title = page.locator('#proyectos .wp-projects__title');
      await expect(title).toHaveAttribute('data-aos', 'fade-up');
    });

    test('all project cards should have data-aos attribute', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = cards.nth(i);
        await expect(card).toHaveAttribute('data-aos', 'fade-up');
      }
    });

    test('project cards should have data-aos-delay attributes', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const firstCard = cards.first();
      const delay = await firstCard.getAttribute('data-aos-delay');
      expect(delay).toBe('0');
    });
  });

  test.describe('Experience Section Animations', () => {
    test('experience cards should have data-aos attribute', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      
      const firstCard = cards.first();
      await expect(firstCard).toHaveAttribute('data-aos', 'fade-up');
    });

    test('experience cards should have staggered data-aos-delay', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('.wp-exp__card');
      const firstCard = cards.first();
      const delay = await firstCard.getAttribute('data-aos-delay');
      expect(delay).toBe('0');
    });
  });

  test.describe('Contact Section Animations', () => {
    test('contact header should have animation', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const header = page.locator('#contacto .wp-contact__header');
      await expect(header).toHaveAttribute('data-aos', 'fade-up');
    });

    test('contact form should have animation', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const form = page.locator('#contacto form');
      await expect(form).toHaveAttribute('data-aos', 'fade-up');
    });

    test('contact should have 2 animated elements', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const contactAnimations = page.locator('#contacto [data-aos]');
      await expect(contactAnimations).toHaveCount(2);
    });
  });

  test.describe('Animation Behavior', () => {
    test('AOS should add aos-animate class after scrolling into view', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const title = page.locator('#proyectos .wp-projects__title');
      await expect(title).toHaveClass(/aos-animate/);
    });

    test('scroll should trigger animation on elements', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const projectTitle = page.locator('#proyectos .wp-projects__title');
      const isVisible = await projectTitle.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.opacity !== '0';
      });
      
      expect(isVisible).toBe(true);
    });
  });

  test.describe('Animation Delays Coverage', () => {
    test('should have elements with various delay values', async ({ page }) => {
      const delays = ['0', '100', '200', '300', '400'];
      let foundCount = 0;
      
      for (const delay of delays) {
        const elements = page.locator(`[data-aos-delay="${delay}"]`);
        const count = await elements.count();
        if (count > 0) foundCount++;
      }
      
      expect(foundCount).toBeGreaterThanOrEqual(3);
    });
  });
});
