# Documentação — Sentinel.io

Esta é a documentação oficial do **Sentinel.io**, o frontend público de
visualização de dados de segurança pública do Brasil.

**Escopo desta documentação**: o produto Sentinel.io — o código deste
repositório (`web/`) — e o seu contrato de integração com a **Sentinel.io
Analytics API**, a API REST pública que ele consome. Esta documentação
**não** cobre o funcionamento interno do backend/pipeline de dados (ATLAS —
Public Safety Analytics Platform); esse é um sistema publicado
separadamente, e tudo o que sabemos sobre ele aqui vem exclusivamente do que
a API expõe publicamente (OpenAPI, `/health`, respostas reais dos
endpoints) — nunca do código-fonte do ATLAS, que não faz parte deste
repositório.

Toda informação técnica aqui foi validada contra o código-fonte real em
`web/src/` e contra chamadas reais à API de produção
(`https://sentinel-api-sjie.onrender.com`) — não contra documentação antiga
ou suposições de arquitetura.

## Índice

| Documento | Conteúdo |
|---|---|
| [01 — Visão do Produto](01-PRODUCT_OVERVIEW.md) | O que é o Sentinel.io, problema, público-alvo, proposta de valor |
| [02 — Arquitetura do Produto](02-PRODUCT_ARCHITECTURE.md) | Arquitetura ponta a ponta, diagramas Mermaid, separação frontend/backend |
| [03 — Arquitetura do Frontend](03-FRONTEND_ARCHITECTURE.md) | Estrutura de pastas, componentes, hooks, estado, tipos |
| [04 — Integração com a API](04-API_INTEGRATION.md) | Todos os módulos de API, endpoints consumidos, parâmetros, componentes consumidores |
| [05 — Funcionalidades](05-FEATURES.md) | Inventário real de funcionalidades implementadas |
| [06 — Guia do Usuário](06-USER_GUIDE.md) | Como navegar e interpretar o dashboard, para público não técnico |
| [07 — Interpretação dos Dados](07-DATA_INTERPRETATION.md) | Período coberto, dados parciais, limitações, como não ler os números errado |
| [08 — Design System](08-DESIGN_SYSTEM.md) | Identidade visual, tipografia, cores, componentes de UI, estados |
| [09 — Variáveis de Ambiente](09-ENVIRONMENT.md) | `NEXT_PUBLIC_API_BASE_URL` em detalhe — dev, preview, produção |
| [10 — Deploy](10-DEPLOYMENT.md) | Deploy real na Vercel, build, variáveis, domínios |
| [11 — CORS](11-CORS.md) | Allowlist real da API, como adicionar uma origem, como diagnosticar bloqueios |
| [12 — Desenvolvimento Local](12-DEVELOPMENT.md) | Como rodar o projeto localmente |
| [13 — Troubleshooting](13-TROUBLESHOOTING.md) | Problemas reais e como diagnosticá-los |

O [README.md](../README.md) na raiz do repositório é o ponto de entrada
rápido (setup, stack, links). Esta pasta é a referência completa.

## Convenções usadas

- **Não confirmado**: usado sempre que um dado não pôde ser verificado
  diretamente no código ou na API ao momento da auditoria (30/08/2026).
  Nunca é substituído por um número inventado.
- Exemplos de request/response são extraídos de chamadas reais feitas
  contra `https://sentinel-api-sjie.onrender.com` durante a auditoria, não
  de exemplos hipotéticos.
- Segredos, tokens e credenciais nunca aparecem nestes documentos —
  `NEXT_PUBLIC_API_BASE_URL` é uma URL pública, não um segredo.
