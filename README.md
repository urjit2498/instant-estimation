# Instant Quote Engine — Frontend

Frontend for an instant quote tool for local service businesses (starting with driveway
sealcoating contractors). Homeowners enter their address, trace their driveway on a satellite
map, answer a couple of pricing questions, and get an instant price estimate.

This is the **frontend only**. Quotes are created through the `create-quote` Edge Function
(proxied by `app/api/quote/create`); materials come from `get-brand-details` via
`app/api/materials`.

## Getting started

```bash
yarn install
cp .env.example .env.local   # then fill in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Without a Google Maps API key configured,
the address search and map/drawing steps show a friendly "not configured" message instead of
crashing — enough to see the rest of the flow and UI.

## Scripts

- `yarn dev` — start the dev server
- `yarn build` / `yarn start` — production build and run
- `yarn lint` — ESLint
- `yarn format` / `yarn format:check` — Prettier

## Structure

- `app/` — routes: `/` (landing), `/quote/[contractorSlug]` (quote flow), API routes under
  `app/api/`, plus `robots.ts`, `sitemap.ts`, `manifest.ts`
- `components/` — `layout/` (header/footer), `quote/` (the multi-step quote flow and its step
  components), `seo/` (JSON-LD)
- `lib/` — `mock/` (placeholder contractor data), `geo/` (Turf.js area/length helpers),
  `supabase/` (Edge Function clients), `validation/` (contact form validation), `env.ts`
- `hooks/` — `useGoogleMapsLoader`
- `types/` — shared TypeScript types

See inline `TODO` comments throughout for what needs real data/APIs before production.
