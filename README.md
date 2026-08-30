# SENTINEL-IO

**Public Safety Analytics Platform** — an observatory for Brazilian public
security data. Sentinel.io turns official [Sinesp VDE](https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/sinesp-1)
(Sistema Nacional de Informações de Segurança Pública) statistics into an
explorable dashboard: national KPIs, year-over-year comparisons, monthly time
series, and state/municipality rankings, broken down by indicator, UF
(state), municipality, coverage type (`abrangencia`) and year.

This repository currently contains the **frontend web application** (`web/`).
It is a Next.js client that consumes a separate Sentinel.io Analytics REST
API (OpenAPI v1.0.0) — the API itself is not part of this repo and must be
running/available separately (see [Configuration](#configuration)).

## Repository layout

```
SENTINEL-IO/
├── README.md      # this file
└── web/           # Next.js frontend application
```

## Tech stack (`web/`)

| Layer            | Choice                                              |
|-------------------|------------------------------------------------------|
| Framework          | [Next.js 16](https://nextjs.org/) (App Router)       |
| UI library         | React 19                                            |
| Language           | TypeScript 5                                        |
| Styling            | Tailwind CSS 4                                      |
| Data fetching/cache | [SWR](https://swr.vercel.app/)                     |
| Client state        | [Zustand](https://github.com/pmndrs/zustand)        |
| Charts              | [Recharts](https://recharts.org/)                   |
| Geo/map projection  | [d3-geo](https://github.com/d3/d3-geo)              |
| Fonts               | Space Grotesk, Inter, IBM Plex Mono (`next/font`)   |
| Lint                | ESLint 9 (`eslint-config-next`)                     |

## Getting started

Prerequisites: Node.js 18.18+ (matching the Next.js 16 requirement) and npm.

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. The dev
server (Turbopack) hot-reloads on file changes.

### Scripts

Run from inside `web/`:

| Script          | Description                                   |
|------------------|------------------------------------------------|
| `npm run dev`     | Start the Next.js dev server (Turbopack)       |
| `npm run build`   | Production build                               |
| `npm run start`   | Serve the production build                     |
| `npm run lint`    | Run ESLint                                     |

## Configuration

The frontend talks to the Sentinel.io Analytics API over HTTP and needs its
base URL, via a single env var read in
[`web/src/lib/api/client.ts`](web/src/lib/api/client.ts):
`NEXT_PUBLIC_API_BASE_URL`. A template lives at `web/.env.example`.

**Local development** — `web/.env.local` (git-ignored):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

If unset, it falls back to that same `http://localhost:8000/api/v1`.

**Production** — the public Sentinel.io Analytics API is deployed on Render:

```bash
NEXT_PUBLIC_API_BASE_URL=https://sentinel-api-sjie.onrender.com/api/v1
```

Set this in the hosting platform's environment variables (e.g. Vercel
project settings) **before** the build runs — `NEXT_PUBLIC_*` vars are
inlined into the client bundle at build time, so changing it after the app
is already built/deployed has no effect. The value must always include the
`/api/v1` prefix; every request path (`/indicators`, `/kpis`, etc.) is
appended directly to it.

### CORS

The Render API allows `http://localhost:3000` and
`https://sentinel-io.vercel.app` as CORS origins (verified). If the Vercel
deployment's final domain differs — including Vercel's per-branch preview
domains — requests from it will be blocked by CORS until that origin is
added to `CORS_ORIGINS` on the API side (Render). This is a backend
configuration change, not something to work around in the frontend (no
wildcard `*` origin).

## Application structure (`web/src`)

```
src/
├── app/                    # Next.js App Router entry points
│   ├── layout.tsx          # Root layout: fonts, <html>/<body>, metadata
│   ├── page.tsx            # Home page — composes all home sections
│   └── globals.css         # Tailwind base + design tokens
├── components/
│   ├── home/                # Sections that make up the home page (see below)
│   ├── layout/               # Header, Footer
│   ├── maps/                 # BrazilMap (choropleth, d3-geo projection)
│   ├── rankings/              # RankingList (UF/municipality/indicator rankings)
│   ├── filters/                # IndicatorSelect and other filter controls
│   └── ui/                     # Generic building blocks: Container,
│                                # SectionHeading, SegmentedControl, Sparkline,
│                                # TrendBadge
├── hooks/
│   └── useApi.ts            # SWR hooks wrapping every API call (caching,
│                             # revalidation policy, conditional fetching)
├── lib/
│   ├── api/                  # One file per API resource + typed fetch client
│   ├── constants/indicators.ts  # Indicator polarity rules, headline
│   │                             # indicator set, drug-seizure composite
│   ├── geo/                    # Brazil states GeoJSON + projection helpers
│   └── utils/                  # Formatting (numbers/dates) and color-scale
│                                # helpers
├── store/
│   └── filters.ts            # Zustand store: selected indicator/year/UF/
│                              # abrangencia, shared across the dashboard
└── types/
    └── api.ts                # TypeScript types mirroring the API's OpenAPI
                               # schema — source of truth is GET /openapi.json
                               # on the API itself
```

### Home page sections

`app/page.tsx` renders the home page as a stack of independent sections
(each in `components/home/`):

1. **Hero** — landing headline/intro.
2. **IndicatorStrip** ("Panorama Nacional") — headline KPI cards for the
   national picture.
3. **BrasilEmNumeros** ("O Brasil em números") — key national numbers for
   the latest available year.
4. **ExploreSection** ("Distribuição Geográfica") — choropleth map
   (`BrazilMap`) of indicator values by UF.
5. **WhatChangedSection** ("Comparação Anual") — year-over-year (YoY)
   variation for the selected indicator.
6. **TemporalSection** ("Série Mensal") — monthly time series chart with
   partial-year handling.
7. **ClosingCta** — closing call-to-action.

`IndicatorHeadlineCard` and `DrugCompositeCard` are card variants used
within these sections; the latter sums the "Apreensão de Cocaína" and
"Apreensão de Maconha" indicators (same unit, `kg`) into a single
client-side composite, since the API never returns that total itself.

## Data model & API integration

All API access is centralized in `src/lib/api/` (one module per resource:
`indicators`, `kpis`, `temporal`, `geography`, `rankings`, `radar`,
`metadata`), built on a small typed fetch wrapper in `client.ts`
(`apiGet<T>`) that:

- Prefixes every request with `NEXT_PUBLIC_API_BASE_URL`.
- Serializes query params, skipping `null`/`undefined`/empty values.
- Throws a typed `ApiError` (status + optional API error `code`) on non-2xx
  responses, parsing the API's documented `{ error: { code, message } }`
  shape when present.

`src/hooks/useApi.ts` wraps each of these calls in an SWR hook
(`useKpis`, `useTemporal`, `useYoY`, `useUFTotals`, `useUFRanking`,
`useMunicipalityRanking`, `useIndicatorRanking`, `useRadar`,
`useIndicators`, `useUFOptions`, `useYears`, `useMetadata`), with shared
revalidation settings (`revalidateOnFocus: false`, 60s deduping) and
conditional fetching (pass `null` to skip a request until its query is
ready).

### Endpoints consumed

| Resource   | Endpoint(s)                                                     |
|------------|-------------------------------------------------------------------|
| Indicators | `GET /indicators`, `GET /indicators/{id}`                        |
| KPIs       | `GET /kpis`                                                      |
| Temporal   | `GET /temporal`, `GET /temporal/yoy`                              |
| Geography  | `GET /geography/uf`, `GET /geography/municipalities`              |
| Rankings   | `GET /rankings/uf`, `GET /rankings/municipalities`, `GET /rankings/indicators` |
| Radar      | `GET /radar` (statistical anomaly detection: z-score vs. historical mean) |
| Metadata   | `GET /metadata`, `GET /metadata/ufs`, `GET /metadata/years`, `GET /metadata/abrangencias`, `GET /metadata/municipalities` |

### Domain concepts

- **Indicator (`evento`)** — a measured event (e.g. "Homicídio doloso"),
  belonging to a `familia_medida` (`vitima` | `contagem` | `peso`) and a
  `grupo_semantico` (Vítimas, Ações Policiais, Ocorrências, Apreensões
  (Peso), Apreensões (Unidade), Serviços). Values across different
  `familia_medida` are never summed.
- **Polarity** (`lib/constants/indicators.ts`) — whether a rising value for
  an indicator is favorable, unfavorable, or neutral, derived from its
  semantic group with per-indicator overrides (e.g. "Pessoa Localizada" is
  `up-is-favorable`).
- **Abrangência** — the coverage/scope dimension of a record (filterable
  alongside UF, municipality, and year).
- **Filters store** (`store/filters.ts`) — a single Zustand store holding
  the currently selected `indicatorId`, `year`, `uf`, and `abrangencia`,
  shared by every section on the dashboard.

## Environment files

`web/.env.local` is git-ignored and holds local configuration
(`NEXT_PUBLIC_API_BASE_URL`). Set the equivalent environment variable in
your deployment platform (e.g. Vercel project settings) for other
environments.

## Deployment

Any Node.js host that can run `next build && next start` works. The
simplest option is [Vercel](https://vercel.com/new), the creators of
Next.js — see the
[Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)
for details. Remember to set `NEXT_PUBLIC_API_BASE_URL` for the target
environment before building.
