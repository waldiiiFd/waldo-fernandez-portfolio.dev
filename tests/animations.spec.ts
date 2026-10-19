import { test, expect } from "@playwright/test";

test.describe("Animations - Reveal System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Animation System Setup", () => {
    test("should not depend on AOS", async ({ page }) => {
      await expect(page.locator("[data-aos]")).toHaveCount(0);
    });

    test("should have data-reveal attribute on animated elements", async ({
      page,
    }) => {
      const count = await page.locator("[data-reveal]").count();
      expect(count).toBeGreaterThan(5);
    });

    test("should have data-reveal-delay attributes for staggered animations", async ({
      page,
    }) => {
      const count = await page.locator("[data-reveal-delay]").count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Hero Section Animations", () => {
    test("hero content should be a reveal group", async ({ page }) => {
      await expect(page.locator("#inicio [data-reveal-group]")).toHaveCount(1);
    });

    test("hero should have animated children", async ({ page }) => {
      const count = await page
        .locator("#inicio [data-reveal-group] > *")
        .count();
      expect(count).toBeGreaterThanOrEqual(4);
    });
  });

  test.describe("About Section Animations", () => {
    test("about should have animated elements", async ({ page }) => {
      const count = await page.locator("#sobre-mi [data-reveal]").count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test("about photo should have reveal attribute", async ({ page }) => {
      const photo = page.locator("#sobre-mi .wp-about__photo-wrapper");
      await expect(photo).toHaveAttribute("data-reveal", "");
    });
  });

  test.describe("Projects Section Animations", () => {
    test("projects title should have animation", async ({ page }) => {
      const title = page.locator("#proyectos .wp-projects__title");
      await expect(title).toHaveAttribute("data-reveal", "");
    });

    test("projects carousel should reveal as a whole", async ({ page }) => {
      const carousel = page.locator("#proyectos .projects-carousel");
      await expect(carousel).toHaveAttribute("data-reveal", "");
      await expect(
        page.locator("#proyectos .wp-projects__card[data-reveal]"),
      ).toHaveCount(0);
    });
  });

  test.describe("Experience Section Animations", () => {
    test("experience cards should have reveal attribute", async ({ page }) => {
      const cards = page.locator(".wp-exp__card");
      expect(await cards.count()).toBeGreaterThan(0);
      await expect(cards.first()).toHaveAttribute("data-reveal", "");
    });
  });

  test.describe("Contact Section Animations", () => {
    test("contact header should have animation", async ({ page }) => {
      const header = page.locator("#contacto .wp-contact__header");
      await expect(header).toHaveAttribute("data-reveal", "");
    });

    test("contact form should have animation with delay", async ({ page }) => {
      const form = page.locator("#contacto form");
      await expect(form).toHaveAttribute("data-reveal", "");
      await expect(form).toHaveAttribute("data-reveal-delay", "100");
    });

    test("contact should have 2 animated elements", async ({ page }) => {
      await expect(page.locator("#contacto [data-reveal]")).toHaveCount(2);
    });
  });

  test.describe("Animation Behavior", () => {
    test("reveal should add is-revealed class after scrolling into view", async ({
      page,
    }) => {
      await page.locator("#proyectos").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);

      const title = page.locator("#proyectos .wp-projects__title");
      await expect(title).toHaveClass(/is-revealed/);
    });

    test("scroll should leave revealed elements visible", async ({ page }) => {
      await page.locator("#proyectos").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);

      const opacity = await page
        .locator("#proyectos .wp-projects__title")
        .evaluate((el) => window.getComputedStyle(el).opacity);
      expect(opacity).toBe("1");
    });

    test("carousel clones should never be hidden by reveal state", async ({
      page,
    }) => {
      await page.locator("#proyectos").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);

      const hidden = await page
        .locator("#proyectos .projects-carousel [aria-hidden='true'][data-reveal]")
        .count();
      expect(hidden).toBe(0);
    });
  });

  test.describe("Reduced Motion", () => {
    test("should show all content immediately", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto("/");

      const opacity = await page
        .locator("#contacto .wp-contact__form")
        .evaluate((el) => window.getComputedStyle(el).opacity);
      expect(opacity).toBe("1");
      await context.close();
    });
  });
});
