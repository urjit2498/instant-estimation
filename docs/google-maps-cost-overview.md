# Google Maps usage & cost overview

**Project:** Instant Estimation (quote / measure flow)  
**Purpose:** Simple summary for stakeholders on what Google Maps is used for and expected cost.

---

## Short answer

Google Maps is **not completely free**, but Google gives a **monthly free allowance** per API. For typical early traffic on this quote tool, cost is often **$0**. You only pay after free limits are exceeded. A billing card must be on file with Google Cloud.

---

## What we use Google Maps for

| Feature in the app | Uses Google? | Billable? |
|---|---|---|
| Satellite map of the property | Yes | Yes — map load (“Dynamic Maps”) |
| Address search / autocomplete | Yes | Yes — Places Autocomplete |
| “Find my property” when address is typed | Yes | Yes — Geocoding |
| Drawing fence lines / polygons on the map | No (runs in the browser) | **No** |
| Measuring length / area from the drawing | No (local calculation) | **No** |

So: Google charges for **loading the map** and **looking up addresses**. Drawing and measuring are free on our side.

---

## How Google pricing works (current model)

As of March 2025, Google no longer uses a single flat “$200 credit for everything.” Instead:

- Each product (map loads, geocoding, autocomplete, etc.) has its **own free monthly quota**
- Many common products (Essentials) include about **10,000 free calls per month**
- After the free quota, you pay **per 1,000 requests**

You always need a **Google Cloud billing account**. Free quota still applies; you are not charged until you go over it.

Official pages:
- https://mapsplatform.google.com/pricing/
- https://developers.google.com/maps/billing-and-pricing/overview

---

## Expected cost for this product

Rough pattern for one completed quote:

1. User opens the measure step → **1 map load**
2. User searches an address → **autocomplete** usage
3. Sometimes “Find my property” → **1 geocode**
4. User draws on the map → **$0**

### Illustrative monthly ranges

| Approx. completed quote sessions / month | Likely Google Maps cost |
|---|---|
| Low hundreds to low thousands | Often **$0** (within free quotas) |
| Around free-tier limits (~10k map loads) | Free tier ends; usually **tens of USD** if you go over |
| Higher volume | Scales mainly with **map loads** + address search |

These are estimates only. Exact cost depends on how many times the map is opened, how much users type in autocomplete, and which Google SKUs are billed for your project.

---

## What is *not* charged by Google

- Drawing points, lines, or polygons  
- Dragging vertices  
- Calculating fence length or area  
- Showing our material catalog / quote UI (that uses Supabase / our servers)

---

## Recommendations for the client

1. **Enable billing** in Google Cloud (required).
2. Set a **monthly budget alert** (e.g. notify at $25 / $50 / $100).
3. Optionally set a **quota cap** so spend cannot spike unexpectedly.
4. **Restrict the API key** to your production domain(s) only (HTTP referrer restriction).
5. Review usage in Google Cloud Console → **APIs & Services → Maps** / billing reports after go-live.

---

## Summary for decision-makers

| Question | Answer |
|---|---|
| Is Google Maps free forever? | No — free monthly quotas, then pay-as-you-go |
| Will drawing fences cost money? | No |
| Will showing the satellite map cost money? | Only after free map-load quota is used |
| Is early / moderate traffic usually cheap? | Yes — often $0 within free limits |
| Is a credit card required? | Yes, on the Google Cloud billing account |

---

*Document prepared for client sharing. Pricing can change; confirm current rates on Google’s official pricing pages before budgeting at scale.*
