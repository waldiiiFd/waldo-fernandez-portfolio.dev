interface ExperienceCard extends HTMLElement {
  dataset: DOMStringMap & {
    visible?: string;
    index?: string;
  };
}

function initScrollAnimation(): void {
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,
  };

  const animationObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        const card = entry.target as ExperienceCard;
        if (entry.isIntersecting) {
          card.dataset.visible = 'true';
          animationObserver.unobserve(card);
        }
      });
    },
    observerOptions
  );

  const cards = document.querySelectorAll('[data-animate]') as NodeListOf<ExperienceCard>;

  cards.forEach((card: ExperienceCard, index: number): void => {
    card.dataset.index = String(index);
    animationObserver.observe(card);
  });
}

function initReducedMotion(): void {
  const prefersReducedMotion: MediaQueryList = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (prefersReducedMotion.matches) {
    const cards = document.querySelectorAll('[data-animate]') as NodeListOf<ExperienceCard>;
    cards.forEach((card: ExperienceCard): void => {
      card.dataset.visible = 'true';
    });
  }
}

function init(): void {
  initReducedMotion();
  initScrollAnimation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
