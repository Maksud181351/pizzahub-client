# PizzaHub (Client)

**PizzaHub is a pizza ordering & delivery platform.** Customers discover local pizza shops, browse menus and place orders. Restaurants (vendors) publish menu items and manage incoming orders, and can upgrade to Premium. Admins review menu items, manage users and monitor transactions.

- **Live site:** `<ADD LIVE URL>`
- **Client repo:** `<ADD CLIENT REPO URL>`
- **Server repo:** `<ADD SERVER REPO URL>`
- **Admin login for reviewers:** `<ADD ADMIN EMAIL>` / `<ADD ADMIN PASSWORD>`
- **Stripe test card:** `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP

## Important features

- Role based app (Customer, Vendor, Admin) with Better Auth: email/password + Google
- Role selection at sign-up, admin can never be created from the public form (seeded with a script)
- Home: animated hero, featured items (approved + active only, Premium vendors first), categories, "Why choose PizzaHub", "How it works"
- Browse Menu: search, category/location filters, price range, price sorting, pagination, loading/empty/error states
- Item details with image gallery, order form (date, address, note), invalid-ID handling
- Vendor dashboard: stats + charts, add/edit/pause/delete items (ImgBB uploads), orders accept/reject, subscription with Stripe Checkout
- Customer dashboard: stats + chart, orders list, details with status timeline, cancel pending orders
- Admin dashboard: stats + charts, user management (search, role filter, block/unblock), menu moderation (approve/reject/status/delete), read-only transactions
- Premium is activated **only by a verified Stripe webhook** (server repo)
- Dark / light mode, order status timeline (optional features)
- Server-side route protection: `proxy.js` (cookie gate) + role check in every dashboard layout; reload-safe

## Tech stack (npm packages)

`next`, `react`, `react-dom`, `better-auth` (+ MongoDB adapter, JWT plugin), `mongodb`, `tailwindcss` + `@tailwindcss/postcss`, `framer-motion`, `recharts`, `sonner`, `lucide-react`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `dotenv` (seed script).
UI primitives in `components/ui` follow the shadcn/ui pattern (Radix + CVA + Tailwind).

## Installation & run locally

```bash
git clone <client repo>
cd pizzahub-client
npm install
cp .env.example .env.local     # then fill in the values
npm run seed:admin             # creates/promotes the admin user (needs ADMIN_EMAIL / ADMIN_PASSWORD)
npm run dev                    # http://localhost:3000
```
The API (server repo) must be running on `NEXT_PUBLIC_API_URL`. Both apps must point at the **same MongoDB database**.

## Environment variables

| Name | Purpose |
|------|---------|
| `BETTER_AUTH_SECRET` | Signs Better Auth cookies/tokens (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Public URL of this Next.js app (also the JWT issuer/audience) |
| `NEXT_PUBLIC_APP_URL` | Same public URL (trusted origin) |
| `MONGODB_URI`, `MONGODB_DB` | MongoDB connection (Better Auth + seed script) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth. Redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `IMGBB_API_KEY` | Used only by the server route `/api/upload` (never sent to the browser) |
| `NEXT_PUBLIC_API_URL` | URL of the Express API |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Only for `npm run seed:admin` |

`.env*` files are git-ignored. Never commit real secrets.

## Challenge requirements: how they were built

### 1. Advanced search and sorting
`GET /api/menu` (server) accepts:

| Param | Meaning |
|-------|---------|
| `search` | Multi-word. Every word must match item name, description, category, location, or restaurant name (case-insensitive, regex-escaped) |
| `category`, `location` | Exact category / partial location |
| `minPrice`, `maxPrice` | Price range |
| `sort` | `price_asc`, `price_desc`, `newest` (default: Premium vendors first, then newest) |
| `page`, `limit` | Pagination (limit max 24) |

The Browse Menu page keeps all filters in the URL (`/menu?search=pep&sort=price_asc`), so results can be shared and survive reloads. Text and price inputs are debounced.

### 2. JWT / token verification
1. User signs in with Better Auth (session cookie on the Next.js app).
2. Client calls `GET /api/auth/token` (Better Auth **jwt** plugin) and receives a 15-minute JWT; `lib/api.js` caches it and sends `Authorization: Bearer <jwt>` to Express. On a 401 it fetches a fresh token once and retries.
3. Express `verifyJWT` verifies signature (remote JWKS at `<BETTER_AUTH_URL>/api/auth/jwks`), expiry, issuer and audience, then **loads the user from MongoDB**. Role and `isBlocked` always come from the database, never from the client. Invalid/expired tokens get **401**, blocked users and wrong roles get **403**.
4. `requireRole(...)` guards each router; ownership is re-checked before every update/delete.

### 3. Professional appearance
Warm tomato/oven/cream palette, Bricolage Grotesque + DM Sans, one heading scale, equal-height cards, consistent buttons, responsive dashboards, dark mode, reduced-motion support.

## Suggested commit plan (20+ meaningful commits)
1. Initialise Next.js app and Tailwind theme tokens
2. Add UI primitives (button, input, card, badge, dialog, table)
3. Configure Better Auth with MongoDB, roles and password policy
4. Add sign-in / sign-up pages with Google and role selection
5. Add route protection proxy and server-side role guards
6. Build navbar with profile dropdown and theme toggle
7. Build footer with contact and social links
8. Build home hero with animated pizza illustration
9. Add featured items and categories sections
10. Add "Why choose" and "How it works" sections
11. Create API helper that attaches the JWT
12. Build Browse Menu with search, filters and sorting
13. Build item details page with image gallery
14. Add order dialog and validation
15. Add dashboard shell with role based sidebar
16. Add vendor overview, items list and add/edit form
17. Add ImgBB upload route and image uploader
18. Add vendor orders management
19. Add subscription page and Stripe Checkout redirect
20. Add payment success (webhook polling) and cancel pages
21. Add customer overview and orders with timeline
22. Add admin overview, users, items and transactions
23. Add profile settings, 404 and error pages
24. Write README

## Deploying (Vercel)
Set all env vars above in the project settings, set `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL` to the production URL, add the production redirect URI in Google Cloud Console and allow Vercel's IPs (or `0.0.0.0/0`) in MongoDB Atlas.
