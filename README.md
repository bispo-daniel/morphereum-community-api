# Morphereum — Community API ⚙️

\*A compact, rate-limited, cache-aware API for a fictional meme coin ecosystem: **$Morphereum\***

> Powers the Community Interface with token quotes, daily raids, curated links, community arts, and engagement metrics.

---

## ✨ What this API does

- **Token quotes**: formatted price/volume/changes/supply/holders from CoinMarketCap DEX endpoints.
- **Daily Raid**: fetch today’s raid (platform, URL, share copy).
- **Curated Links**: official + community links, with trending metrics.
- **Community Arts**: approve-gated gallery + image upload pipeline (compression + Cloudinary).
- **Engagement Metrics**: visits, raids, links, chat (user/raid messages), arts submissions — with daily breakdowns and trending.

All endpoints live under the base path: **`/api`**.

---

## 🧱 Tech Stack

**Runtime & Server**

- **Node.js** + **Express**
- **HTTPS (dev)** via local certs (`localhost.pem`, `localhost-key.pem`)
- **CORS** (allow-list)
- **Rate limiting** + **progressive slowdown** (`express-rate-limit` + `express-slow-down`)
- **morgan** logging with colorful status + timestamps
- **dotenv** + **zod** for strict **env validation**

**Data & Storage**

- **MongoDB** (Mongoose models) for raids, links, arts and metrics
- **Cloudinary** for image storage (uploads from API)
- **NodeCache** for in-memory caching (end-of-day TTL or hours)

**Utils & DX**

- **multer** (memory) + **sharp** (JPEG 80%, width 800) for upload pipeline
- **date-fns** for date math/formatting
- Type-safe schemas via **zod**

---

## 🚦 Security, CORS, Rate-limit & Slowdown

- **CORS origins**: `https://localhost:5173`, `https://morphereum.netlify.app`.
- **Slowdown**: after **150 req/min**, each hit adds `(hits * 500ms)` delay.
- **Rate-limit**: **1000 req / 10 min / IP** (standard headers, no legacy).
- **HTTPS (dev only)**: if `NODE_ENV=development`, server boots with local certs.
- **Trust proxy**: enabled (for correct client IP when proxied).
- **Logging**: custom `morgan` format with colorized HTTP status + local timestamp.

---

## 🧭 REST Endpoints

> Base path: `/api`

### Token

- `GET /token` → Latest formatted token stats (cached for `TOKEN_CACHE_HOURS`).  
  **Response (example)**:
  ```json
  {
    "tokenPriceInUSD": "$0.01234",
    "volumeIn24H": "$1.2M",
    "changeIn1H": "+0.54%",
    "changeIn24H": "-2.10%",
    "marketCap": "12M",
    "buy24H": "1.2K",
    "sell24H": "980",
    "transactions24H": "2.1K",
    "totalSupply": "420M",
    "holders": 12345
  }
  ```
  (Formatted fields come from CMC DEX “pairs/quotes/latest”.)

### Raid

- `GET /raid` → Today’s raid (by UTC date): `{ date, platform, url, shareMessage, content }`. Cached until end of day.

### Links

- `GET /links` → Curated links list: `[{ _id, label, url, icon, type }]` (`type` ∈ `community-links | official-links`). Cached until end of day.

### Arts

- `GET /arts?page={n}` → Paginated, only `approved: true`. Returns:
  ```json
  {
    "arts": [
      {
        "_id": "...",
        "approved": true,
        "name": "...",
        "creator": "...",
        "xProfile": "...",
        "description": "...",
        "url": "https://..."
      }
    ],
    "page": 1,
    "next": true
  }
  ```
  Page size: **20**. Cached until end of day.
- `POST /arts` (**multipart/form-data**) → Upload + register art. Fields:
  - `image` (file) — **required**; images only; **≤ 10MB**; processed to **800px wide, JPEG 80%**
  - `creator` (string), `xProfile` (string), `description` (string) — all **required**  
    **Status**: `201` on success; `400` on bad input; `500` on processing error.  
    (Uploads go to Cloudinary; original is never stored permanently.)

### Metrics

> All “GET” metrics default to a **7-day** window ending **yesterday (UTC)** for stability. Many endpoints aggregate to `{ total, highestCount, daily[] }`.

- **Visits**
  - `POST /metrics/visits` → body: `{ "country": "Brazil" }`
  - `GET  /metrics/visits` → time series over last 7 days
  - `GET  /metrics/visits/countries` → `{ highestCount, countries: [{ country, count }] }`
- **Raids**
  - `POST /metrics/raids`
  - `GET  /metrics/raids` → 7-day time series
  - `GET  /metrics/raids/trending` → Top dates + platform: `{ total, raids: [{ date: "dd/MM/yyyy", count, platform }] }`
- **Links**
  - `POST /metrics/links` → body: `{ "linkId": "<MongoID>" }`
  - `GET  /metrics/links` → 7-day time series
  - `GET  /metrics/links/trending` → Top links + icon: `{ total, links: [{ label, icon, count }] }`
- **Chat**
  - `POST /metrics/chat` → user messages
  - `GET  /metrics/chat` → 7-day user message series
  - `POST /metrics/chat/raid-message` → raid messages
  - `GET  /metrics/chat/raid-message` → 7-day raid message series
- **Arts**
  - `POST /metrics/arts` → body: `{ "xProfile": "https://x.com/..." }`
  - `GET  /metrics/arts` → 7-day submission series
  - `GET  /metrics/arts/producers` → `{ producers, arts }`
  - `GET  /metrics/arts/producers/trending` → Top producers with counts/approvedCount

All endpoints return `404` when no data is found for the requested aggregation window.

---

## 📚 API Documentation (Swagger / OpenAPI)

* **Swagger UI** is served at: `http(s)://localhost:<PORT>/docs` (automatically mounted by the server).
* **Raw OpenAPI JSON**: `http(s)://localhost:<PORT>/openapi/openapi.json`
  Both routes are registered in `src/server.ts` using **swagger-ui-express** and a static mount of the `docs/` directory.

### How it’s organized

The OpenAPI specification is **fully modular** and stored as JSON files inside `docs/`:

* `docs/openapi.json` – root spec that composes all other definitions.
* `docs/components/` – reusable **schemas**, **responses**, and **parameters**.

  * Schemas include: **Token**, **Raid**, **Link**, **ArtItem**, and all **metrics** models (e.g., visits, links, raids, chat, arts).
  * Responses define empty-body patterns for success and errors (`Empty200`, `BadRequest`, `NotFound`, etc.).
  * Common query and path parameters (e.g., `Page` for pagination).
* `docs/paths/**` – individual route operation files (Token, Raid, Links, Arts, Metrics).
  Each operation references shared components through `$ref`.

### Design notes

* **Public by design** — `/docs` and `/openapi` are intentionally exposed in production to simplify integration and testing.
  Only the documentation endpoints are public; all API resources remain protected as defined.
* **No build step needed** — the JSON specs are read directly by Swagger UI. Any edit to `docs/**/*.json` is instantly reflected on reload.
* Responses that return no body (e.g., `400`, `404`, `500`) are explicitly modeled as “empty” to mirror real runtime behavior.
* Consistent naming and `$ref` usage ensure parity with the Admin API structure.

### How to update

1. Edit or add new schemas in `docs/components/schemas.json`.
2. Reuse shared responses and parameters from `docs/components/*.json`.
3. Create or modify endpoint definitions under `docs/paths/**`, and reference them in `docs/openapi.json`.
4. Open `/docs` in your browser to preview and verify updates.

> To restrict documentation access in production, remove or secure the `/docs` and `/openapi` mounts in `server.ts`.
> By default, they remain publicly accessible for transparency and developer experience.

---

## 🔁 Cross-API Cache Invalidation (RabbitMQ / CloudAMQP)

**Why messaging?**
Instead of using HTTP callbacks between services, this project uses **RabbitMQ (CloudAMQP – Little Lemur)** to practice message-driven patterns and ensure consistent cache invalidation between APIs.

## Summary

* **Goal:** keep in-memory caches synchronized between the **Community API** and the **Admin API**.
* **Approach:** both APIs share a common topic exchange (`cache.flush`).

  * The **Admin API** publishes events when data changes.
  * The **Community API** listens to those events and clears its caches accordingly.
* **Broker:** RabbitMQ via CloudAMQP.
* **Exchange:** topic exchange dedicated to cache-flush events.
* **Routing keys:** `arts.flush`, `links.flush`, `raids.flush`.
* **Message payload:** includes the event type, timestamp, and a `source` identifier, allowing each API to ignore its own messages if needed.

## Publishers (Senders)

This API publishes **only one event type**:

* **Arts:** when a new art submission is registered (`POST /arts`), this service clears its own cache and **publishes `arts.flush`** to notify the Admin API and any other subscribers.

All other mutation events (links, raids, etc.) originate from the Admin API.

## Consumer (Listener)

* **Bindings:** listens to `arts.flush`, `links.flush`, and `raids.flush`.
* **Effect:** when an event is received, the corresponding NodeCache entries are cleared (`artsData`, `linksData`, `raidData`).
* **Self-skip:** messages published by this same service (identified by the `source` field) are safely ignored to avoid redundant flushes.

## Environment & Conventions

* **Broker URL:** provided via environment variable `RABBITMQ_URL` (CloudAMQP connection string).
* **Exchange name:** `cache.flush` (type: topic).
* **Routing keys:** `arts.flush`, `links.flush`, `raids.flush`.
* **Delivery semantics:** lightweight, fire-and-forget notifications; duplicate deliveries are harmless since cache clears are idempotent.

## Operational Notes

* **Startup:** the RabbitMQ consumer is initialized on boot and remains subscribed to the exchange.
* **Observability:** monitor queue and routing activity via the CloudAMQP dashboard.
* **Failure behavior:** if the broker is down, local caches are still invalidated; remote APIs update once connectivity returns (eventual consistency).
* **Security:** keep broker credentials private; use per-environment CloudAMQP URLs.
* **Performance:** payloads are small and processing is near-instant.

## Quick Checklist

* Confirm `RABBITMQ_URL` and `cache.flush` exchange are set in environment variables.
* Verify this service **publishes only `arts.flush`** on art submission.
* Ensure listeners are active for all three routing keys (`arts.flush`, `links.flush`, `raids.flush`).
* Check that cache clearing is idempotent and consistent across both APIs.

---

## 🗂️ Data Models (MongoDB via Mongoose)

- **Raid**: `{ date: Date, platform: string, url: string, shareMessage: string, content: string }`
- **Links**: `{ label, url, icon, type }` (`type` ∈ `community-links | official-links`)
- **Arts**: `{ approved, name, creator, xProfile, description, url }`
- **Metrics (collections)**
  - `visits_metrics`: `{ country, date }`
  - `raid_metrics`: `{ date }`
  - `links_metrics`: `{ date, linkId(ref Links) }`
  - `chat_metrics`: `{ date, type ∈ user-message|raid-message }`
  - `arts_metrics`: `{ xProfile, date }`

Validation for inbound/outbound shapes is done with **zod** where applicable.

---

## 🧮 Caching Strategy

- **End-of-day TTL**: Many GET controllers cache responses in memory (`NodeCache`) until **23:59:59 UTC today** (computed once on boot).
- **Token**: Cached for `TOKEN_CACHE_HOURS` (env-driven).
- **Cache keys**: e.g., `tokenData`, `raidData`, `linksData`, `artsData-page-{n}`, etc.
- **Not found** (or validation failures) are **not** cached.

This keeps traffic to DB/CMCap low while keeping the dashboard snappy.

---

## 🔐 Environment Variables

All envs are **validated at startup** (process exits on failure):

```env
# core
NODE_ENV=development            # or production
PORT=8080

# token source (CMC)
TOKEN_POOL_ADDRESS=...
CMC_API_URL=https://pro-api.coinmarketcap.com
CMC_API_TOKEN=...
CMC_SOL_NETWORK_ID=...
CMC_API_AUX_FIELDS=...

# token cache
TOKEN_CACHE_HOURS=1

# database
MONGODB_CONNECTION_STRING=mongodb+srv://...
MONGODB_DB_NAME=morphereum

# cloudinary (uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> In **development**, the server attempts to use local HTTPS and will look for `localhost.pem` and `localhost-key.pem` at the project root.
> Use `mkcert` to generate the certicates with the command `mkcert localhost`

---

## ▶️ Getting Started

```bash
# 1) install deps
pnpm install        # or: npm i / yarn

# 2) create .env file
cp .env.example .env   # then fill in all required fields

# 3) run dev (uses HTTPS if NODE_ENV=development and certs exist)
pnpm dev

# 4) production build & run (typical PM2 / container flow)
pnpm build && pnpm start
```

Recommended: **Node 18+**. The app connects to MongoDB on boot and logs connection status.

---

## 🏗️ Project Structure (API)

```
src/
  config/               # env schema (zod), dev cert loader
  controllers/          # route handlers (token, raid, links, arts, metrics/*)
  middlewares/          # imageHandler (multer + sharp)
  models/               # mongoose schemas (arts, links, raids, metrics/*)
  router/               # mounts /token, /raid, /links, /arts, /metrics
  services/             # DB/CLOUD/CMC orchestration & aggregations
  types/                # zod schemas (e.g., CoinMarketCap)
  utils/                # cache TTL, dates, http helpers, logging, connections
  server.ts             # express bootstrap, CORS, limits, HTTPS(dev)
```

Key flows:

- **Token**: fetch from CMC → zod parse → format fields → cache.
- **Arts upload**: `multer` (memory) → `sharp` (resize/compress) → temp write → **Cloudinary** upload → Mongo record → remove temp.
- **Metrics**: query by UTC-normalized windows, generate daily series with `date-fns`.

---

## 🧪 Status & Errors

- **200** JSON payloads via `sendJson()`.
- **201** (art created), **400** (validation/missing fields), **404** (no data), **500** (internal).
- Minimal bodies for error statuses by design.
- Console logging uses a custom wrapper for colored timestamps (dev-friendly).

---

## 🧩 Integration Notes (Frontend)

- Frontend should pass **`page`** on `/arts` (1-based).
- For `/metrics/*` GETs, assume **7-day** windows ending **yesterday (UTC)**.
- For `/token`, values are **pre-formatted strings** (UI-ready).
- For uploads, field name **`image`**; enforce client-side size/type too.

---

### Made with ⚡ by the $Morphereum community
