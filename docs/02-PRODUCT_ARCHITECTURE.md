# 02 — Arquitetura do Produto

[← Índice](README.md)

## Visão geral

O Sentinel.io é um cliente HTTP puro: não tem backend próprio, banco de
dados ou processo server-side de dados. Toda a lógica de negócio
(agregação, ranking, série temporal, ano parcial) já vem pronta da API do
ATLAS — o frontend apenas busca, formata e desenha.

```mermaid
flowchart TB
    ATLAS["ATLAS\nData Warehouse já validado\n(PostgreSQL + camada analítica SQL)\nfora deste repositório"]
    API["Sentinel.io Analytics API\nFastAPI · OpenAPI v1.0.0\nsomente leitura"]
    Render["Render\nhttps://sentinel-api-sjie.onrender.com"]
    CORS["CORS allowlist\nlocalhost:3000, sentinel-io.vercel.app,\nsentinel-io-delta.vercel.app"]
    Front["Sentinel.io Frontend\nNext.js 16 · React 19 · TypeScript"]
    Vercel["Vercel\nhttps://sentinel-io-delta.vercel.app"]
    User["Usuário final\n(navegador)"]

    ATLAS --> API --> Render
    Render --> CORS --> Front
    Front --> Vercel --> User
    User -. "interage: troca indicador,\nhover no mapa/ranking" .-> Front
```

Este diagrama reflete o que foi **observado e confirmado** durante a
auditoria (30/08/2026): a API responde em produção no Render, o CORS foi
testado origem a origem, e o bundle JavaScript publicado em
`sentinel-io-delta.vercel.app` contém a URL do Render já embutida — ou
seja, o deploy de produção atual já está conectado à API real.

## Separação frontend / backend

A separação é estrita: o repositório do Sentinel.io (`web/`) não contém
nenhum código de ETL, banco de dados, cálculo de indicador ou lógica de
agregação. Toda essa responsabilidade pertence à API. O contrato entre os
dois lados é exclusivamente:

- **Protocolo**: HTTP/HTTPS, método `GET`, respostas JSON.
- **Formato de erro**: `{ "error": { "code": "...", "message": "..." } }`
  (tratado em `web/src/lib/api/client.ts`).
- **Base URL**: única variável de ambiente,
  [`NEXT_PUBLIC_API_BASE_URL`](09-ENVIRONMENT.md).

## Onde a busca de dados acontece: no navegador, não no servidor

Ponto importante e verificado no código: **todo componente que busca dados
é um Client Component** (`"use client"` no topo do arquivo — confirmado em
todos os componentes de `home/`, `maps/`, `rankings/` e `filters/`). Isso
significa que as chamadas à API acontecem **no navegador do usuário**, via
[SWR](https://swr.vercel.app/), depois que a página já chegou como HTML.
Não há data fetching no servidor Next.js (nenhum `fetch` em Server
Component ou Route Handler foi encontrado em `web/src/app/`).

Isso tem duas consequências práticas, ambas documentadas em detalhe em
[04 — Integração com a API](04-API_INTEGRATION.md) e
[11 — CORS](11-CORS.md):

1. **CORS importa de verdade** — como o `fetch` roda no navegador, a
   origem que precisa estar liberada na API é o domínio que o usuário está
   visitando (`sentinel-io-delta.vercel.app` em produção), não um servidor
   Next.js.
2. **`NEXT_PUBLIC_API_BASE_URL` precisa estar correta em build-time** —
   como o valor é lido em código que roda no navegador, o Next.js precisa
   embuti-lo no bundle JavaScript durante o `next build`. Detalhado em
   [09 — Variáveis de Ambiente](09-ENVIRONMENT.md).

## Fluxo de comunicação: componente → API → tela

```mermaid
sequenceDiagram
    participant C as Componente React\n(ex.: IndicatorHeadlineCard)
    participant H as Hook SWR\n(useApi.ts)
    participant L as API Client\n(lib/api/*.ts + client.ts)
    participant A as Sentinel.io Analytics API\n(Render)

    C->>H: useYoY({ indicator_id })
    H->>L: getYoY(query)
    L->>A: GET /api/v1/temporal/yoy?indicator_id=...
    A-->>L: 200 JSON (YoYResponse)
    L-->>H: dados tipados
    H-->>C: { data, isLoading }
    C->>C: re-render com valor formatado
```

Se a API responder um status não-2xx, `apiGet` lança um `ApiError`
tipado (mensagem + status + código, quando a API os fornece) — mas,
conforme documentado em [05 — Funcionalidades](05-FEATURES.md), **nenhum
componente hoje trata esse erro visualmente**: o SWR apenas não popula
`data`, e o componente permanece no seu estado de carregamento/vazio.

## Estado compartilhado no cliente

Um único store [Zustand](https://github.com/pmndrs/zustand)
(`web/src/store/filters.ts`) guarda a seleção atual do usuário
(`indicatorId`, `year`, `uf`, `abrangencia`) e é lido por múltiplos
componentes ao mesmo tempo — é o que permite que trocar o indicador em um
card do topo da página atualize o mapa, o ranking e o gráfico mais abaixo,
sem prop drilling. Detalhes de quais campos estão realmente conectados a
alguma UI em [03 — Arquitetura do Frontend](03-FRONTEND_ARCHITECTURE.md).

## Deploy — visão de infraestrutura

```mermaid
flowchart LR
    Dev["Desenvolvedor\ngit push"] --> Repo["Repositório GitHub\nSENTINEL-IO"]
    Repo -- "build automático" --> VercelBuild["Vercel Build\nnext build\n(NEXT_PUBLIC_API_BASE_URL\nembutida aqui)"]
    VercelBuild --> VercelDeploy["Vercel\nsentinel-io-delta.vercel.app"]
    VercelDeploy -- "runtime: fetch no navegador" --> API["Sentinel.io Analytics API\nRender"]
```

Detalhado em [10 — Deploy](10-DEPLOYMENT.md).

## O que este documento não cobre

Pipeline de ETL, PostgreSQL, DuckDB, modelagem dimensional e qualquer
detalhe interno de como o ATLAS produz os indicadores estão fora do
escopo — porque estão fora deste repositório e não foram auditados aqui.
Onde a arquitetura popular do produto ("PostgreSQL → DuckDB → FastAPI")
é mencionada em qualquer lugar desta documentação, é citada apenas como
contexto de origem externa, nunca como fato verificado em código.
