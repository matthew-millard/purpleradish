# purpleradish

Conversational ordering for restaurants. Customers order in plain language over
web chat or WhatsApp; orders land in the POS the restaurant already runs.

Currently: landing page + waitlist. Next: Square menu sync, then the agent loop.

## Stack

React Router (framework mode) · TypeScript · Drizzle + Postgres (Neon) ·
Base UI · CSS Modules on `app/styles/tokens.css` · Vitest + PGlite ·
GitHub Actions · Fly.io

Read `CLAUDE.md` before writing code — it encodes the stack decisions,
architecture boundaries, and the design system rules. The design system itself
lives in `docs/STYLE_GUIDE.md` and `app/styles/tokens.css`.

## Getting started

```sh
cp .env.example .env   # point DATABASE_URL at a Postgres (Neon free tier)
npm install
npm run db:generate    # generate SQL migrations from app/db/schema.ts
npm run db:migrate     # apply them
npm run dev
```

## Commands

- `npm run dev` — dev server
- `npm test` — Vitest (unit + PGlite integration)
- `npm run lint` — Biome
- `npm run typecheck` — route typegen + tsc
- `npm run db:generate` / `db:migrate` / `db:studio` — Drizzle
- `fly deploy` — production (migrations run via release_command)

## Deploying

One-time: `fly launch --no-deploy` to create the app, `fly secrets set
DATABASE_URL=...`, and add `FLY_API_TOKEN` to GitHub repo secrets. After that,
every push to `main` deploys via `.github/workflows/ci.yml`.
