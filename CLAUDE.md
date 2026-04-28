# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server on port 4000
npm run build    # Production build
npm start        # Production server on port 4000
npm run lint     # ESLint

docker-compose up   # Deploy app (connects to host MongoDB on port 27017)
```

## Architecture

**homeauto** is a Next.js 15 home automation dashboard ("The Kai Kassie House") with three active features:
- **Weather** — fetches from weather.gov API on the client, location config in `locations.json`
- **Quick Links** — static grid of self-hosted service links, configured in `components/Service.tsx`
- **Pokemon GO events** (LeekDuck) — stored in MongoDB (`leekduck`), read-only display

**Stack:** Next.js 15 + TypeScript, React 18, Redux Toolkit, MongoDB/Mongoose, TailwindCSS, Framer Motion, NextUI

> **Deprecated (do not modify):** Masters swim times pages and components (`components/Swim.tsx`, `SwimTable.tsx`, `Chart.tsx`, `AddTimeForm.tsx`, `Modal.tsx`, `/pages/masters`, `styles/Swim.module.css`, `styles/TimeForm.module.css`). The API routes under `/pages/api/times/` also remain but are unused by the active UI.

### Key directories
- `/pages/api/` — serverless API routes (REST, no middleware layer)
- `/components/` — React components, each feature is self-contained
- `/models/` — Mongoose schemas (`timeModel.tsx`, `duckModel.tsx`)
- `/utils/animations.ts` — shared Framer Motion variants (`fadeUp`, `scaleIn`, `staggerContainer`)
- `/utils/connectMongo.tsx` — two separate MongoDB connection helpers (swimdb, leekduck)

### Styling system
The project uses a CSS variable–based design token system (dark mode by default):
- **Design tokens** are defined as HSL values in `styles/globals.css` under `:root` and `.dark`
- **Tailwind** reads them via `tailwind.config.ts` — use token-based classes (`bg-card`, `text-foreground-muted`, `border-border`, `shadow-card`, etc.)
- **Dark mode** is activated unconditionally via an inline script in `pages/_document.tsx` — there is no toggle
- **Bootstrap is removed** — do not add Bootstrap classes or imports
- **CSS modules** (`styles/*.module.css`) should use `hsl(var(--token))` references, not hardcoded color literals
- **Inter font** is loaded via `next/font/google` in `pages/_app.tsx` and applied as `font-sans`

### Animations
Framer Motion variants live in `utils/animations.ts`:
- `staggerContainer` — parent wrapper for staggered children
- `fadeUp` — entrance animation with stagger delay (pass `custom={index}`)
- `scaleIn` — scale + fade entrance for cards

**Important:** Do not mix a direct `animate={{ ... }}` object with `variants`/`whileInView` on the same element — Framer Motion won't propagate variant names to children when `animate` is an object. Use `animate="visible"` (string) for variant orchestration, or give children their own explicit `initial`/`animate` props.

### MongoDB
Two databases, both on `localhost:27017`, no auth in local dev. Docker Compose expects `MONGO_URI` env var. `network_mode: host` in docker-compose so the container uses the host's MongoDB.

### Mongoose model registration
Models use the `models[name] || model()` pattern to avoid re-registration on hot reload.

### Environment
`MONGO_URI` is set directly in `next.config.js` for local dev. The standalone Next.js output is used in Docker.

### Deployment
GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to master, runs `./deploy.sh HomeAuto` on a self-hosted runner. Health checks hit `/api/health/get`.

### ESLint
React hooks rules are disabled in the ESLint config — don't rely on the linter to catch hook violations.
