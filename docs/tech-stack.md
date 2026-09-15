# Instant Quote Engine — Tech stack

**Project:** Instant Quote Engine (instant estimation / quote flow)  
**Purpose:** Share the technology used to build this product with stakeholders.

---

## Summary

This is a **web application**. Homeowners measure a driveway on a satellite map, pick a material, and receive an instant price estimate.

The **frontend** is built with Next.js. **Materials, quote creation, and pricing** are handled by Supabase Edge Functions. **Maps and address lookup** use Google Maps APIs.

---

## Core stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15 |
| UI library | React | 19 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Package manager | Yarn | 1.22 |

**Fonts:** Inter, Space Grotesk, IBM Plex Mono (Google Fonts)

---

## Maps & measurement

| Capability in the product | Technology |
|---|---|
| Satellite map of the property | Google Maps JavaScript API |
| Address search / autocomplete | Google Places API |
| Resolve a typed address | Google Geocoding API |
| Draw driveway shape on the map | Custom drawing on Google Maps |
| Area and length from the drawing | Turf.js (runs in the browser) |

Drawing and measuring run in the browser. Google is billed for **loading the map** and **looking up addresses**, not for drawing or calculating size.

---

## Backend & data

| Capability | Technology |
|---|---|
| Brand, materials, heights, and unit prices | Supabase Edge Function `get-brand-details` |
| Create a lead/quote and return estimated price | Supabase Edge Function `create-quote` |
| Material photos | Supabase Storage |
| Server-side API proxy (keeps keys off the browser) | Next.js Route Handlers (`/api/materials`, `/api/quote/create`) |

Contractor lookup on the frontend is still a small local catalog keyed by URL slug. Live materials and pricing come from Supabase.

---

## Tooling & quality

- **ESLint** and **Prettier** for code quality and formatting
- Security headers and Content Security Policy in the Next.js config
- SEO basics: sitemap, robots, web app manifest, JSON-LD for local business

---

## Hosting

| Part | Intended host |
|---|---|
| Website (Next.js app) | Netlify (or any host that supports Next.js) |
| Backend functions and storage | Supabase |

---

## Accounts the client needs

1. **Google Cloud** project with billing enabled, and these APIs turned on:
   - Maps JavaScript API
   - Places API
   - Geocoding API
2. **Supabase** project with:
   - Project URL
   - Anon / publishable key
   - Edge Functions (`get-brand-details`, `create-quote`)

---

## One-line description

Next.js 15 / React 19 / TypeScript / Tailwind CSS, with Google Maps for property measurement and Supabase for materials, quotes, and pricing.
