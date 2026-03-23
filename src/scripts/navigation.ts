const header = document.querySelector('[data-header]') as HTMLElement | null;
const logoImg = document.querySelector('[data-logo]') as HTMLImageElement | null;
const mobileMenuToggle = document.getElementById('mobile-menu-toggle') as HTMLButtonElement | null;
const mobileMenu = document.getElementById('mobile-menu') as HTMLElement | null;
const menuIcon = mobileMenuToggle?.querySelector('.menu-icon') as HTMLElement | null;
const closeIcon = mobileMenuToggle?.querySelector('.close-icon') as HTMLElement | null;
const navLinks = document.querySelectorAll('[data-section]') as NodeListOf<HTMLAnchorElement>;

const SCROLL_THRESHOLD = 30;

let isMenuOpen = false;

function toggleMobileMenu(): void {
  isMenuOpen = !isMenuOpen;

  mobileMenu?.classList.toggle('hidden', !isMenuOpen);
  mobileMenu?.setAttribute('aria-hidden', String(!isMenuOpen));
  mobileMenuToggle?.setAttribute('aria-expanded', String(isMenuOpen));
  mobileMenuToggle?.setAttribute(
    'aria-label',
    isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
  );
  menuIcon?.classList.toggle('hidden', isMenuOpen);
  closeIcon?.classList.toggle('hidden', !isMenuOpen);
}

function closeMobileMenu(): void {
  isMenuOpen = false;
  mobileMenu?.classList.add('hidden');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  mobileMenuToggle?.setAttribute('aria-expanded', 'false');
  mobileMenuToggle?.setAttribute('aria-label', 'Abrir menú de navegación');
  menuIcon?.classList.remove('hidden');
  closeIcon?.classList.add('hidden');
}

function handleScroll(): void {
  const scrollY = window.scrollY;
  const isScrolled = scrollY > SCROLL_THRESHOLD;

  header?.setAttribute('data-scrolled', String(isScrolled));

  // Logo swap — versión optimizada según estado
  if (isScrolled) {
    logoImg?.setAttribute('src', '/images/letra-w-40.png');
    logoImg?.setAttribute('width', '20');
    logoImg?.setAttribute('height', '20');
  } else {
    logoImg?.setAttribute('src', '/images/letra-w-80.png');
    logoImg?.setAttribute('width', '0');
    logoImg?.setAttribute('height', '0');
  }

  // Active link tracking
  const sections = document.querySelectorAll('section[id]') as NodeListOf<HTMLElement>;
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      currentSection = section.id;
    }
  });

  updateActiveLink(currentSection);
}

function updateActiveLink(currentSection: string): void {
  navLinks.forEach((link) => {
    const section = link.getAttribute('data-section');
    const isActive = section === currentSection;
    link.classList.toggle('active', isActive);
  });
}

mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', (e) => {
  if (isMenuOpen && header && !header.contains(e.target as Node)) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMobileMenu();
    mobileMenuToggle?.focus();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (isMenuOpen) closeMobileMenu();
  });
});

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();