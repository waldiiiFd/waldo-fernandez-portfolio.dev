interface ProjectCard {
  element: HTMLElement;
  visible: boolean;
}

function getCardsPerPage(): number {
  const width = window.innerWidth;
  if (width >= 640 && width < 1024) {
    return 4;
  }
  return 3;
}

class ProjectsPagination {
  private container: HTMLElement | null;
  private cards: ProjectCard[] = [];
  private currentPage: number = 1;
  private cardsPerPage: number = 3;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private counter: HTMLElement | null = null;

  constructor() {
    this.container = document.querySelector("[data-projects-container]");

    if (!this.container) return;

    const cardElements = this.container.querySelectorAll<HTMLElement>(".wp-projects__card");
    this.cards = Array.from(cardElements).map((el) => ({
      element: el,
      visible: false,
    }));

    this.prevBtn = document.querySelector("[data-projects-prev]");
    this.nextBtn = document.querySelector("[data-projects-next]");
    this.counter = document.querySelector("[data-projects-counter]");

    this.cardsPerPage = getCardsPerPage();

    this.init();
  }

  private init(): void {
    if (this.cards.length <= this.cardsPerPage) return;

    this.showPage(1);
    this.bindEvents();
  }

  private bindEvents(): void {
    this.prevBtn?.addEventListener("click", () => this.prevPage());
    this.nextBtn?.addEventListener("click", () => this.nextPage());

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevPage();
      if (e.key === "ArrowRight") this.nextPage();
    });

    let resizeTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCardsPerPage = getCardsPerPage();
        if (newCardsPerPage !== this.cardsPerPage) {
          this.cardsPerPage = newCardsPerPage;
          this.showPage(1);
        }
      }, 150);
    });
  }

  private showPage(page: number): void {
    const start = (page - 1) * this.cardsPerPage;
    const end = start + this.cardsPerPage;
    const totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

    this.cards.forEach((card, index) => {
      card.visible = index >= start && index < end;
      card.element.style.display = card.visible ? "" : "none";
    });

    this.currentPage = page;
    this.updateControls(totalPages);
  }

  private updateControls(totalPages: number): void {
    const start = (this.currentPage - 1) * this.cardsPerPage + 1;
    const end = Math.min(this.currentPage * this.cardsPerPage, this.cards.length);

    if (this.counter) {
      this.counter.textContent = `${start} - ${end} de ${this.cards.length}`;
    }

    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentPage === 1;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentPage === totalPages;
    }
  }

  private prevPage(): void {
    if (this.currentPage > 1) {
      this.showPage(this.currentPage - 1);
    }
  }

  private nextPage(): void {
    const totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
    if (this.currentPage < totalPages) {
      this.showPage(this.currentPage + 1);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProjectsPagination();
});
