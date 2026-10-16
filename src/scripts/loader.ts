// Tiempo mínimo visible: evita un parpadeo si la página carga muy rápido
const MIN_DISPLAY_MS = 600;
// Debe coincidir con --loader-exit en loader.css
const EXIT_DURATION_MS = 450;

function hideLoader(loader: HTMLElement): void {
  loader.classList.add('hidden');
  window.setTimeout((): void => loader.remove(), EXIT_DURATION_MS);
}

function initLoader(loader: HTMLElement): void {
  const startedAt: number = performance.now();

  const onReady = (): void => {
    const elapsed: number = performance.now() - startedAt;
    const remaining: number = Math.max(0, MIN_DISPLAY_MS - elapsed);
    window.setTimeout((): void => hideLoader(loader), remaining);
  };

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }
}

const pageLoader: HTMLElement | null = document.getElementById('page-loader');

if (pageLoader) {
  initLoader(pageLoader);
}