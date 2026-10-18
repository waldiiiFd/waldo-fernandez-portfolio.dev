const ACTIVE_ATTR = "data-carousel-active";
const ANIMATING_CLASS = "is-animating";
// Debe ser algo mayor que la duración de la transición en projects-carousel.css (0.7s).
const SETTLE_FALLBACK_MS = 850;
const DEFAULT_INTERVAL_MS = 3000;

const MQ_THREE_UP = "(min-width: 1024px)";
const MQ_TWO_UP = "(min-width: 640px)";
const MQ_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Direction = 1 | -1;

function getSlidesPerView(): number {
  if (window.matchMedia(MQ_THREE_UP).matches) return 3;
  if (window.matchMedia(MQ_TWO_UP).matches) return 2;
  return 1;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(MQ_REDUCED_MOTION).matches;
}

class ProjectsCarousel {
  private readonly root: HTMLElement;
  private readonly viewport: HTMLElement;
  private readonly track: HTMLElement;
  private readonly prevBtn: HTMLButtonElement | null;
  private readonly toggleBtn: HTMLButtonElement | null;
  private readonly nextBtn: HTMLButtonElement | null;
  private readonly originals: HTMLElement[];
  private readonly intervalMs: number;

  private clones: HTMLElement[] = [];
  private index = 0;
  private timer: number | null = null;
  private settleTimer: number | null = null;
  private settleCleanup: (() => void) | null = null;
  private listeners: AbortController | null = null;

  private active = false;
  private isMoving = false;
  private userPaused = false;
  private hovered = false;
  private focused = false;
  private inView = true;

  constructor(root: HTMLElement, viewport: HTMLElement, track: HTMLElement) {
    this.root = root;
    this.viewport = viewport;
    this.track = track;
    this.prevBtn = root.querySelector<HTMLButtonElement>(
      "[data-carousel-prev]",
    );
    this.nextBtn = root.querySelector<HTMLButtonElement>(
      "[data-carousel-next]",
    );
    this.toggleBtn = root.querySelector<HTMLButtonElement>(
      "[data-carousel-toggle]",
    );
    this.toggleBtn?.addEventListener("click", () => this.togglePause());
    this.originals = Array.from(track.children) as HTMLElement[];

    const interval = Number(root.dataset.interval);
    this.intervalMs =
      Number.isFinite(interval) && interval > 0
        ? interval
        : DEFAULT_INTERVAL_MS;

    this.bindStaticEvents();
    this.sync();
  }

  /** Eventos que viven todo el ciclo de vida de la página. */
  private bindStaticEvents(): void {
    this.prevBtn?.addEventListener("click", () => this.move(-1));
    this.nextBtn?.addEventListener("click", () => this.move(1));

    window.addEventListener("resize", () => this.sync());
    window
      .matchMedia(MQ_REDUCED_MOTION)
      .addEventListener("change", () => this.updateTimer());
    document.addEventListener("visibilitychange", () => this.updateTimer());

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        this.inView = entries.some((entry) => entry.isIntersecting);
        this.updateTimer();
      }).observe(this.root);
    }
  }

  /** Activa/desactiva el modo carrusel y recoloca al cambiar el ancho. */
  private sync(): void {
    const shouldRun = this.originals.length > getSlidesPerView();

    if (shouldRun && !this.active) {
      this.enable();
    } else if (!shouldRun && this.active) {
      this.disable();
    } else if (this.active) {
      // Cambió el ancho de slide: mismo proyecto a la vista, sin animar.
      const count = this.originals.length;
      this.jumpTo(count + ((((this.index - count) % count) + count) % count));
    }
  }

  private enable(): void {
    this.active = true;
    const count = this.originals.length;
    const leading = this.originals.map((slide) => this.createClone(slide));
    const trailing = this.originals.map((slide) => this.createClone(slide));
    this.clones = [...leading, ...trailing];
    this.track.prepend(...leading);
    this.track.append(...trailing);
    this.root.setAttribute(ACTIVE_ATTR, "true");

    this.listeners = new AbortController();
    const { signal } = this.listeners;
    this.root.addEventListener("mouseenter", () => this.setHovered(true), {
      signal,
    });
    this.root.addEventListener("mouseleave", () => this.setHovered(false), {
      signal,
    });
    this.root.addEventListener("focusin", (event) => this.onFocusIn(event), {
      signal,
    });
    this.root.addEventListener("focusout", (event) => this.onFocusOut(event), {
      signal,
    });

    this.jumpTo(count); // primer slide original
    this.updateTimer();
  }

  private disable(): void {
    this.active = false;
    this.stopTimer();
    this.clearSettle();
    this.isMoving = false;
    this.listeners?.abort();
    this.listeners = null;
    this.clones.forEach((clone) => clone.remove());
    this.clones = [];
    this.root.removeAttribute(ACTIVE_ATTR);
    this.track.classList.remove(ANIMATING_CLASS);
    this.track.style.removeProperty("--carousel-offset");
    this.viewport.scrollLeft = 0;
    this.index = 0;
  }

  /**
   * Clon puramente visual: fuera del árbol de accesibilidad y del tab order,
   * y sin atributos AOS (para que nunca queden ocultos por su estado inicial).
   */
  private createClone(slide: HTMLElement): HTMLElement {
    const clone = slide.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.querySelectorAll<HTMLElement>("[data-aos]").forEach((el) => {
      el.removeAttribute("data-aos");
      el.removeAttribute("data-aos-delay");
      el.classList.remove("aos-init", "aos-animate");
    });
    return clone;
  }

  /** Todos los slides en orden de DOM: [clones][originales][clones]. */
  private get slides(): HTMLElement[] {
    return Array.from(this.track.children) as HTMLElement[];
  }

  private moveTo(index: number, animate: boolean): void {
    const slide = this.slides[index];
    if (!slide) return;
    this.track.classList.toggle(ANIMATING_CLASS, animate);
    this.track.style.setProperty("--carousel-offset", `${slide.offsetLeft}px`);
    this.index = index;
  }

  /** Recoloca sin animar y deja la pista lista para animar el siguiente paso. */
  private jumpTo(index: number): void {
    this.clearSettle();
    this.isMoving = false;
    this.moveTo(index, false);
    void this.track.offsetWidth; // flush: el próximo movimiento anima desde aquí
    this.viewport.scrollLeft = 0;
  }

  private move(direction: Direction): void {
    if (!this.active || this.isMoving) return;

    const animate = !prefersReducedMotion();
    this.isMoving = true;
    this.moveTo(this.index + direction, animate);

    if (!animate) {
      this.settle();
      return;
    }

    const onEnd = (event: TransitionEvent): void => {
      // Las transiciones de las cards (hover) también burbujean hasta aquí.
      if (event.target !== this.track || event.propertyName !== "transform")
        return;
      this.settle();
    };
    this.settleCleanup = () =>
      this.track.removeEventListener("transitionend", onEnd);
    this.track.addEventListener("transitionend", onEnd);

    // Respaldo por si el navegador no dispara transitionend (pestaña en 2º plano).
    this.settleTimer = window.setTimeout(
      () => this.settle(),
      SETTLE_FALLBACK_MS,
    );
  }

  /** Terminado el movimiento: si caímos en un clon, saltamos a su original. */
  private settle(): void {
    if (!this.isMoving) return;
    const count = this.originals.length;
    this.clearSettle();
    this.isMoving = false;

    if (this.index >= count * 2) this.jumpTo(this.index - count);
    else if (this.index < count) this.jumpTo(this.index + count);
  }

  private clearSettle(): void {
    if (this.settleTimer !== null) window.clearTimeout(this.settleTimer);
    this.settleTimer = null;
    this.settleCleanup?.();
    this.settleCleanup = null;
  }

  private togglePause(): void {
    this.userPaused = !this.userPaused;
    this.toggleBtn?.setAttribute("aria-pressed", String(this.userPaused));
    this.updateTimer();
  }

  private setHovered(value: boolean): void {
    this.hovered = value;
    this.updateTimer();
  }

  /**
   * Si el usuario tabula hasta una card fuera de vista, el navegador desplaza
   * el viewport (overflow hidden) y rompe la alineación: la traemos a la vista.
   */
  private onFocusIn(event: FocusEvent): void {
    this.focused = true;
    this.updateTimer();

    const target = event.target as HTMLElement | null;
    const slide = target?.closest<HTMLElement>(".projects-carousel__slide");
    const slideIndex = slide ? this.slides.indexOf(slide) : -1;

    this.viewport.scrollLeft = 0;
    if (!slide || slideIndex === -1) return;

    const currentOffset = this.slides[this.index]?.offsetLeft ?? 0;
    const start = slide.offsetLeft - currentOffset;
    const end = start + slide.offsetWidth;
    const isVisible = start >= -1 && end <= this.viewport.clientWidth + 1;
    if (!isVisible) this.jumpTo(slideIndex);
  }

  private onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.root.contains(next)) return;
    this.focused = false;
    this.updateTimer();
  }

  private updateTimer(): void {
    const shouldTick =
      this.active &&
      !prefersReducedMotion() &&
      !this.hovered &&
      !this.focused &&
      this.inView &&
      !document.hidden;

    if (shouldTick) this.startTimer();
    else this.stopTimer();
  }

  private startTimer(): void {
    if (this.timer !== null) return;
    this.timer = window.setInterval(() => this.move(1), this.intervalMs);
  }

  private stopTimer(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }
}

function initProjectsCarousels(): void {
  document
    .querySelectorAll<HTMLElement>("[data-projects-carousel]")
    .forEach((root) => {
      const viewport = root.querySelector<HTMLElement>(
        "[data-carousel-viewport]",
      );
      const track = root.querySelector<HTMLElement>("[data-carousel-track]");
      if (!viewport || !track) return;
      new ProjectsCarousel(root, viewport, track);
    });
}

initProjectsCarousels();
