export interface AutoplayConditions {
  /** El carrusel está en modo carrusel (hay más slides que los visibles). */
  active: boolean;
  /** El usuario prefiere movimiento reducido. */
  reducedMotion: boolean;
  /** El usuario pausó el autoplay con el botón (WCAG 2.2.2). */
  userPaused: boolean;
  /** El mouse está sobre las cards. */
  hovered: boolean;
  /** Hay foco de teclado dentro del carrusel. */
  focused: boolean;
  /** El carrusel es visible en el viewport. */
  inView: boolean;
  /** La pestaña está oculta. */
  documentHidden: boolean;
}

export function shouldAutoplay(c: AutoplayConditions): boolean {
  return (
    c.active &&
    !c.reducedMotion &&
    !c.userPaused &&
    !c.hovered &&
    !c.focused &&
    c.inView &&
    !c.documentHidden
  );
}
