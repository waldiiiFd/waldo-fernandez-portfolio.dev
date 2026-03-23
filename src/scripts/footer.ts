// Año dinámico en copyright
const yearSpan = document.querySelector('[data-year]') as HTMLSpanElement | null;
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Botón volver arriba
const backToTopBtn = document.getElementById('back-to-top') as HTMLButtonElement | null;

const SCROLL_OFFSET = 300;

function handleBackToTopVisibility(): void {
  const isVisible = window.scrollY > SCROLL_OFFSET;
  backToTopBtn?.setAttribute('data-visible', String(isVisible));
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

backToTopBtn?.addEventListener('click', scrollToTop);
window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

// Estado inicial
handleBackToTopVisibility();