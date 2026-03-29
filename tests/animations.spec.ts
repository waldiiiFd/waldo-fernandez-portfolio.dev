import { test, expect } from '@playwright/test';

test.describe('Animations - Custom Fade System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Animation System Setup', () => {
    test('should have animate-fade-up CSS class available', async ({ page }) => {
      const hasClass = await page.locator('.animate-fade-up').count();
      expect(hasClass).toBeGreaterThan(0);
    });

    test('should have data-animate attribute on animated elements', async ({ page }) => {
      const animatedElements = page.locator('[data-animate="fade-up"]');
      const count = await animatedElements.count();
      expect(count).toBeGreaterThan(5);
    });

    test('should NOT have AOS attributes (deprecated)', async ({ page }) => {
      const aosElements = page.locator('[data-aos]');
      const count = await aosElements.count();
      expect(count).toBe(0);
    });
  });

  test.describe('Hero Section Animations', () => {
    test('hero title should have data-animate attribute', async ({ page }) => {
      const title = page.locator('#inicio h1');
      await expect(title).toHaveAttribute('data-animate', 'fade-up');
    });

    test('hero should have animated elements', async ({ page }) => {
      const heroElements = page.locator('#inicio [data-animate]');
      const count = await heroElements.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test('hero elements should have data-visible attribute after animation', async ({ page }) => {
      await page.waitForTimeout(1000);
      const title = page.locator('#inicio h1');
      await expect(title).toHaveAttribute('data-visible', 'true');
    });
  });

  test.describe('About Section Animations', () => {
    test('about should have animated elements', async ({ page }) => {
      await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const aboutAnimations = page.locator('#sobre-mi [data-animate]');
      const count = await aboutAnimations.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('about elements should have data-visible after scroll', async ({ page }) => {
      await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const photo = page.locator('#sobre-mi .wp-about__photo-wrapper');
      await expect(photo).toHaveAttribute('data-visible', 'true');
    });
  });

  test.describe('Projects Section Animations', () => {
    test('projects title should have animation', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const title = page.locator('#proyectos .wp-projects__title');
      await expect(title).toHaveAttribute('data-animate', 'fade-up');
    });

    test('all project cards should have data-animate attribute', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card).toHaveAttribute('data-animate', 'fade-up');
      }
    });

    test('project cards should have data-animate-delay attributes', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const delay = await card.getAttribute('data-animate-delay');
        expect(delay).toBe(String(i * 100));
      }
    });

    test('project cards should become visible after scroll', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const firstCard = cards.first();
      await expect(firstCard).toHaveAttribute('data-visible', 'true');
    });
  });

  test.describe('Experience Section Animations', () => {
    test('experience cards should have data-animate attribute', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card).toHaveAttribute('data-animate', 'fade-up');
      }
    });

    test('experience cards should have staggered data-animate-delay', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const cards = page.locator('.wp-exp__card');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const delay = await card.getAttribute('data-animate-delay');
        expect(delay).toBe(String(i * 80));
      }
    });
  });

  test.describe('Contact Section Animations', () => {
    test('contact header should have animation', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const header = page.locator('#contacto .wp-contact__header');
      await expect(header).toHaveAttribute('data-animate', 'fade-up');
    });

    test('contact form should have animation', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const form = page.locator('#contacto form');
      await expect(form).toHaveAttribute('data-animate', 'fade-up');
    });

    test('contact should have 2 animated elements', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const contactAnimations = page.locator('#contacto [data-animate]');
      await expect(contactAnimations).toHaveCount(2);
    });
  });

  test.describe('Animation Behavior', () => {
    test('animation elements should have is-visible class after animation', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const cards = page.locator('#proyectos .wp-projects__card');
      const firstCard = cards.first();
      
      const hasClass = await firstCard.evaluate((el) => 
        el.classList.contains('is-visible')
      );
      expect(hasClass).toBe(true);
    });

    test('animation should use CSS transitions', async ({ page }) => {
      const element = page.locator('#inicio [data-animate]').first();
      
      await expect(element).toHaveCSS('transition-property', /opacity/);
      await expect(element).toHaveCSS('transition-property', /transform/);
    });

    test('scroll triggers animation on new elements', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      
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
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const delays = ['0', '100', '200', '300', '400'];
      let foundCount = 0;
      
      for (const delay of delays) {
        const elements = page.locator(`[data-animate-delay="${delay}"]`);
        const count = await elements.count();
        if (count > 0) foundCount++;
      }
      
      expect(foundCount).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Intersection Observer Integration', () => {
    test('at least first element should have data-visible after scroll', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      
      const animatedElements = page.locator('#proyectos [data-animate]');
      const firstElement = animatedElements.first();
      await expect(firstElement).toHaveAttribute('data-visible', 'true');
    });

    test('animation script should add data-visible to elements', async ({ page }) => {
      await page.locator('#experiencia').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      
      const cards = page.locator('.wp-exp__card');
      const firstCard = cards.first();
      await expect(firstCard).toHaveAttribute('data-visible', 'true');
    });
  });
});
