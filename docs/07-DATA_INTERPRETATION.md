# 07 — Interpretação dos Dados

[← Índice](README.md)

Este documento existe para evitar leituras erradas dos números exibidos no
Sentinel.io. Todos os fatos abaixo vêm de `GET /metadata` e das respostas
reais da API, checados em 30/08/2026 — não de suposição.

## Período coberto

```json
{ "dataset": { "start": "2024-01", "end": "2026-06", "partial_year": true } }
```

- O dataset cobre de **janeiro de 2024** até **junho de 2026**.
- `partial_year: true` significa que o **último ano da série (2026) ainda
  não está completo** — os dados de 2026 vão só até junho.

> **Não confirmado**: por que a série começa em 2024 (se é um recorte do
> Sinesp VDE, uma limitação da fonte, ou uma decisão do ATLAS) não pode ser
> respondido a partir do que a API expõe publicamente.

## O que significa "ano parcial"

Quando um indicador é mostrado com o selo "dados parciais" ou um trecho
tracejado no gráfico, significa que aquele ano **ainda não tem todos os 12
meses disponíveis** — normalmente porque é o ano corrente. A API sinaliza
isso explicitamente por ponto mensal, via o campo `is_partial_year` em
`TemporalPoint`.

**Por que isso importa**: comparar um ano parcial com um ano completo sem
ajuste distorce a leitura — um total de "janeiro a junho de 2026" vai
parecer menor que "janeiro a dezembro de 2025" mesmo que a tendência real
seja de alta. É por isso que a seção "O que mudou?" (`WhatChangedSection`)
recorta a comparação para os mesmos meses em todos os anos quando o ano
mais recente está incompleto — e explica isso na tela.

## Cobertura

```json
{ "coverage": { "indicators": 31, "ufs": 27, "municipalities": 5298 } }
```

- **31 indicadores** oficiais, cobrindo vítimas, ações policiais,
  ocorrências, apreensões (por peso e por unidade) e serviços.
- **27 unidades federativas** — todos os estados brasileiros + o Distrito
  Federal.
- **5.298 municípios** com dados disponíveis.

## Indicadores não são comparáveis entre si livremente

Cada indicador pertence a uma `familia_medida`: `vitima`, `contagem` ou
`peso`. A API — e o frontend, seguindo a mesma regra — **nunca soma
valores de famílias diferentes**. A única exceção construída no frontend
é o composto de apreensão de drogas (cocaína + maconha), e só porque as
duas têm a mesma família (`peso`) e a mesma unidade (kg) — ver
[05 — Funcionalidades](05-FEATURES.md).

Na prática: não é correto somar "Homicídio doloso" (pessoas) com
"Apreensão de Cocaína" (kg) — são grandezas diferentes, mesmo aparecendo
lado a lado na tela.

## Valor absoluto vs. ranking

Um estado aparecer no topo do ranking significa que ele tem o **maior
valor absoluto** para aquele indicador naquele ano — não necessariamente a
maior taxa por habitante. A API e o frontend não normalizam por população;
estados maiores tendem a aparecer mais no topo simplesmente por terem mais
habitantes/ocorrências possíveis. Isso não é uma falha, é uma
característica dos dados como publicados — mas é importante para não ler
"São Paulo está em primeiro" como "São Paulo é proporcionalmente o mais
afetado".

## Polaridade: nem toda alta é uma má notícia

O Sentinel.io colore a variação percentual (seta verde/vermelha) segundo a
`polaridade` do indicador, não segundo uma regra fixa de "subir é sempre
ruim":

- Indicadores do grupo **Vítimas** e **Ocorrências**: subir é desfavorável
  (vermelho), exceto **"Pessoa Localizada"** (id 21), onde subir é
  favorável (verde) — faz sentido, mais pessoas localizadas é uma boa
  notícia.
- Indicadores de **Ações Policiais**, **Apreensões** e **Serviços**: são
  tratados como neutros — a seta aparece sem cor de julgamento, porque uma
  alta em apreensões pode refletir tanto mais atividade criminosa quanto
  mais eficiência policial, e o dado sozinho não distingue as duas coisas.

Ver a tabela completa de regras em
[03 — Arquitetura do Frontend](03-FRONTEND_ARCHITECTURE.md#constantes-de-domínio-libconstantsindicatorsts).

## Limitações conhecidas

- A unidade de alguns indicadores vem marcada pela própria API como "não
  confirmado pela fonte" (ex.: `"kg (não confirmado pela fonte)"` para as
  apreensões) — o Sentinel.io exibe essa unidade tal como recebida, sem
  reinterpretar.
- Não há normalização por população, área ou qualquer outro fator — todos
  os valores exibidos são totais absolutos.
- O frontend não recalcula nada: agregação, arredondamento e regras de ano
  parcial são herdados integralmente da API (ver
  [01 — Visão do Produto](01-PRODUCT_OVERVIEW.md)).
