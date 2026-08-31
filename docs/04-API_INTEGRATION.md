# 04 — Integração com a API

[← Índice](README.md)

Todos os exemplos de resposta abaixo são **chamadas reais** feitas contra
`https://sentinel-api-sjie.onrender.com/api/v1` durante a auditoria
(30/08/2026), não exemplos hipotéticos. Todos os 16 endpoints listados
existem no `openapi.json` publicado pela própria API e foram cruzados
campo a campo com os tipos em `web/src/types/api.ts`.

## Cliente HTTP (`lib/api/client.ts`)

Ponto único de saída de toda chamada de rede do frontend:

```ts
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function apiGet<T>(path: string, params?: Record<string, ...>): Promise<T> {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new ApiError(message, res.status, code);
  return res.json();
}
```

- Monta a URL concatenando `BASE_URL` + o path do recurso (`/indicators`,
  `/kpis`, ...) — por isso `NEXT_PUBLIC_API_BASE_URL` **precisa** incluir o
  prefixo `/api/v1`.
- `buildQuery` descarta silenciosamente parâmetros `null`, `undefined` ou
  string vazia — nunca envia `?uf=` vazio para a API.
- Em resposta não-2xx, tenta ler o corpo como
  `{ error: { code, message } }` (o formato documentado pela API) e lança
  `ApiError`; se o corpo não seguir esse formato, usa uma mensagem
  genérica (`Request failed: {status}`).

## Módulos de API

### Indicators (`lib/api/indicators.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `listIndicators()` | `GET /indicators` | — | `useIndicators()` — usado em `IndicatorStrip`, `ExploreSection`, `WhatChangedSection`, `TemporalSection` |
| `getIndicator(id)` | `GET /indicators/{indicator_id}` | — | Não chamado por nenhum componente hoje |

Resposta real de `GET /indicators` (31 itens, mostrando o primeiro):

```json
{
  "total": 31,
  "data": [
    {
      "id": 1,
      "evento": "Apreensão de Cocaína",
      "familia_medida": "peso",
      "unidade": "kg (não confirmado pela fonte)",
      "tipo_indicador": "Apreensão - Peso",
      "grupo_semantico": "Apreensões (Peso)"
    }
  ]
}
```

### KPIs (`lib/api/kpis.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getKpis(query?)` | `GET /kpis` | `indicator_id`, `uf`, `municipio`, `ano`, `abrangencia` (todos opcionais) | `useKpis()` — usado em `BrasilEmNumeros` (com `{ ano: latestYear }`) |

Resposta real de `GET /kpis?indicator_id=12`:

```json
{
  "filters": { "indicator_id": 12, "uf": null, "municipio": null, "ano": null, "abrangencia": null },
  "data": [
    {
      "indicator_id": 12,
      "indicator": "Homicídio doloso",
      "familia_medida": "vitima",
      "value": 80563.0,
      "unit": "pessoas",
      "n_registros": 501027
    }
  ]
}
```

### Temporal (`lib/api/temporal.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getTemporal(query)` | `GET /temporal` | `indicator_id` (obrigatório), `uf`, `municipio`, `abrangencia`, `ano_inicio`, `ano_fim` | `useTemporal()` — `IndicatorHeadlineCard`, `DrugCompositeCard`, `WhatChangedSection`, `TemporalSection` |
| `getYoY(query)` | `GET /temporal/yoy` | `indicator_id` (obrigatório), `base_year`, `comparison_year` | `useYoY()` — `IndicatorHeadlineCard`, `DrugCompositeCard` |

Resposta real de `GET /temporal?indicator_id=12&ano_inicio=2025` (3 dos 8
pontos retornados):

```json
{
  "indicator": "Homicídio doloso",
  "indicator_id": 12,
  "unit": "pessoas",
  "data": [
    { "year": 2025, "month": 1, "value": 3053, "is_partial_year": false },
    { "year": 2025, "month": 2, "value": 2566, "is_partial_year": false },
    { "year": 2025, "month": 3, "value": 2812, "is_partial_year": false }
  ]
}
```

### Geography (`lib/api/geography.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getUFTotals(query)` | `GET /geography/uf` | `indicator_id` (obrigatório), `ano`, `mes`, `regiao`, `abrangencia` | `useUFTotals()` — `BrazilMap` |
| `getMunicipalityTotals(query)` | `GET /geography/municipalities` | `indicator_id` (obrigatório), `uf`, `ano`, `page`, `page_size` | Não chamado por nenhum componente hoje |

Resposta real de `GET /geography/uf?indicator_id=12&ano=2025` (3 dos 27
estados retornados):

```json
{
  "indicator": "Homicídio doloso",
  "unit": "pessoas",
  "data": [
    { "uf": "BA", "regiao": "Nordeste", "value": 3663 },
    { "uf": "RJ", "regiao": "Sudeste", "value": 3342 },
    { "uf": "CE", "regiao": "Nordeste", "value": 2927 }
  ]
}
```

### Rankings (`lib/api/rankings.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getUFRanking(query)` | `GET /rankings/uf` | `indicator_id`, `ano` (obrigatórios), `limit` | `useUFRanking()` — `RankingList` (`limit: 10`) |
| `getMunicipalityRanking(query)` | `GET /rankings/municipalities` | `indicator_id`, `ano` (obrigatórios), `limit` | Não chamado por nenhum componente hoje |
| `getIndicatorRanking(query)` | `GET /rankings/indicators` | `grupo_semantico`, `ano` (obrigatórios), `limit` | Não chamado por nenhum componente hoje |

Resposta real de `GET /rankings/uf?indicator_id=25&ano=2025`:

```json
{
  "indicator": "Roubo de veículo",
  "indicator_id": 25,
  "unit": "ocorrências",
  "ano": 2025,
  "data": [
    { "rank": 1, "uf": "RJ", "regiao": "Sudeste", "value": 25235.0 },
    { "rank": 2, "uf": "SP", "regiao": "Sudeste", "value": 25024.0 },
    { "rank": 3, "uf": "PE", "regiao": "Nordeste", "value": 11955.0 }
  ]
}
```

### Radar (`lib/api/radar.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getRadar(query?)` | `GET /radar` | `indicator_id`, `ano`, `min_abs_z`, `limit` (todos opcionais) | `useRadar()` existe no hook, **mas nenhum componente da UI o chama** |

Endpoint de detecção de anomalias (desvio em relação à média histórica,
por `z_score`). Resposta real de `GET /radar?limit=2`:

```json
{
  "total": 2,
  "data": [
    {
      "indicator": "Morte por intervenção de Agente do Estado",
      "year": 2025, "month": 10, "value": 706,
      "historical_mean": 536.4666666666667,
      "standard_deviation": 55.981385795240506,
      "z_score": 3.03
    }
  ]
}
```

> **Achado de auditoria**: o Radar é o único módulo de API totalmente
> integrado na camada de dados (`lib/api/radar.ts` + `useRadar()`) sem
> nenhuma interface que o exiba. Ver [05 — Funcionalidades](05-FEATURES.md).

### Metadata (`lib/api/metadata.ts`)

| Função | Endpoint | Parâmetros | Consumido por |
|---|---|---|---|
| `getMetadata()` | `GET /metadata` | — | `useMetadata()` — `Hero`, `BrasilEmNumeros`, `WhatChangedSection` |
| `listUFs()` | `GET /metadata/ufs` | — | `useUFOptions()` no hook — sem consumidor na UI hoje |
| `listYears()` | `GET /metadata/years` | — | `useYears()` — `ExploreSection`, `WhatChangedSection`, `TemporalSection` |
| `listAbrangencias()` | `GET /metadata/abrangencias` | — | Não chamado por nenhum componente hoje |
| `listMunicipalities(uf?)` | `GET /metadata/municipalities` | `uf` (opcional) | Não chamado por nenhum componente hoje |

Resposta real de `GET /metadata`:

```json
{
  "dataset": { "start": "2024-01", "end": "2026-06", "partial_year": true },
  "coverage": { "indicators": 31, "ufs": 27, "municipalities": 5298 }
}
```

Resposta real de `GET /metadata/years`: `[2024, 2025, 2026]`.

## Resumo — cobertura de uso

Dos **16 endpoints** existentes na API e dos **16 módulos de função**
correspondentes em `lib/api/`, os seguintes **não têm nenhum componente de
UI que os utilize** hoje (a função existe e funciona, mas a home page não
a chama):

- `getIndicator(id)` — `GET /indicators/{id}`
- `getMunicipalityTotals()` — `GET /geography/municipalities`
- `getMunicipalityRanking()` — `GET /rankings/municipalities`
- `getIndicatorRanking()` — `GET /rankings/indicators`
- `getRadar()` — `GET /radar` (hook `useRadar()` existe, sem consumidor)
- `listUFs()` — `GET /metadata/ufs` (hook `useUFOptions()` existe, sem consumidor)
- `listAbrangencias()` — `GET /metadata/abrangencias`
- `listMunicipalities()` — `GET /metadata/municipalities`

Isso não é um erro — é simplesmente a superfície da API sendo maior do que
a interface atual da home page explora. Ver
[05 — Funcionalidades](05-FEATURES.md) para o que está de fato visível ao
usuário, e a seção de roadmap no [README](../README.md) para o que isso
sugere como próximos passos.

## Tratamento de erro

`apiGet` lança `ApiError` (com `status` e `code` opcional) em qualquer
resposta não-2xx. Nenhum componente da aplicação captura esse erro
explicitamente — não há `try/catch`, nem leitura do campo `error` que o
SWR expõe, em nenhum arquivo de `web/src/components/`. Na prática, uma
falha de API deixa o SWR sem `data`, e o componente permanece
indefinidamente no seu estado de carregamento ou vazio (ver
[05 — Funcionalidades](05-FEATURES.md) e
[13 — Troubleshooting](13-TROUBLESHOOTING.md)).
