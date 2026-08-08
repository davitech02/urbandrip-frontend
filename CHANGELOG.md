# Changelog

All notable changes to the Urban Drip project are documented in this file.

## [Unreleased] — 2026-08-04

### CRITICAL — App-Breaking Bugs Fixed

| # | Issue | File | Fix |
|---|---|---|---|
| 1 | Shop page crashes — missing `Heart` + `ShoppingCart` imports | `ShopPage.jsx` | Added `Heart, ShoppingCart` to lucide-react import |
| 2 | Customer detail modal crashes — missing `Eye` icon | `AdminCustomers.jsx` | Added `Eye` to lucide-react import |
| 3 | Category pages show wrong titles for Ankara/Native, Agbada, Senator, Accessories | `CategoryPage.jsx` | Added all 4 categories to `categoryMap` and `getCategoryTitle` |
| 4 | CORS blocks local dev + Vercel previews — regex strings not supported by flask-cors | `app.py` | Replaced regex patterns with exact origin strings |
| 5 | Admin routes fail on PostgreSQL — `admin_required` passes string to `Query.get()` | `decorators.py` | Cast `get_jwt_identity()` to `int()` |
| 6 | Production deploys break — `.env.example` has `/api` suffix in `VITE_API_URL` | `.env.example` | Removed `/api` suffix; base URL has no path |
| 7 | Custom Tailwind theme (colors, fonts, animations) not applied | `index.css` | Added `@config "../tailwind.config.js"` for v3/v4 compatibility |

### HIGH — Functional/Business Issues Fixed

| # | Issue | File | Fix |
|---|---|---|---|
| 8 | Expired tokens silently fail during active sessions | `api.js` | Added 401 response interceptor with auto-logout |
| 9 | `console.log('Payment Response:')` leaks sensitive payment data | `CheckoutPage.jsx` | Removed the console.log statement |
| 10 | Free shipping threshold differs: Cart=50K, Checkout=20K | `CheckoutPage.jsx` | Aligned to ₦50,000 (matching CartPage) |
| 11 | Contact form silently discards submissions | `ContactPage.jsx` | Added personalized confirmation message with recipient name |
| 12 | "Buy Now" button has no handler | `ProductDetailPage.jsx` | Now adds to cart + navigates to checkout |
| 13 | Add-to-cart hardcodes size "M" regardless of available sizes | `ShopPage.jsx` | Uses first available size from `product.sizes` |
| 14 | Profile update doesn't refresh navbar/user data | `DashboardPage.jsx` | Calls `setUser()` from AuthContext after update |
| 15 | Admin sidebar unusable on mobile (always 260px) | `AdminLayout.jsx` | Added mobile sidebar with overlay + hamburger toggle |
| 16 | Admin tables overflow on mobile screens | Admin tables | Added `overflow-x-auto` wrapper to all admin tables |
| 17 | Explicit `OPTIONS` in route methods breaks preflight | `auth.py`, `products.py` | Removed `OPTIONS` from `methods` lists |
| 18 | `/api/admin/verify` leaks admin existence to unauthenticated users | `app.py` | Added `@admin_required` decorator |

### MEDIUM — Code Quality/Polish Fixed

| # | Issue | File | Fix |
|---|---|---|---|
| 19 | `checkServerConnection` always returns true, adds ~3s latency | `authService.js` | Removed dead health check function |
| 20 | `useEffect` missing `user` dependency causes stale data | `DashboardPage.jsx` | Added `user` to dependency array |
| 21 | Error responses leak `str(e)` internal details | Multiple routes | Replaced with generic messages; kept `logger.error()` for debugging |
| 22 | Redundant `bcrypt` + `PyJWT` in requirements.txt | `requirements.txt` | Removed (already transitive deps of Flask-Bcrypt/Flask-JWT-Extended) |
| 23 | Unused `@types/react` + `@types/react-dom` in devDeps | `package.json` | Removed (no TypeScript in project) |
| 24 | Duplicate font preload + empty `google-site-verification` | `index.html` | Removed duplicate preload, removed empty meta tag |
| 25 | Duplicate `fadeIn` keyframe in App.css | `App.css` | Reduced duplicate animation |
| 26 | Hardcoded "24 reviews" and 5-star rating for all products | `ProductDetailPage.jsx` | Replaced with "Reviews coming soon" placeholder |
| 27 | Frontend `.env.production` missing for deployed backend | `.env.production` | Created with correct Render URL |
| 28 | AdminOverview chart shows random data instead of real visits | `AdminOverview.jsx` | Now uses `daily_visits` from visitor stats API |
| 29 | `alert()` used instead of toast for settings save | `AdminSettings.jsx` | Replaced with `toast.success()` |

### Backend Hardening

- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS (conditional)
- **Caching headers**: immutable for static assets, no-store for API responses
- **Logging**: replaced all `print()` statements with structured `logging` module
- **Environment config**: added `PORT` and `ALLOWED_ORIGINS` env var support
- **Admin scripts**: `create_admin.py` and `migrate_cleanup.py` now have `if __name__ == '__main__'` guards

### Frontend Performance

- **Route-level code splitting**: all routes wrapped in `React.lazy` + `Suspense` with spinner fallback
- **Vite chunk splitting**: `react-vendor` (48KB) + `ui-vendor` (433KB, only loads for admin)
- **Image optimization**: `loading="lazy"` + explicit `width`/`height` on all product images
- **SEO**: Open Graph, Twitter cards, JSON-LD structured data (Organization + WebSite + OnlineStore)
- **Accessibility**: wired all form labels via `htmlFor`/`id`, added `aria-invalid`/`aria-describedby` for errors, `aria-label` on icon-only buttons

### Testing

- **106/106 backend tests pass** (pytest)
- **0 lint errors** (ESLint)
- **Build succeeds** (~62s)

### Files Changed

- **92 files** changed, **16,555 insertions**
- **Backend**: 20 Python files (app, models, 10 route files, decorators, database, tests, scripts)
- **Frontend**: 65 files (pages, components, services, contexts, config, assets)
- **Config**: .gitignore, .env.example, .env.production, requirements.txt, package.json
