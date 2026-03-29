interface AnimationConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

const defaultConfig: AnimationConfig = {
  threshold: 0.1,
  rootMargin: '0px',
  once: true,
};

export const initAnimations = (config: AnimationConfig = {}): void => {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const { threshold, rootMargin, once } = { ...defaultConfig, ...config };

  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;
        const shouldAnimate =
          once
            ? isIntersecting
            : isIntersecting || entry.target.classList.contains('is-visible');

        if (shouldAnimate) {
          const delay = (entry.target as HTMLElement).dataset.animateDelay;

          if (delay) {
            const delayValue = parseInt(delay, 10);
            if (!isNaN(delayValue) && delayValue > 0) {
              setTimeout(() => {
                entry.target.classList.add('is-visible');
              }, delayValue);
            } else {
              entry.target.classList.add('is-visible');
            }
          } else {
            entry.target.classList.add('is-visible');
          }

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold, rootMargin }
  );

  animatedElements.forEach((el) => observer.observe(el));

  const handleVisibility = () => {
    if (document.hidden) {
      observer.disconnect();
    } else {
      animatedElements.forEach((el) => observer.observe(el));
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);
};
