# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # next dev
npm run build        # next build
npm run type-check   # tsc --noEmit
npm run format       # prettier --write "src/**/*.{ts,tsx,css,json}"
```

There is no test runner and no lint script; `type-check` and `build` are the verification steps.

## Stack

Next.js 15 (App Router, React 19, React Compiler enabled via `experimental.reactCompiler`), Tailwind CSS v4, Redux Toolkit (auth only), TanStack Query, axios, react-hook-form + zod, socket.io-client. Path alias `@/*` → `src/*`.

Env vars (optional, with defaults in `src/utils/constants.ts`): `NEXT_PUBLIC_API_URL` (defaults to the dev API), `NEXT_PUBLIC_SOCKET_URL`.

## Architecture

**Feature-sliced layout.** Domain code lives in `src/features/<domain>/` (auth, dashboard, lookups, notifications, products, referrals, reports, settings, token-packs, users), each typically with `api/`, `components/`, `types/`, and an `index.ts` barrel. Routes in `src/app/` are thin and render feature components. In a feature's `api/` folder, `*.api.ts` holds raw axios calls, `*.queries.ts` the TanStack Query hooks, and `*.mutations.ts` the mutation hooks (see `features/products`).

**Route groups:** `(auth)` (login, forgot/reset password, verify-otp) and `(dashboard)` (layout with fixed `Sidebar` + `Header`; all pages under `/dashboard/*`).

**Auth flow spans several files:**
- Token is stored in both `localStorage` (read by the axios request interceptor and `lib/socket.ts`) and a cookie (read server-side by the route guard). Key names are in `STORAGE_KEYS`.
- `src/proxy.ts` is the route guard (redirects based on the cookie using `config/routes.ts`); `src/middleware.ts` only re-exports it, so edit `proxy.ts`. When adding protected/auth routes, update `config/routes.ts`.
- `lib/axios.ts` response interceptor: on 401 it clears token/cookie and redirects to `/login`; on 5xx/network errors it dispatches an `app:server-error` window event (handled by `components/common/server-error-dialog.tsx`). Errors are normalized to `new Error(message)` from `response.data.message`.
- `providers/auth-rehydrator.tsx` restores the Redux `auth` slice (`store/slices/auth.slice.ts`) from storage on load.

**Providers** (`src/providers/index.tsx`) nest: progress bar → Redux → React Query → AuthRehydrator → Socket. `lib/socket.ts` is a lazy singleton (`autoConnect: false`) that sends the bearer token at creation time; event names are in `lib/socket-events.ts`.

**URL state:** `hooks/use-url-state.ts` syncs filter/pagination values to search params (`router.replace`); use it for table filters rather than local state.

`src/components/ui` is currently empty (`components.json` is present for shadcn); shared app components are in `src/components/common`.
