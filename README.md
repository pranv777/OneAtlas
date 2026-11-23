# OneAtlas (frontend)

AI model discovery and intelligence platform: browse, filter, compare and rank AI models across labs and providers.
Built for the **Frontend Engineer** track: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, TanStack Query.

## Run it

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
npm run typecheck && npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel choose **Add New → Project**, import the repo (framework is detected as Next.js, no settings needed).
3. Deploy. To use a real backend later, add the env var `NEXT_PUBLIC_API_URL` and redeploy.

## How data flows

```
Component → hook (src/lib/hooks.ts, TanStack Query) → typed client (src/lib/api.ts) → GET {NEXT_PUBLIC_API_URL}/api/...
```

The frontend only knows the REST contract below. Because the assignment's backend is outside this role, a **mock API** is included under
`src/app/api/*` (backed by `src/server/*`) so the app works end to end on Vercel. It does server-side filtering, sorting, pagination,
ranking and search, like a real backend would. The UI never imports `src/server`. To switch to a real backend, set
`NEXT_PUBLIC_API_URL` and delete `src/app/api` and `src/server`; no UI code changes.

> The model specs, prices and benchmark scores in `src/server/data.ts` are illustrative sample data.

### API contract used by the UI

| Endpoint | Query params | Returns |
|---|---|---|
| `GET /api/models` | `q, labs, providers, types, capabilities, modalities, openWeights, sort, page, pageSize` (lists are comma separated) | `Paginated<Model>` |
| `GET /api/models/:slug` | | `{ model, related[] }` |
| `GET /api/compare` | `models=a,b,c` (1–4 slugs) | `{ models[], benchmarks[] }` |
| `GET /api/rankings` | `benchmark` (`overall` or id), `type` | `{ selected, benchmarks[], entries[] }` |
| `GET /api/labs`, `/api/labs/:slug` | `q` | `{ items[] }`, `{ lab, models[], providers[] }` |
| `GET /api/providers`, `/api/providers/:slug` | `q, kind` | `{ items[] }`, `{ provider, models[] }` |
| `GET /api/search` | `q` | `{ models[], labs[], providers[] }` |
| `GET /api/facets`, `/api/stats` | | filter options with counts, headline counts |

Errors use `{ "error": { "message": string } }` with a proper status code; the client turns them into `ApiError`.
`sort` is one of `newest, price-asc, price-desc, context-desc, context-asc, name`.

## Features (against the brief)

- **Discovery**: search, filter by lab, provider, type, capability, input modality and open weights; sort by price, context and release date; list/grid views; pagination.
- **Detail pages**: specs, pricing, modalities, capabilities, per-provider price/latency/speed, benchmark bars, similar models.
- **Comparison**: up to 4 models side by side with best values highlighted; shareable URL (`/compare?models=a,b`); persistent tray.
- **Rankings**: overall index plus per-benchmark leaderboards, filter by model type.
- **Labs and providers**: directories with search, detail pages, release history, supported models.
- **Product experience**: global search palette (Ctrl/Cmd+K, keyboard navigable), responsive layouts, skeleton/empty/error states, skip link, visible focus, reduced-motion support.

## Frontend decisions worth explaining in the Loom

- **URL is the source of truth for list state** (filters, sort, page, view). Views are linkable, back/forward works, and there is no duplicated state to drift.
- **TanStack Query** gives caching, request de-duplication, `keepPreviousData` (no flicker while filtering) and retry; search input is debounced and requests are abortable.
- **Typed API boundary** (`src/lib/types.ts` + `api.ts`) keeps components ignorant of where data comes from.
- **Compare state** lives in a small context persisted to `localStorage`; the compare page reconciles it with the URL so shared links win.
- **Server-side work stays on the server**: pagination, filtering and ranking happen in the API, so the client payload stays small.
- **Trade-off**: pages fetch client-side, so detail pages are not pre-rendered for SEO. With a real backend, the natural next step is server components that prefetch and hydrate the same query keys.

## Structure

```
src/app/            routes (home, models, models/[slug], compare, rankings, labs, providers) + mock /api
src/components/     UI: ModelsExplorer, FilterPanel, ModelRow/Card, CompareView, RankingsView, SearchPalette, ...
src/lib/            api client, hooks, types, formatters
src/server/         mock data + query layer (replace with the real backend)
```
