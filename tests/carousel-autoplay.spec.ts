import { test, expect, type Page } from "@playwright/test";
const INTERVAL_MS = 3000;

async function openCarousel(page: Page) {
  await page.clock.install();
  await page.goto("/");
  // Vacía los temporizadores del loader para que no tape la página.
  await page.clock.runFor(3000);

  const root = page.locator("#proyectos .projects-carousel");
  await root.scrollIntoViewIfNeeded();
  // El IntersectionObserver del carrusel se resuelve en tiempo real (no usa timers).
  await page.waitForTimeout(300);
  await expect(root).toHaveAttribute("data-carousel-active", "true");

  const track = root.locator("[data-carousel-track]");
  const offset = () =>
    track.evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue("--carousel-offset"),
    );
  return { root, offset };
}

test.describe("Projects carousel - autoplay", () => {
  test("advances after a full interval", async ({ page }) => {
    const { offset } = await openCarousel(page);
    const before = await offset();
    await page.clock.runFor(INTERVAL_MS + 100);
    expect(await offset()).not.toBe(before);
  });

  test("pauses while the mouse hovers the viewport", async ({ page }) => {
    const { root, offset } = await openCarousel(page);
    await root.locator("[data-carousel-viewport]").hover();
    await page.clock.runFor(100);
    const before = await offset();
    await page.clock.runFor(INTERVAL_MS * 2);
    expect(await offset()).toBe(before);
  });

  test("pause button stops and resumes autoplay", async ({ page }) => {
    const { root, offset } = await openCarousel(page);
    const toggle = root.locator("[data-carousel-toggle]");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.clock.runFor(100);
    const paused = await offset();
    await page.clock.runFor(INTERVAL_MS * 2);
    expect(await offset()).toBe(paused);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await page.clock.runFor(INTERVAL_MS + 100);
    expect(await offset()).not.toBe(paused);
  });

  test("does not autoplay with prefers-reduced-motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const { offset } = await openCarousel(page);
    const before = await offset();
    await page.clock.runFor(INTERVAL_MS * 3);
    expect(await offset()).toBe(before);
    await context.close();
  });
});
