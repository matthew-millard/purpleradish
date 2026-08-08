# PRD — Restaurant Sign-up & Accounts (Project 1)

Status: Draft
Owner: Matt Millard
Last updated: 2026-08-08

## Summary

Give restaurant operators a native purpleradish account: sign up with email and
password, log in, and land in a dashboard. This replaces the current email-only
waitlist. It deliberately stops short of connecting a POS, that is Project 2.

## Problem

Today the only thing a restaurant can do is leave an email on a waitlist
(`waitlist_signups`). There is no account, no login, no place to land. Before we
can connect a POS, bill anyone, or let staff manage service, operators need a
durable identity that belongs to purpleradish, not to any external system.

## Goals

- Operators can create an account with email + password.
- Operators can log in, stay logged in, and log out.
- After sign-up they land in a dashboard that clearly says the restaurant is
  not yet live and the next step is connecting a POS.
- The account identity is native and durable: it survives, unchanged, when a POS
  is later connected, disconnected, or swapped.
- The waitlist is retired.

## Non-goals (explicitly out of scope)

- Adding restaurants / locations (Project 2).
- Any POS connection, Square OAuth, or menu sync (Project 3).
- Inviting additional staff / multi-user UI (data model supports it, UI does not).
- Billing, plans, or payment.
- Password reset. Deferred to a separate follow-up project.
- Diner / customer accounts. This flow is operators only.

## Users

Restaurant operators (owners). Often non-technical, sometimes on a shared
back-office machine, frequently mid-service. Login must be fast and self-contained
(a known password beats a magic link that depends on inbox access at that moment).

## Key decisions (already made)

- **Three-level hierarchy, built across three projects: Organization -> Restaurant
  -> POS connection.** Project 1 (this doc) creates only the organization + owner.
  Project 2 adds restaurants/locations under an org. Project 3 connects a restaurant
  to a POS. A business can own multiple restaurants, each with its own swappable POS.
- **Native identity, POS is detachable.** Identity (org, and later restaurants +
  history) is independent of any POS, enabling future billing (at the org level) and
  POS portability (e.g. one location Toast, another Square, later swap all to Square).
- **Model for multi-user, ship single-owner.** Schema has `users`, `organizations`,
  and `memberships` (user + organization + role) from day one; v1 creates exactly one
  owner membership and ships no invite UI.
- **`business_name` is authored by us on the organization.** Per-restaurant display
  name is mirrored from that restaurant's POS in Project 3, not authored anywhere.
- **Email + password**, not magic link. Reason: login reliability and speed for a
  non-technical, shared-device, mid-service operator; independence from email
  deliverability at login time.
- **RR7 cookie sessions** for auth state now. A DB-backed `sessions` table (for
  "log out of all devices") is a deliberate later project; helpers are designed so
  adding it does not change call sites.
- **Replace the waitlist.**

## User flow

1. Operator lands on sign-up.
2. Enters business name, email, and password.
3. We create: user (hashed credential), organization, and an owner membership
   linking them. No restaurant (that is Project 2).
4. Operator lands in the dashboard. Empty state points to "add your first
   restaurant", which is a stub until Project 2.
5. Return visits: log in with email + password, land in the same dashboard.

## Requirements

### Sign-up

- Business name + email + password form.
- Email validated (reuse existing Zod approach in `app/domain/`).
- Password minimum strength enforced (define in tech design).
- Duplicate email rejected with a clear message.
- On success: user + organization + owner membership created atomically, session
  started, redirect to dashboard.

### Login / session / logout

- Log in with email + password; invalid credentials give a single generic error
  (no account enumeration).
- Session persists across browser restarts (cookie session).
- Logout clears the session.

### Dashboard (post-auth landing)

- Authenticated-only route.
- Project 1 renders only a placeholder heading ("Dashboard"). No real dashboard UI,
  empty state, or verification banner is built here; those come with later projects.

### Waitlist retirement

- Remove the waitlist route and its entry point.
- Drop `waitlist_signups` outright (no data migration or export).

## Success criteria

- An operator can go from landing to a logged-in dashboard in one sitting.
- Sessions survive a browser restart; logout ends them.
- No account enumeration on login or sign-up.
- Adding invites later requires no destructive migration (schema already relational).

## Decisions

- Password reset: out of scope, handled in a separate follow-up project.
- Existing `waitlist_signups` rows: dropped outright, no migration or export.
- Email verification: async, non-blocking. On sign-up the operator lands in the
  dashboard immediately; a verification email is sent and a banner prompts them to
  confirm. Sign-up is never blocked on verification. Gating the "go live" / connect
  a POS step on a verified email is Project 2's responsibility, not this project's.
- Bot prevention: rate limiting (sign-ups per IP, resends per address) and a
  honeypot field are in scope for this project. Verification is not a bot defense.

## Design system

All screens follow `docs/STYLE_GUIDE.md` and `app/styles/tokens.css` (quiet tier,
leaf-cut radius, type voices, copy register with no em dashes). Run the checklist
before shipping each screen.
