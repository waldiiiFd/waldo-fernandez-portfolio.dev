const REVEAL_SELECTOR = "[data-reveal], [data-reveal-group] > *";
const REVEALED_CLASS = "is-revealed";
const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getExplicitDelay(el: HTMLElement): number {
  const value = Number(el.dataset.revealDelay);
  return Number.isFinite(value) ? value : 0;
}

function reveal(el: HTMLElement, delayMs: number): void {
  el.style.setProperty("--reveal-delay", `${delayMs}ms`);
  el.classList.add(REVEALED_CLASS);
}

function byDocumentOrder(a: HTMLElement, b: HTMLElement): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

function initReveal(): void {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
  );
  if (targets.length === 0) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add(REVEALED_CLASS));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      // Los elementos que entran en el mismo frame se escalonan en orden de
      // lectura: da al hero (y a cualquier fila de tarjetas) su entrada orquestada.
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target as HTMLElement)
        .sort(byDocumentOrder);

      entering.forEach((el, index) => {
        const step = Math.min(index, MAX_STAGGER_STEPS);
        reveal(el, getExplicitDelay(el) + step * STAGGER_MS);
        obs.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  targets.forEach((el) => observer.observe(el));
}

// Espera al loader para que la primera pantalla se revele mientras se disuelve.
function whenLoaderIsGone(callback: () => void): void {
  const loaderPresent = document.getElementById("page-loader") !== null;
  const alreadyHidden = document.documentElement.dataset.loaded === "true";

  if (!loaderPresent || alreadyHidden) {
    callback();
    return;
  }
  document.addEventListener("page-loader:hidden", callback, { once: true });
}

whenLoaderIsGone(initReveal);

export {};