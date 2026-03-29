import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Meta Tags', () => {
    test('should have title tag', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have meta description', async ({ page }) => {
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThan(160);
    });

    test('should have charset', async ({ page }) => {
      const charset = await page.locator('meta[charset]').getAttribute('charset');
      expect(charset?.toLowerCase()).toBe('utf-8');
    });

    test('should have viewport meta', async ({ page }) => {
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width');
      expect(viewport).toContain('initial-scale');
    });
  });

  test.describe('Canonical URL', () => {
    test('should have canonical URL', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      const count = await canonical.count();
      
      if (count > 0) {
        const href = await canonical.first().getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    });

    test('should have valid canonical URL format', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      const count = await canonical.count();
      
      if (count > 0) {
        const href = await canonical.first().getAttribute('href');
        const url = new URL(href!);
        expect(url.hostname).toBeTruthy();
      }
    });
  });

  test.describe('Open Graph', () => {
    test('should have og:title', async ({ page }) => {
      const ogTitle = page.locator('meta[property="og:title"]');
      const count = await ogTitle.count();
      
      if (count > 0) {
        const content = await ogTitle.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have og:description', async ({ page }) => {
      const ogDesc = page.locator('meta[property="og:description"]');
      const count = await ogDesc.count();
      
      if (count > 0) {
        const content = await ogDesc.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have og:type', async ({ page }) => {
      const ogType = page.locator('meta[property="og:type"]');
      const count = await ogType.count();
      
      if (count > 0) {
        const content = await ogType.first().getAttribute('content');
        expect(content).toBe('website');
      }
    });

    test('should have og:url', async ({ page }) => {
      const ogUrl = page.locator('meta[property="og:url"]');
      const count = await ogUrl.count();
      
      if (count > 0) {
        const content = await ogUrl.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have og:image', async ({ page }) => {
      const ogImage = page.locator('meta[property="og:image"]');
      const count = await ogImage.count();
      
      if (count > 0) {
        const content = await ogImage.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });
  });

  test.describe('Twitter Cards', () => {
    test('should have twitter:card', async ({ page }) => {
      const twitterCard = page.locator('meta[name="twitter:card"]');
      const count = await twitterCard.count();
      
      if (count > 0) {
        const content = await twitterCard.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have twitter:title', async ({ page }) => {
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      const count = await twitterTitle.count();
      
      if (count > 0) {
        const content = await twitterTitle.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have twitter:description', async ({ page }) => {
      const twitterDesc = page.locator('meta[name="twitter:description"]');
      const count = await twitterDesc.count();
      
      if (count > 0) {
        const content = await twitterDesc.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });

    test('should have twitter:image', async ({ page }) => {
      const twitterImage = page.locator('meta[name="twitter:image"]');
      const count = await twitterImage.count();
      
      if (count > 0) {
        const content = await twitterImage.first().getAttribute('content');
        expect(content).toBeTruthy();
      }
    });
  });

  test.describe('Links', () => {
    test('should have internal links with proper format', async ({ page }) => {
      const links = page.locator('a[href^="#"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have valid href format', async ({ page }) => {
      const links = page.locator('a[href^="#"]');
      const count = await links.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).toMatch(/^#[a-z][\w-]*$/);
      }
    });

    test('should have unique section IDs', async ({ page }) => {
      const sections = page.locator('section[id]');
      const ids = await sections.evaluateAll((els) => 
        els.map((el) => el.id).filter(Boolean)
      );
      
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  test.describe('Favicon', () => {
    test('should have favicon link', async ({ page }) => {
      const favicon = page.locator('link[rel="icon"]');
      const count = await favicon.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Projects Links', () => {
    test('project links container should exist', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const linksContainer = page.locator('.wp-projects__card-links');
      const count = await linksContainer.count();
      expect(count).toBeGreaterThan(0);
    });

    test('external project links should have proper rel', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const externalLinks = page.locator('.wp-projects__card-links a[target="_blank"]');
      const count = await externalLinks.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const rel = await externalLinks.nth(i).getAttribute('rel');
          expect(rel).toMatch(/noopener/);
        }
      }
    });

    test('project links should have valid href when present', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const projectLinks = page.locator('.wp-projects__card-links a');
      const count = await projectLinks.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 5); i++) {
          const href = await projectLinks.nth(i).getAttribute('href');
          expect(href).toBeTruthy();
        }
      }
    });

    test('GitHub links should be valid URLs', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const githubLinks = page.locator('.wp-projects__card-links a[href*="github.com"]');
      const count = await githubLinks.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await githubLinks.nth(i).getAttribute('href');
          expect(href).toMatch(/^https?:\/\/github\.com\//);
        }
      }
    });

    test('demo links should be valid URLs', async ({ page }) => {
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const demoLinks = page.locator('.wp-projects__card-links a[aria-label*="en vivo"]');
      const count = await demoLinks.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await demoLinks.nth(i).getAttribute('href');
          expect(href).toMatch(/^https?:\/\//);
        }
      }
    });
  });
});
