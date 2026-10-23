# Agent Guidelines for Waldo Fernandez Portfolio

## Project Overview

- **Framework**: Astro 7 (^7.2.10)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/vite` plugin
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)
- **Node**: >= 22.12.0
- **Package Manager**: npm (implied)

## Build Commands

| Command               | Action                                     |
| --------------------- | ------------------------------------------ |
| `npm run dev`         | Start local dev server at `localhost:4321` |
| `npm run build`       | Build production site to `./dist/`         |
| `npm run preview`     | Preview production build locally           |
| `npm run astro <cmd>` | Run Astro CLI commands                     |
| `npx astro check`     | Run TypeScript type checking               |
| `npm run test:unit`   | Run unit tests (vitest)                    |
| `npm run test:e2e`    | Run E2E tests (Playwright)                 |

**Note**: Unit tests use vitest (`vitest.config.ts`, environment: node, no DOM) and live next to the code as `src/**/*.test.ts` (contact module and `src/utils/`). E2E tests use Playwright and live in `tests/`. Prefer unit tests for pure logic; add Playwright tests only for behavior that needs a real browser (e.g. carousel autoplay timing).

## Color Palette (Navy Theme)

| Token        | Hex       | Semantic Use                     |
| ------------ | --------- | -------------------------------- |
| `navy-deep`  | `#0D1433` | Foreground (texto principal)     |
| `navy-royal` | `#171F55` | Muted (texto secundario)         |
| `navy-mid`   | `#274272` | Primary (elementos interactivos) |
| `navy-light` | `#6C90C3` | Accent/Border                    |

```css
/* Semantic tokens disponibles */

--color-primary: #274272;

--color-primary-hover: #171f55;

--color-secondary: #6c90c3;

--color-accent: #6c90c3;

--color-background: #f5f7fa;

--color-foreground: #0d1433;

--color-muted: #171f55;

--color-border: #6c90c3;
```

## TypeScript Conventions

- **Strict mode enabled** - no implicit any, strict null checks
- Always define explicit return types for functions
- Use TypeScript's built-in types before importing external types
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `unknown` over `any` when type is uncertain

## Astro File Structure

Each `.astro` file has two sections:

1. **Frontmatter** (between `---`) - imports and logic

2. **Template** - HTML/JSX-like markup with Tailwind classes

```astro

---

import Layout from '../layouts/Layout.astro';

---

<Layout>

  <h1 class="text-3xl font-bold text-foreground">Bienvenido</h1>

</Layout>

```

**IMPORTANT**: Styles and scripts MUST be in separate files:

- Styles → `src/styles/{component-name}.css`
- Scripts → `src/scripts/{component-name}.ts`
- Components → only markup + imports

## Layout Structure

```

Layout.astro (Header + global.css + estructura HTML)

    │

    └── <slot />

            │

            └── Pages (contenido)

```

**Layout incluye:**

- Import de `Header`
- Import de `global.css`
- `<header>` y `<main>` wrapper

## Motion & Transitions

Todo el movimiento vive en CSS + un script pequeño. Los componentes solo llevan atributos `data-*`. **No usar AOS** (ni otras librerías de animación en scroll).

- **Tokens** (`global.css`, `@theme static`): `--ease-hover`, `--ease-spring`, `--ease-soft`, `--motion-fast` (0.27s), `--motion-base` (0.5s), `--motion-slow` (0.9s). Nunca hardcodear `ease` ni una duración en un componente nuevo; usar los tokens.
- **Scroll reveal** (`styles/motion.css` + `scripts/reveal.ts`, cargados desde `Layout.astro`): añadir `data-reveal` (variantes: `fade`, `left`, `scale`, `curtain`), `data-reveal-delay="ms"`, o `data-reveal-group` en un padre para escalonar a sus hijos directos.
- **No sumar delays a mano sobre un grupo**: los elementos que entran en el mismo frame ya se escalonan (90 ms). Usar `data-reveal-delay` solo para casos puntuales.
- **Animar solo `opacity`, `translate`, `scale`, `clip-path`** (nunca `all`). Los reveals usan `animation`, los hover usan `transition` sobre `transform`/`box-shadow`, así nunca colisionan en el mismo elemento.
- **Nunca** dejar un estado inicial `opacity: 0` en el CSS de un componente (p. ej. `[data-visible]`): el único estado inicial permitido es el de `motion.css`, protegido con `@media (scripting: enabled)`.
- **Carrusel de proyectos**: se revela como bloque (`data-reveal` en `.projects-carousel`); las tarjetas y los clones no llevan `data-reveal`.
- **Loader**: `loader.ts` emite `page-loader:hidden` y marca `html[data-loaded="true"]`; `reveal.ts` espera a ese evento para que la primera pantalla se revele al disolverse el loader.
- **Page transitions**: no se usan (sitio de una sola página con anclas). Si se añaden páginas, portar `@view-transition` según la arquitectura actual del proyecto y no usar `<ClientRouter />` salvo que los scripts migren a `astro:page-load`.
- **Accesibilidad**: toda animación nueva debe neutralizarse bajo `prefers-reduced-motion: reduce` y el contenido debe seguir visible sin JavaScript.
- **Moderación**: un solo momento protagonista por página; el resto se mantiene sutil.

## Navigation

El header (`Navigation.astro`, `scripts/navigation.ts`, `styles/navigation.css`) sigue el patrón de la implementación actual, conservando la paleta navy y el header transparente sobre el Hero.

- **Estados por clase, no por atributos**: `.is-scrolled` y `.menu-open` en `#site-header`; `.is-open` en `#nav-toggle` y `#mobile-menu`; `.active` + `aria-current="location"` en el enlace de la sección visible.
- **Compactación con `padding-block`** del `<nav>` y animación con los tokens `--motion-*` / `--ease-*`. Nunca usar `transition: all` ni clases `transition-all`.
- **Fondo del header**: el degradado vive en `.site-header::before` y se anima por `opacity` (los degradados no son animables).
- **Menú móvil**: panel colapsable por `max-height` con `visibility: hidden` mientras está cerrado, para que sus enlaces no reciban foco ni se anuncien. No volver a `display: none` / clase `hidden`.
- **Hamburguesa**: tres `<span class="nav-toggle-line">` que se transforman en X; no intercambiar SVGs.
- **Teclado y accesibilidad**: Escape cierra y devuelve el foco al botón; clic fuera y cambio a escritorio (`md`) también cierran; toda transición debe neutralizarse bajo `prefers-reduced-motion`.
- **Items nuevos**: añadirlos al array `navItems`; el escalonado del menú móvil usa `--i` inyectado desde el índice.

## Naming Conventions

| Element    | Convention      | Example                            |
| ---------- | --------------- | ---------------------------------- |
| Components | PascalCase      | `Header.astro`, `Navigation.astro` |
| Pages      | kebab-case      | `index.astro`, `about.astro`       |
| Layouts    | PascalCase      | `Layout.astro`                     |
| Scripts    | camelCase       | `navigation.ts`                    |
| Styles     | kebab-case      | `global.css`, `navigation.css`     |
| Variables  | camelCase       | `userName`, `isLoading`            |
| Constants  | SCREAMING_SNAKE | `MAX_ITEMS`                        |

## CSS Guidelines

- **Tailwind CSS 4** is the primary styling approach
- Global tokens in `src/styles/global.css` via `@import "tailwindcss"`
- Component styles in separate CSS files (e.g., `navigation.css`)
- Use Tailwind utility classes for layout and spacing
- Prefer Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Mobile-first approach

```css
/* global.css - Tokens y estilos base */

@import "tailwindcss";

@theme {
  --color-primary: #274272;

  --color-background: #f5f7fa;

  /* ... */
}

/* navigation.css - Estilos de componentes */

.nav-link {
  color: var(--color-muted);
}
```

## Import Patterns

```typescript

*// Layouts*

import Layout from '../layouts/Layout.astro';

*// Components*

import Header from '../components/Header.astro';

import Navigation from '../components/Navigation.astro';

import Loader from '../components/Loader.astro';

*// Styles (in component frontmatter)*

import '../styles/global.css';

import '../styles/navigation.css';

import '../styles/loader.css';

*// Scripts (in template, after component markup)*

<script src="../scripts/navigation.ts"></script>

<script src="../scripts/loader.ts"></script>

```

## File Organization

```

src/

├── components/      # Reusable Astro components (only markup)

├── layouts/         # Page layouts (Layout.astro)

├── pages/           # Routes (index.astro, etc.)

├── scripts/         # Client-side TypeScript
│   ├── contact/     # Contact form module
│   │   ├── index.ts        # Form logic with DI
│   │   ├── validators.ts   # Pure validation functions
│   │   ├── validators.test.ts
│   │   ├── email-service.ts  # EmailService interface + adapter
│   │   └── email-service.test.ts
│   ├── loader.ts
│   ├── navigation.ts
│   ├── projectsCarousel.ts
│   └── reveal.ts

├── styles/         # CSS files (global.css, navigation.css, loader.css, motion.css)

├── utils/          # TypeScript utilities
│   ├── techIcons.ts            # Shared getTechIcon() for technology icons
│   ├── autoplayPolicy.ts       # Pure shouldAutoplay() policy for the carousel
│   └── autoplayPolicy.test.ts

public/

├── waldo-mark.png      # Site favicon

├── favicon.svg

└── ...             # Static files served as-is

tests/              # Playwright E2E specs (incl. carousel-autoplay.spec.ts)

```

## Type Checking

```bash

npm run astro -- check

```

## Git Workflow

- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`)
- Branch naming: `feature/`, `fix/`, `chore/`
- Never commit `node_modules/`, `.env`, `.astro/` (generated types)

## 🔒 Security & Dependency Workflow

Para evitar vulnerabilidades en producción, sigue este flujo al realizar cambios en dependencias:

1. **npm audit** - Ejecuta `npm audit` antes y después de cualquier cambio de dependencias

2. **Actualizar individualmente** - Actualiza packages uno por uno o en grupos pequeños para identificar qué cambio introdujo un problema

3. **`npm audit fix`** - Ejecuta `npm audit fix` para auto-corregir vulnerabilidades conocidas

4. **`npm audit fix --force`** - Solo si es necesario, para actualizaciones mayores (mayor versión de framework)

5. **Verificar build** - Confirma que `npm run build` pasa exitosamente después de las actualizaciones

6. **Commit y PR** - Haz commit a `dev` y crea PR a `main` con descripción clara de qué vulnerabilities se corrigieron

**Ejemplo reciente: Actualización de Astro `^6.1.4` → `^7.2.10` + 5 transitive dependencies, reduciendo 29 HIGH → 0 vulnerabilidades.**

## Contact Form Architecture (SOLID)

- **validators.ts**: Pure validation functions (no DOM), open for extension (OCP)
- **email-service.ts**: `EmailService` interface + `EmailJsService` adapter + `createEmailService()` factory (ISP, DIP)
- **contact/index.ts**: Uses dependency injection for `EmailService`, imports validators
- Tests: 24 vitest unit tests (20 validators + 4 email-service)

## Carousel Autoplay Policy

- **utils/autoplayPolicy.ts**: `shouldAutoplay(conditions)` is a pure function (no DOM) that decides whether the carousel may advance on its own. It returns `true` only if the carousel is active, has no reduced-motion preference, is not paused by the user, is not hovered, has no keyboard focus, is in the viewport and the tab is visible.
- **scripts/projectsCarousel.ts**: `updateTimer()` gathers the state flags and calls `shouldAutoplay()`; the class keeps only DOM and timer handling.
- **Do not share modules between `<script>` entries without checking the build**: in Astro each `<script src>` is a separate entry, so a util imported by two scripts becomes an extra chunk and stops inlining small scripts. A util used by a single script is bundled with it at no cost.
- Tests: unit tests in `src/utils/autoplayPolicy.test.ts`; E2E in `tests/carousel-autoplay.spec.ts`.

## Graphify Commands

| Command                            | Action                                  |
| ---------------------------------- | --------------------------------------- |
| `uv tool run graphify .`           | Full knowledge graph build              |
| `uv tool run graphify . --update`  | Incremental update (changed files only) |
| `uv tool run graphify query "Q"`   | Query graph for architectural questions |
| `uv tool run graphify explain "N"` | Explain a node and its connections      |

## Available Skills

| Skill                    | Trigger                               | Description                                                                           |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `tailwind-design-system` | Design systems, Tailwind v4, theming  | Build scalable design systems with Tailwind CSS v4, design tokens, component variants |
| `frontend-design`        | Building components, pages, UI design | Create distinctive, production-grade frontend interfaces avoiding generic aesthetics  |
| `graphify`               | Codebase analysis, architecture docs  | Build navigable knowledge graph with community detection, SOLID auditing              |

**When to Load Skills**

- **tailwind-design-system**: Creating component libraries, implementing design tokens/theming
- **frontend-design**: Building web components, pages, landing pages, dashboards
- **graphify**: Analyzing codebase architecture, finding god nodes, SOLID audits, dependency analysis
