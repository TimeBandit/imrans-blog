# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is an Astro v5 personal blog (based on the "Space Ahead" theme) for Imran Nazir, deployed to Netlify via `@astrojs/netlify`. It uses Tailwind CSS v4 (via the Vite plugin), Preact for interactive islands, and Swup for page transitions.

## Commands

Package manager is `pnpm` (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`), though `package-lock.json` is also present.

- `pnpm dev` — start the dev server
- `pnpm build` — build for production (runs `astro build`)
- `pnpm start` — build then serve the production build (`astro build && astro preview`)
- `pnpm preview` — serve an existing production build
- `pnpm astro ...` — run arbitrary Astro CLI commands (e.g. `pnpm astro check`)

There is no test suite and no lint script configured. Prettier is configured (`prettier.config.js`, with `prettier-plugin-tailwindcss`) but there's no `format` script — run via `npx prettier --write .` if needed.

## Architecture

- **Content collections**: Blog posts live in `src/content/blogs/*.md` and are loaded via the `glob` loader defined in `src/content.config.ts`. Frontmatter schema: `title`, `description`, `pubDate`, `author?`, `tags?`, `draft?`, `image? { url, alt? }`.
- **Site configuration**: `src/site.config.ts` is the single source of truth for site-wide content — nav links, hero copy, about/contact text, social links, subscribe form URL, and pagination settings (`postsPerPage`, `recentPostLimit`). Most page content is driven from here rather than hardcoded in page files.
- **Base path handling**: `withBase()` in `src/utils/helpers.ts` prefixes internal URLs with `import.meta.env.BASE_URL`. All internal links (nav, RSS, sitemap) should go through this helper so the site keeps working if deployed under a subpath — see commit history (`Fix base path/logo for Netlify deployment`) for prior bugs caused by skipping it.
- **Pages**: `src/pages/index.astro` (home), `about.astro`, `contact.astro`, `404.astro`, `blog/[...page].astro` (paginated blog list), `blog/[id].astro` (single post), `tags/index.astro` and `tags/[id]/[...page].astro` (paginated tag filtering), plus `rss.xml.ts` and `robots.txt.ts` endpoints.
- **Layout**: `src/layouts/MainLayout.astro` is the shared shell (head/meta/nav/footer/subscribe section) that all pages wrap content in via `pageTitle`/`activePage`/`description`/`showSubscribeForm` props.
- **Helpers** (`src/utils/helpers.ts`): `sortItemsByDateDesc`, `createSlugFromTitle` (used to derive tag IDs/slugs), `getAllTags`, `getPostsByTag`, `withBase`.
- **Deployment**: `astro.config.mjs` uses the Netlify adapter (`@astrojs/netlify`). Note `.github/workflows/deploy.yml` still deploys to GitHub Pages — this workflow appears stale relative to the current Netlify-based deployment; confirm with the user before relying on it.

## Repo state notes

- `src-old/` at the repo root is a duplicate of an earlier version of `src/` (pre-refactor: includes components like `Hamburger.astro`, `ThemeSwitcher.astro`, `SiteIdentity.astro` that no longer exist in `src/`). It is untracked (`??` in git status) and not referenced by the build — treat it as leftover/reference material, not part of the active app, and don't edit files there expecting them to take effect.
- There is currently a large uncommitted diff converting the repo from the original "Space Ahead" template structure (components like `ThemeSwitcher`, `Hamburger`, `NavLinks`, `SiteIdentity`, `IconButton`, `SpaceKeyboard` removed) to a simplified structure. Check `git status`/`git diff` before assuming the current working tree matches `main`.
