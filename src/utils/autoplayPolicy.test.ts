import { describe, it, expect } from 'vitest';
import { shouldAutoplay, type AutoplayConditions } from './autoplayPolicy';

const runnable: AutoplayConditions = {
  active: true,
  reducedMotion: false,
  userPaused: false,
  hovered: false,
  focused: false,
  inView: true,
  documentHidden: false,
};

describe('shouldAutoplay', () => {
  it('avanza cuando todas las condiciones lo permiten', () => {
    expect(shouldAutoplay(runnable)).toBe(true);
  });

  it.each([
    ['el carrusel no está activo', { active: false }],
    ['prefiere movimiento reducido', { reducedMotion: true }],
    ['el usuario lo pausó', { userPaused: true }],
    ['el mouse está encima', { hovered: true }],
    ['hay foco de teclado', { focused: true }],
    ['no está en el viewport', { inView: false }],
    ['la pestaña está oculta', { documentHidden: true }],
  ] as const)('se detiene si %s', (_motivo, override) => {
    expect(shouldAutoplay({ ...runnable, ...override })).toBe(false);
  });

  it('se detiene si se combinan varios motivos', () => {
    expect(
      shouldAutoplay({ ...runnable, hovered: true, focused: true, inView: false }),
    ).toBe(false);
  });
});
