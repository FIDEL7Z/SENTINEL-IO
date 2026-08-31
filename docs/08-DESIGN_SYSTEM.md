# 08 — Design System

[← Índice](README.md)

Este documento descreve o sistema visual **exatamente como implementado**
em `web/src/app/globals.css` e nos componentes de `web/src/components/ui/`
— não propõe um sistema novo.

## Identidade visual

A interface é **exclusivamente escura** — `color-scheme: dark` é fixo no
`:root`, sem media query de `prefers-color-scheme` e sem alternância
claro/escuro em nenhum componente. Não há tema claro implementado.

## Paleta de cores (`globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-page` | `#0a0a0b` | Fundo da página |
| `--color-surface` | `#101114` | Fundo de cards |
| `--color-surface-raised` | `#16171b` | Fundo de elementos elevados (tooltip, dropdown) |
| `--color-border` / `--color-border-strong` | `rgba(255,255,255,.08)` / `.16` | Divisórias |
| `--color-ink` / `-secondary` / `-muted` | `#f5f4f0` / `#a3a19a` / `#6b6963` | Texto, em 3 níveis de ênfase |
| `--color-accent` | `#e8a33d` (âmbar) | Cor de marca — usada só como *chrome* (destaque de UI), nunca para codificar dado |
| `--color-accent-ink` | `#1a1206` | Texto sobre fundo `accent` |
| `--color-seq-0`…`--color-seq-6` | Rampa de azuis, do escuro ao claro | Escala sequencial de magnitude (mapa, gráfico) |
| `--color-good` / `--color-warning` / `--color-serious` / `--color-critical` | Verde / âmbar / laranja / vermelho | Estados fixos, nunca "tematizados" |

A rampa sequencial (`--color-seq-0` a `-6`, 7 tons) é a mesma usada no mapa
coroplético (`SEQUENTIAL_RAMP` em `lib/utils/colorScale.ts`) e não tem
relação com a cor de marca — uma decisão explícita registrada em
comentário no próprio CSS ("chrome only, never a data-encoding hue").

## Tipografia

Três famílias, carregadas via `next/font/google` em `layout.tsx`:

| Token | Fonte | Uso |
|---|---|---|
| `--font-display` | Space Grotesk (500/600/700) | Títulos, números grandes (KPIs) |
| `--font-sans` | Inter (400/500/600) | Corpo de texto |
| `--font-mono` | IBM Plex Mono (400/500) | Rótulos, valores tabulares, "eyebrows" em maiúsculas |

Números que precisam alinhar em colunas usam a classe utilitária
`.tabular` (`font-variant-numeric: tabular-nums`).

## Componentes de UI (`components/ui/`)

| Componente | Papel |
|---|---|
| `Container` | Largura máxima (`1400px`) + padding horizontal responsivo — envelope de toda seção |
| `SectionHeading` | Padrão de cabeçalho de seção: eyebrow (mono, âmbar, maiúsculas) + título (display) + descrição opcional |
| `SegmentedControl` | Grupo de botões estilo "abas" (`role="tablist"`), usado no seletor de ano |
| `Sparkline` | Mini-gráfico de linha em SVG puro (sem biblioteca externa), com gradiente de área e ponto final destacado |
| `TrendBadge` | Seta + percentual colorido por favorável/desfavorável/neutro, conforme a `Polarity` do indicador |

## Cards e blocos de dado

Cards de indicador (`IndicatorHeadlineCard`, `DrugCompositeCard`) seguem
um padrão consistente: borda + fundo `surface`, rótulo mono em maiúsculas
no topo, valor grande em `font-display`, badge de tendência + sparkline
lado a lado, rodapé mono com o período comparado. O card selecionado troca
para borda/fundo `accent` (`border-accent/50 bg-accent-dim`).

## Gráficos

- **Mapa** (`BrazilMap`): SVG customizado com `d3-geo` (projeção
  `geoMercator`), sem biblioteca de mapas — os estados são `<path>`
  desenhados a partir de um GeoJSON próprio.
- **Gráfico temporal** (`TemporalSection`): Recharts (`AreaChart`), com
  gradiente de preenchimento, `ReferenceArea` para marcar o trecho parcial
  e tooltip customizado — nenhum elemento de UI padrão do Recharts é usado
  sem restyling (cores, fontes e grid vêm todos dos tokens do design
  system via CSS custom properties).

## Tabelas / listas

`RankingList` não usa `<table>` — é uma lista ordenada (`<ol>`) com barra
de proporção em CSS (`width: {pct}%`), rank, sigla da UF e valor alinhado
à direita.

## Responsividade

Mobile-first via classes Tailwind (`md:`, `lg:`). Pontos notáveis:

- Título do hero usa unidades `vw` (`text-[13vw] md:text-[7.5vw]
  lg:text-[6.5rem]`) para escalar continuamente com a largura da tela.
- Layout mapa + ranking (`ExploreSection`) é uma coluna única abaixo de
  `lg`, e vira grade `3fr / 2fr` a partir de `lg`.
- Grade de "Brasil em números" é 2 colunas em telas estreitas, 4 a partir
  de `md`.

## Estados de interface

| Estado | Como é resolvido hoje |
|---|---|
| Carregamento | Resolvido por componente — texto placeholder (`···`, "carregando período…") ou esqueleto `animate-pulse`. Não há um spinner ou componente de loading compartilhado. |
| Vazio | Confundido com o estado de carregamento na maioria dos componentes — ex.: `BrasilEmNumeros` mostra os mesmos 8 blocos `···` tanto durante o carregamento quanto se a API retornar zero itens. |
| Erro | **Não implementado.** Nenhum componente lê o `error` do SWR. Ver [05 — Funcionalidades](05-FEATURES.md). |
| Hover/seleção | Compartilhado entre mapa e ranking via props (`hoveredUF`/`selectedUF`) geridos em `ExploreSection`. |
| Foco (teclado) | Os `<path>` do mapa são focáveis (`tabIndex={0}`) e reagem a `onFocus`/`onBlur` como se fossem hover — mas não têm um anel de foco visual customizado além do outline padrão do navegador. |

## Movimento

Uma única animação, `.fade-in` (opacidade + leve translação, 0.5s),
usada nos elementos do Hero — condicionada a
`@media (prefers-reduced-motion: no-preference)`, ou seja, é
automaticamente desativada para usuários que pedem menos movimento no
sistema operacional.

## Acessibilidade — o que existe, sem alegar mais do que isso

Ver a seção "Acessibilidade" em
[05 — Funcionalidades](05-FEATURES.md) para o inventário completo de
`aria-*`/`role` encontrados no código. Resumo: uso pontual e correto onde
existe (mapa, seletor, controles), mas **sem auditoria formal de
contraste, navegação por teclado end-to-end ou leitor de tela** — nenhuma
ferramenta desse tipo foi executada contra o projeto.

## Assets não utilizados

`web/public/` contém os SVGs padrão gerados pelo `create-next-app`
(`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — nenhum
é referenciado por nenhum componente. São resíduos do template inicial do
projeto, não fazem parte da identidade visual do produto.
