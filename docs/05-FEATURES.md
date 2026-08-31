# 05 — Funcionalidades

[← Índice](README.md)

Inventário do que **realmente existe e é visível** na home page do
Sentinel.io hoje (`web/src/app/page.tsx` e sua árvore de componentes).
Nenhuma tela, botão ou fluxo abaixo é hipotético — cada um foi localizado
no código-fonte.

## Indicadores

31 indicadores oficiais, agrupados por `grupo_semantico` (Vítimas, Ações
Policiais, Ocorrências, Apreensões (Peso), Apreensões (Unidade), Serviços).
O indicador em foco é global à página (via `useFiltersStore`) e pode ser
trocado de dois lugares:

- Clicando em um dos 4 cards de destaque no topo (`IndicatorStrip`).
- Pelo seletor com busca (`IndicatorSelect`) dentro da seção de mapa.

## KPIs

Cards de indicador (`IndicatorHeadlineCard`) mostram, por indicador de
destaque: o valor do período mais recente comparável, a variação
percentual YoY (`TrendBadge`, colorida por favorável/desfavorável
conforme a polaridade do indicador) e um sparkline da série do ano
corrente.

## Comparação Year-over-Year (YoY)

`WhatChangedSection` mostra, para o indicador selecionado, o total anual
de cada ano disponível lado a lado, com a variação percentual entre anos
consecutivos. Quando o ano mais recente está incompleto, a comparação é
recortada para os mesmos meses em todos os anos (ex.: jan–jun em todos),
com aviso textual explícito disso na tela.

## Análise Temporal

`TemporalSection` — gráfico de área (Recharts) da série mensal do
indicador selecionado, do primeiro ano disponível até o mais recente. O
trecho classificado pela API como `is_partial_year: true` é desenhado com
traço tracejado e cor de destaque (âmbar), diferenciado visualmente do
histórico completo (azul). Tooltip ao passar o mouse mostra o valor exato
do mês e sinaliza "Ano parcial" quando aplicável.

## Geografia (mapa)

`BrazilMap` — mapa coroplético em SVG dos 27 estados (projeção
`geoMercator` via d3-geo sobre um GeoJSON próprio,
`lib/geo/brazil-states.json`), colorido por uma escala sequencial de 7
tons calculada por quantis dos valores retornados. Interações: hover
(tooltip com nome do estado e valor), clique (seleciona/deseleciona um
estado), teclado (cada estado é focável e tem `aria-label` com nome +
valor). O hover e a seleção são compartilhados com o ranking ao lado —
passar o mouse em um estado no mapa destaca a mesma linha no ranking, e
vice-versa.

## Ranking de UFs

`RankingList` — lista dos 10 estados com maior valor para o indicador e
ano selecionados, com barra de proporção em relação ao primeiro colocado.
Estado de carregamento com esqueleto (`animate-pulse`).

## Filtro por ano

`SegmentedControl` na seção de exploração — alterna o ano usado pelo mapa
e pelo ranking, populado dinamicamente por `GET /metadata/years`. Por
padrão, seleciona o ano mais recente disponível assim que os anos
carregam.

## Composto de apreensão de drogas

`DrugCompositeCard` — card adicional ao lado dos 4 indicadores de
destaque, somando client-side "Apreensão de Cocaína" + "Apreensão de
Maconha" (mesma unidade, kg) em um único total com variação YoY e
sparkline próprios. É o único dado **derivado** (calculado no frontend a
partir de duas respostas da API) em toda a aplicação — documentado
explicitamente como seguro no código, por não misturar `familia_medida`
diferentes.

## Cobertura nacional (hero)

O cabeçalho mostra, vindos de `GET /metadata`: o período coberto pelo
dataset (ano inicial–final, com selo "dados parciais" quando aplicável),
e os totais de indicadores/UFs/municípios cobertos.

## Existem na API mas sem tela dedicada hoje

Estes recursos **funcionam na API** (confirmado por chamada real) e têm
função pronta em `lib/api/`, mas **nenhum componente da home os
exibe**:

| Recurso | Endpoint | Situação no frontend |
|---|---|---|
| Radar de anomalias (z-score vs. média histórica) | `GET /radar` | Hook `useRadar()` existe; nenhuma tela o usa |
| Ranking de municípios | `GET /rankings/municipalities` | Função existe em `rankings.ts`; sem hook dedicado nem tela |
| Ranking por indicador dentro de um grupo semântico | `GET /rankings/indicators` | Função existe; sem hook dedicado nem tela |
| Totais por município | `GET /geography/municipalities` | Função existe; sem hook dedicado nem tela |
| Detalhe de um indicador (`GET /indicators/{id}`) | — | Função existe; não é chamada (a home usa a listagem completa) |
| Lista de UFs / abrangências / municípios (metadata) | `GET /metadata/ufs`, `/abrangencias`, `/municipalities` | `listUFs()` tem hook (`useUFOptions`); os outros dois nem hook têm — nenhum tem consumidor |

## Filtro por UF/abrangência — parcialmente construído

O store global (`store/filters.ts`) já declara `uf` e `abrangencia` com
seus setters, prontos para conectar a um filtro global — mas nenhuma UI os
usa hoje. A seleção de UF que existe (mapa/ranking) é estado local de
`ExploreSection`, não integrado a esse store nem passado para `useKpis` ou
outras chamadas que aceitariam `uf`/`abrangencia` como parâmetro. Ver
detalhes em [03 — Arquitetura do Frontend](03-FRONTEND_ARCHITECTURE.md).

## Estados de carregamento

Não há um componente de loading global — cada seção resolve por conta
própria:

| Componente | Comportamento durante carregamento |
|---|---|
| `Hero` | Texto "carregando período…" no lugar do período |
| `IndicatorHeadlineCard` / `DrugCompositeCard` | Valor mostrado como `···` |
| `BrasilEmNumeros` | 8 blocos com `···` quando não há itens ainda |
| `RankingList` | 10 barras cinzas com `animate-pulse` |
| `TemporalSection` | Área do gráfico fica vazia até haver mais de 1 ponto |
| `BrazilMap` | Estados preenchidos com a cor neutra da superfície até haver dados |

## Estados de erro

**Não existem.** Nenhum componente lê o campo `error` do SWR nem trata a
`ApiError` lançada pelo cliente HTTP. Em caso de falha da API, a interface
permanece no estado de carregamento/vazio indefinidamente, sem mensagem
para o usuário. Isso é uma lacuna real, não uma funcionalidade — listada
com essa etiqueta no roadmap do [README](../README.md).

## Responsividade

Toda a interface usa breakpoints Tailwind (`md:`, `lg:`) mobile-first:
grade de KPIs empilha em telas estreitas, o layout mapa+ranking vira uma
coluna abaixo de `lg`, e o título do hero usa unidades `vw` para escalar
com a largura da tela. Não há testes automatizados de responsividade —
essa afirmação é baseada na leitura das classes CSS, não em verificação
visual multi-dispositivo.

## Acessibilidade

Elementos interativos usam semântica e ARIA de forma pontual e
consistente onde existem: `role="img"` + `aria-label` no mapa,
`aria-pressed` nos cards de indicador, `role="listbox"`/`role="option"` +
fechamento por `Escape` no seletor de indicador, `aria-selected` no
controle segmentado, foco por teclado nos estados do mapa
(`tabIndex`, `onFocus`/`onBlur`). A animação de entrada (`fade-in`) respeita
`prefers-reduced-motion`. Isto **não é uma auditoria formal de WCAG** —
apenas o que foi encontrado lendo o código; nenhuma ferramenta de
acessibilidade foi executada contra a aplicação.
