# Agent Guidelines for Waldo Fernandez Portfolio

## Project Overview

- **Framework**: Astro 6 (latest)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/vite` plugin
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)
- **Node**: >= 22.12.0
- **Package Manager**: npm (implied)

## Build Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro <cmd>` | Run Astro CLI commands |
| `npx astro check` | Run TypeScript type checking |

**Note**: No test framework is configured. Do not add tests unless explicitly requested.

## Color Palette (Navy Theme)

| Token | Hex | Semantic Use |
|-------|-----|--------------|
| `navy-deep` | `#0D1433` | Foreground (texto principal) |
| `navy-royal` | `#171F55` | Muted (texto secundario) |
| `navy-mid` | `#274272` | Primary (elementos interactivos) |
| `navy-light` | `#6C90C3` | Accent/Border |

```css
/* Semantic tokens disponibles */
--color-primary: #274272;
--color-primary-hover: #171F55;
--color-secondary: #6C90C3;
--color-accent: #6C90C3;
--color-background: #F5F7FA;
--color-foreground: #0D1433;
--color-muted: #171F55;
--color-border: #6C90C3;
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
- **Page transitions**: no se usan (sitio de una sola página con anclas). Si se añaden páginas, portar `@view-transition` desde la demo y no usar `<ClientRouter />` salvo que los scripts migren a `astro:page-load`.
- **Accesibilidad**: toda animación nueva debe neutralizarse bajo `prefers-reduced-motion: reduce` y el contenido debe seguir visible sin JavaScript.
- **Moderación**: un solo momento protagonista por página; el resto se mantiene sutil.


## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `Header.astro`, `Navigation.astro` |
| Pages | kebab-case | `index.astro`, `about.astro` |
| Layouts | PascalCase | `Layout.astro` |
| Scripts | camelCase | `navigation.ts` |
| Styles | kebab-case | `global.css`, `navigation.css` |
| Variables | camelCase | `userName`, `isLoading` |
| Constants | SCREAMING_SNAKE | `MAX_ITEMS` |

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
  --color-background: #F5F7FA;
  /* ... */
}

/* navigation.css - Estilos de componentes */
.nav-link {
  color: var(--color-muted);
}
```

## Import Patterns

```typescript
// Layouts
import Layout from '../layouts/Layout.astro';

// Components
import Header from '../components/Header.astro';
import Navigation from '../components/Navigation.astro';
import Loader from '../components/Loader.astro';

// Styles (in component frontmatter)
import '../styles/global.css';
import '../styles/navigation.css';
import '../styles/loader.css';

// Scripts (in template, after component markup)
<script src="../scripts/navigation.ts"></script>
<script src="../scripts/loader.ts"></script>
```

## File Organization

```
src/
├── components/      # Reusable Astro components (only markup)
├── layouts/         # Page layouts (Layout.astro)
├── pages/           # Routes (index.astro, etc.)
├── scripts/         # Client-side TypeScript (loader.ts, navigation.ts, reveal.ts)
├── styles/         # CSS files (global.css, navigation.css, loader.css, motion.css)
└── utils/          # TypeScript utilities (if needed)
public/
├── letra-w.png      # Site favicon
├── favicon.svg
└── ...             # Static files served as-is
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
3. **`npm audit fix`** - Ejecuta `npm audit fix` para auto-corregir vulnerabilibles conocidas
4. **`npm audit fix --force`** - Solo si es necesario, para actualizaciones mayores (mayor versión de framework)
5. **Verificar build** - Confirma que `npm run build` pasa exitosamente después de las actualizaciones
6. **Commit y PR** - Haz commit a `dev` y crea PR a `main` con descripción clara de qué vulnerabilities se corrigieron

*Ejemplo reciente: Actualización de Astro `^6.1.4` → `^7.2.10` + 5 transitive dependencies, reduciendo 29 HIGH → 0 vulnerabilidades.*

## Available Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| `tailwind-design-system` | Design systems, Tailwind v4, theming | Build scalable design systems with Tailwind CSS v4, design tokens, component variants |
| `frontend-design` | Building components, pages, UI design | Create distinctive, production-grade frontend interfaces avoiding generic aesthetics |

### When to Load Skills

- **tailwind-design-system**: Creating component libraries, implementing design tokens/theming
- **frontend-design**: Building web components, pages, landing pages, dashboards
