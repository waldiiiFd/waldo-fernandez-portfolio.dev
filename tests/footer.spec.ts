import { test, expect } from '@playwright/test';

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Footer Structure', () => {
    test('should display footer element', async ({ page }) => {
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeVisible();
    });

    test('should have proper aria-label', async ({ page }) => {
      const footer = page.locator('footer');
      const ariaLabel = await footer.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('should display footer branding', async ({ page }) => {
      const brand = page.locator('.wp-footer__brand');
      await expect(brand).toBeVisible();
    });

    test('should display logo image', async ({ page }) => {
      const logo = page.locator('.wp-footer__brand img');
      await expect(logo).toBeVisible();
    });

    test('should display developer name', async ({ page }) => {
      const name = page.locator('.wp-footer__name');
      await expect(name).toBeVisible();
      await expect(name).toContainText('Waldo Fernández');
    });

    test('should display tagline', async ({ page }) => {
      const tagline = page.locator('.wp-footer__tagline');
      await expect(tagline).toBeVisible();
    });
  });

  test.describe('Contact Info', () => {
    test('should display contact heading', async ({ page }) => {
      const heading = page.locator('.wp-footer__heading', { hasText: 'Contacto' });
      await expect(heading).toBeVisible();
    });

    test('should display phone contact', async ({ page }) => {
      const phoneLabel = page.locator('.wp-footer__contact-label', { hasText: 'Teléfono' });
      await expect(phoneLabel).toBeVisible();
      
      const phoneValue = page.locator('.wp-footer__contact-link[href^="tel:"]');
      await expect(phoneValue).toBeVisible();
      await expect(phoneValue).toHaveAttribute('href', /^tel:/);
    });

    test('should display email contact', async ({ page }) => {
      const emailLabel = page.locator('.wp-footer__contact-label', { hasText: 'Correo' });
      await expect(emailLabel).toBeVisible();
      
      const emailLink = page.locator('.wp-footer__contact-link[href^="mailto:"]');
      await expect(emailLink).toBeVisible();
      await expect(emailLink).toHaveAttribute('href', /^mailto:/);
    });

    test('should display location', async ({ page }) => {
      const locationLabel = page.locator('.wp-footer__contact-label', { hasText: 'Ubicación' });
      await expect(locationLabel).toBeVisible();
      
      const locationValue = page.locator('.wp-footer__contact-value', { hasText: 'La Habana' });
      await expect(locationValue).toBeVisible();
    });

    test('should display schedule', async ({ page }) => {
      const scheduleLabel = page.locator('.wp-footer__contact-label', { hasText: 'Horario' });
      await expect(scheduleLabel).toBeVisible();
    });
  });

  test.describe('Social Links', () => {
    test('should display social heading', async ({ page }) => {
      const heading = page.locator('.wp-footer__heading', { hasText: 'Redes' });
      await expect(heading).toBeVisible();
    });

    test('should have GitHub link', async ({ page }) => {
      const githubLink = page.locator('.wp-footer__social-link[href*="github.com"]');
      await expect(githubLink).toBeVisible();
      await expect(githubLink).toHaveAttribute('target', '_blank');
      await expect(githubLink).toHaveAttribute('rel', /noopener/);
    });

    test('should have LinkedIn link', async ({ page }) => {
      const linkedinLink = page.locator('.wp-footer__social-link[href*="linkedin.com"]');
      await expect(linkedinLink).toBeVisible();
      await expect(linkedinLink).toHaveAttribute('target', '_blank');
      await expect(linkedinLink).toHaveAttribute('rel', /noopener/);
    });

    test('should have proper aria-labels on social links', async ({ page }) => {
      const socialLinks = page.locator('.wp-footer__social-link');
      const count = await socialLinks.count();
      
      for (let i = 0; i < count; i++) {
        const ariaLabel = await socialLinks.nth(i).getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toMatch(/Visitar perfil de/);
      }
    });

    test('social links should open in new tab', async ({ page }) => {
      const socialLinks = page.locator('.wp-footer__social-link');
      const target = await socialLinks.first().getAttribute('target');
      expect(target).toBe('_blank');
    });
  });

  test.describe('Back to Top Button', () => {
    test('should have back to top button', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      await expect(backToTopBtn).toBeAttached();
    });

    test('should have proper aria-label', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      const ariaLabel = await backToTopBtn.getAttribute('aria-label');
      expect(ariaLabel).toContain('inicio');
    });

    test('should have data-visible attribute', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      const dataVisible = await backToTopBtn.getAttribute('data-visible');
      expect(dataVisible).toBeTruthy();
    });

    test('should be hidden initially', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      
      const dataVisible = await backToTopBtn.getAttribute('data-visible');
      expect(dataVisible).toBe('false');
    });

    test('should become visible after scrolling', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);
      
      const dataVisible = await backToTopBtn.getAttribute('data-visible');
      expect(dataVisible).toBe('true');
    });

    test('should scroll to top when clicked', async ({ page }) => {
      const backToTopBtn = page.locator('#back-to-top');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);
      
      await backToTopBtn.click();
      await page.waitForTimeout(500);
      
      const scrollPosition = await page.evaluate(() => window.scrollY);
      expect(scrollPosition).toBe(0);
    });
  });

  test.describe('Copyright', () => {
    test('should display copyright text', async ({ page }) => {
      const copyright = page.locator('.wp-footer__copyright');
      await expect(copyright).toBeVisible();
    });

    test('should display current year', async ({ page }) => {
      const copyright = page.locator('.wp-footer__copyright');
      const content = await copyright.textContent();
      const currentYear = new Date().getFullYear().toString();
      expect(content).toContain(currentYear);
    });

    test('should display developer name in copyright', async ({ page }) => {
      const copyright = page.locator('.wp-footer__copyright');
      const content = await copyright.textContent();
      expect(content).toContain('Waldo Fernández');
    });

    test('should display rights reserved text', async ({ page }) => {
      const copyright = page.locator('.wp-footer__copyright');
      const content = await copyright.textContent();
      expect(content).toContain('derechos reservados');
    });
  });

  test.describe('Responsive', () => {
    test('should be visible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should be visible on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should be visible on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });
  });
});
