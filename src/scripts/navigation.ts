// Píxeles de scroll a partir de los cuales el header se compacta
const SCROLL_THRESHOLD = 30;
// Debe coincidir con el breakpoint `md` de Tailwind (el menú móvil se oculta)
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

const header: HTMLElement | null = document.getElementById('site-header');
const toggle: HTMLElement | null = document.getElementById('nav-toggle');
const menu: HTMLElement | null = document.getElementById('mobile-menu');
const navLinks: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll<HTMLAnchorElement>('[data-section]');

function isMenuOpen(): boolean {
  return menu?.classList.contains('is-open') ?? false;
}

function setMenuOpen(open: boolean): void {
  menu?.classList.toggle('is-open', open);
  toggle?.classList.toggle('is-open', open);
  header?.classList.toggle('menu-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute(
    'aria-label',
    open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
  );
}

function openMenu(): void {
  setMenuOpen(true);
}

function closeMenu(): void {
  setMenuOpen(false);
}

function toggleMenu(): void {
  if (isMenuOpen()) {
    closeMenu();
  } else {
    openMenu();
  }
}

function updateActiveLink(sectionId: string): void {
  navLinks.forEach((link: HTMLAnchorElement): void => {
    const isActive: boolean = link.dataset.section === sectionId;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Compacta el header (y activa su fondo) una vez que la página ha hecho scroll
let ticking = false;

function updateHeaderState(): void {
  header?.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  ticking = false;
}

function onScroll(): void {
  if (!ticking) {
    window.requestAnimationFrame(updateHeaderState);
    ticking = true;
  }
}

function initSectionObserver(): void {
  const sections: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>('section[id]');

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      let currentSection = '';

      entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
          currentSection = entry.target.id;
        }
      });

      if (currentSection) {
        updateActiveLink(currentSection);
      }
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section: HTMLElement): void => {
    observer.observe(section);
  });
}

toggle?.addEventListener('click', toggleMenu);

// Cierra el menú móvil al elegir un destino
menu?.querySelectorAll<HTMLAnchorElement>('a').forEach((link: HTMLAnchorElement): void => {
  link.addEventListener('click', closeMenu);
});

// Cierra al hacer clic fuera del header
document.addEventListener('click', (event: MouseEvent): void => {
  if (isMenuOpen() && header && !header.contains(event.target as Node)) {
    closeMenu();
  }
});

// Cierra con Escape y devuelve el foco al botón
document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && isMenuOpen()) {
    closeMenu();
    toggle?.focus();
  }
});

// Si el viewport pasa a escritorio con el menú abierto, lo cierra
window.matchMedia(DESKTOP_MEDIA_QUERY).addEventListener('change', (event: MediaQueryListEvent): void => {
  if (event.matches) closeMenu();
});

window.addEventListener('scroll', onScroll, { passive: true });

updateHeaderState();
initSectionObserver();

export {};
