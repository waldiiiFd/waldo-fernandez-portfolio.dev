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
├── scripts/         # Client-side TypeScript (loader.ts, navigation.ts)
├── styles/         # CSS files (global.css, navigation.css, loader.css)
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

## Available Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| `tailwind-design-system` | Design systems, Tailwind v4, theming | Build scalable design systems with Tailwind CSS v4, design tokens, component variants |
| `frontend-design` | Building components, pages, UI design | Create distinctive, production-grade frontend interfaces avoiding generic aesthetics |

### When to Load Skills

- **tailwind-design-system**: Creating component libraries, implementing design tokens/theming
- **frontend-design**: Building web components, pages, landing pages, dashboards
