# One10 — Film & Photo Print E‑commerce (SvelteKit)

One10 is a SvelteKit e‑commerce app for film development and photo printing. Customers browse services/products, upload images, add items to a cart, and checkout using the PayMaya integration.  

## Key features
- Storefront: product listing, product detail pages.
- Film development flow: configure process, push, scanning, and add to cart.
- Photo printing flow: client-side image upload (temp), per-image options, and add-to-cart.
- Shopping cart & checkout with PayMaya payment flow and webhook callbacks.
- Order tracking page.
- Staff dashboard: orders, products, messages.
- Validation: Zod schemas shared client/server for consistent validation.
- Tests: unit and server tests (Vitest), some integration/webhook tests and Playwright E2E (if present).

## Repository layout (high level)
- src/
  - routes/ — SvelteKit routes (public and staff areas)
    - (public)/store — /store, /store/printing, /store/[film=films], /store/[id]
    - (public)/checkout — checkout UI, server actions, PayMaya callbacks
    - (staff) — admin pages (dashboard, orders, products, messages)
  - lib/
    - services/ — client firebase helpers, product services
    - server/ — firebase-admin helpers, verifyCart and image attach helpers
    - stores/ — Svelte stores (auth, cart, products)
    - components/ — shared components
    - references/ — static price tables (filmDevPrices.json)
  - params/ — route params helpers
  - server-side tests, utils and support files

# High-level architecture
- Presentation: Svelte pages & components (client).
- State: Svelte stores for cart/auth/products.
- Application: client services (read/write Firestore & Storage) + server endpoints (SvelteKit +server handlers).
- Domain: Zod schemas, TypeScript types.
- Infrastructure: Firebase (client SDK in browser; admin SDK on server), PayMaya for payments.

# Quickstart — local development

1. Requirements
- Node.js 18+ (or the project supported version)
- npm or pnpm
- Firebase project + credentials
- PayMaya (Maya) test credentials

2. Install
```bash
# from repo root
npm ci
# or
pnpm install
```

3. Environment variables Create a .env (or .env.local) with required variables. Typical variables used by this codebase:
```.env
Client Firebase (used by client SDK)

VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
Server / Admin Firebase (used by admin SDK)

GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON) OR
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY (escaped newline chars as \n)
PayMaya / Payment

MAYA_API_KEY (or MAYA_PUBLIC_KEY)
MAYA_SECRET_KEY
MAYA_WEBHOOK_SECRET
MAYA_ENV (test/production) — used by api/maya server endpoint
Other

NODE_ENV=development
```
Note: Adjust variable names to match the project's config if different.

Run (dev)
```
npm run dev
```
- Default SvelteKit dev port: 5173 (or configured in vite.config). Visit http://localhost:5173.
Build & preview
```
npm run build
```
Tests
- Unit/server tests (Vitest):
```
npm run test
```
