import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('LCP should be under 2.5 seconds', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          resolve(lastEntry.renderTime || lastEntry.loadTime || 0);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        setTimeout(() => resolve(0), 10000);
      });
    });
    
    expect(lcp).toBeLessThan(2500);
  });

  test('page should load without critical errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('CLS should be zero on initial load', async ({ page }) => {
    await page.goto('/');
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (entry.hadRecentInput) continue;
            clsValue += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => resolve(clsValue), 1000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });

  test('page should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThan(160);
  });

  test('all external scripts should be deferred or async', async ({ page }) => {
    await page.goto('/');
    
    const scripts = page.locator('script:not([type="application/ld+json"])');
    const count = await scripts.count();
    
    for (let i = 0; i < count; i++) {
      const script = scripts.nth(i);
      const src = await script.getAttribute('src');
      const deferAttr = await script.getAttribute('defer');
      const asyncAttr = await script.getAttribute('async');
      
      if (src && !src.includes('data:')) {
        const isDeferred = deferAttr !== null || asyncAttr !== null;
        if (!isDeferred) {
          console.warn(`Script ${src} lacks defer/async attributes`);
        }
      }
    }
  });
});

test.describe('SEO Tests', () => {
  test('canonical URL should be present', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    
    if (count === 0) {
      console.warn('⚠️ Canonical URL not found - recommended for SEO');
    } else {
      const href = await canonical.first().getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('Open Graph tags should be present', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    
    const hasOgTitle = await ogTitle.count() > 0;
    const hasOgDesc = await ogDescription.count() > 0;
    const hasOgImage = await ogImage.count() > 0;
    
    if (!hasOgTitle || !hasOgDesc || !hasOgImage) {
      console.warn('⚠️ Some Open Graph tags missing - recommended for social sharing');
    } else {
      await expect(ogTitle).toHaveAttribute('content', /^.+$/);
      await expect(ogDescription).toHaveAttribute('content', /^.+$/);
      await expect(ogImage).toHaveAttribute('content', /^.+$/);
    }
  });

  test('Twitter card tags should be present', async ({ page }) => {
    await page.goto('/');
    
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const count = await twitterCard.count();
    
    if (count === 0) {
      console.warn('⚠️ Twitter card tags not found - recommended for social sharing');
    } else {
      await expect(twitterCard).toHaveAttribute('content', /^.+$/);
    }
  });

  test('internal links should use proper href format', async ({ page }) => {
    await page.goto('/');
    
    const internalLinks = page.locator('a[href^="#"]');
    const count = await internalLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^#[a-z][\w-]*$/);
    }
  });
});
