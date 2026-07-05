# CLAUDE.md — purpleradish

Conversational ordering layer for restaurants. POS-agnostic: customers order via web chat or WhatsApp, an agent loop (Claude API + tools) builds the order, and adapters push it into the restaurant's existing POS (Square first).

## Stack (decided — do not substitute without asking)

- **Framework:** React Router 7, framework mode. Loaders for reads, actions for mutations. Deployed as one long-lived Node server.
- **Language:** TypeScript everywhere. No Ruby in this repo.
- **Database:** Postgres (Neon). **Drizzle ORM** + drizzle-kit migrations. Schema lives in `app/db/schema.ts`; migrations are plain SQL, reviewable.
- **Styling:** `app/styles/tokens.css` (the design system source of truth) + CSS Modules. **No Tailwind. No styled-components. No inline style objects for anything reusable.**
- **Components:** Base UI (`@base-ui/react`) primitives for anything with behavior (dialog, select, combobox, menu, toast, tooltip). Simple components (button, badge, card, input) are hand-rolled on tokens.
- **Errors at boundaries:** `neverthrow` `Result<T, E>` for adapter and service returns. Never swallow an exception; log with `[Adapter#method]` context and return `err(...)`.
- **Background work / webhooks:** Inngest (Twilio + Square webhooks land in Inngest functions; retries and delays live there, not in hand-rolled code).
- **Realtime:** SSE from a React Router resource route for the live orders board. No WebSockets unless SSE demonstrably fails.
- **AI:** Claude API with tool use. Tools mirror the heard-chef MCP surface: `get_menu`, `place_order`, `track_order`.
- **Hosting:** Fly.io, single app, Dockerfile.

## Architecture boundaries

- `app/adapters/` — POS adapters. Each implements the `PosAdapter` interface (`syncMenu`, `pushOrder`). **Adapters are dumb:** fetch, map to domain types, return Result. No POS-specific types may leak above this layer. The interface is the product boundary.
- `app/domain/` — domain types (`MenuItem`, `Order`, `OrderItem`, `PosOrderRef`) and pure logic. No IO.
- `app/agent/` — the Claude tool loop: tool definitions, system prompt, conversation state. Tools call domain/services, never adapters directly.
- `app/routes/` — RR7 routes. Loaders/actions are thin; real logic lives in domain/services.

## Design system (non-negotiable rules)

Source of truth: `app/styles/tokens.css` and `STYLE_GUIDE.md` (in `/docs`). The short version agents must never violate:

1. **Grammar:** magenta means _act_; green means _alive or done_. Color with no meaning gets cut.
2. **Quiet tier (default for app UI):** max ONE filled magenta element and ONE filled green element per screen. Other signals are 6px dots, outlines, or colored text. In-progress states are plain gray text — no pill.
3. **`#4DE659` (electric green) appears on dark surfaces only.** Never on light.
4. **Radius:** the leaf cut. `var(--pr-radius-sm/md/lg)` — three rounded corners, sharp corner ALWAYS bottom-left. Radios, avatars, dots, toggle thumbs stay circles. Tabs use underline, no radius.
5. **Type voices:** Bricolage Grotesque 600/700 at ≥21px (headings, names). Schibsted Grotesk 400/500 below 21px (all UI copy). Spline Sans Mono for anything measured — prices, times, counts, IDs (`.pr-data`, tabular-nums). If it changes when reality changes, it's mono.
6. **Scale:** 42/30/21/14/12 only. No 16, 18, or 24px text.
7. **Emphasis in running text:** never bold — Schibsted italic in magenta 600 (`.pr-em`). Bold is for headings and totals only.
8. **Labels:** lowercase, 12px, +2.5px letterspacing (`.pr-label`).
9. Navigation active state is neutral lavender, never green.

Before shipping any screen, run the checklist at the end of `docs/STYLE_GUIDE.md`.

## Conventions

- Conventional Commits for commit messages.
- Migrations: never edit an applied migration; add a new one.
- Env vars documented in `.env.example` the moment they're introduced.

## Testing

- **Vitest** for unit + integration. **React Testing Library** for components with logic. **Playwright** for a handful of E2E flows only.
- **PGlite** for DB integration tests: fresh in-process Postgres per test file, real Drizzle schema, no Docker. Never mock Drizzle.
- **MSW** for Square/Twilio HTTP mocking. Adapter tests must cover failure shapes (401, empty page, missing price) and assert `err(...)` is returned — never a swallowed exception.
- **Tools are tested deterministically:** hand-written tool-call fixtures against `place_order`/`get_menu`/`track_order`, no live Claude API in the test suite. Price snapshotting and invalid-item rejection are the highest-value cases.
- **Model behavior lives in `evals/`, not tests:** real API (Haiku), run manually/nightly, scored on tool-call validity. NO LLM calls in CI — a flaky suite is a dead suite.
- E2E: (1) web chat → confirmed order → visible on dashboard, with the Anthropic call mocked to canned tool-use; (2) SSE board updates when an order row changes.

## CI (GitHub Actions)

- Single workflow `.github/workflows/ci.yml`: `checks` (typecheck, lint, Vitest, build) -> `e2e` (Playwright, chromium only) -> `deploy` (Fly, main pushes only).
- No Postgres service container (PGlite) and no LLM secrets in CI (evals are out-of-band) — keep it that way.
- Migrations run via Fly's `release_command`, never inside the workflow.
- Target: full pipeline under ~5 minutes. If it creeps past that, cut E2E scope before anything else.

## Commands

- `npm run dev` — RR7 dev server
- `npm run db:generate` / `npm run db:migrate` — drizzle-kit
- `npm run db:studio` — Drizzle Studio
- `fly deploy` — production deploy
