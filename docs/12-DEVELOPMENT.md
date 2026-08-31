# 12 — Desenvolvimento Local

[← Índice](README.md)

## Pré-requisitos

- **Node.js 18.18+** (requisito do Next.js 16) e npm.
- **Git**.

Não há Docker, Python ou banco de dados no escopo deste repositório — o
Sentinel.io é só o frontend; ele consome uma API já publicada.

## Instalação

```bash
cd web
npm install
```

Confirmado em `web/package.json`: dependências de produção são `clsx`,
`d3-geo`, `next`, `react`, `react-dom`, `recharts`, `swr`, `zustand`; sem
nenhuma dependência de backend, banco ou ORM.

## Configurar a variável de ambiente

Crie/edite `web/.env.local` (git-ignored — cada desenvolvedor tem o seu):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Esse é também o valor de fallback embutido no código — ou seja, mesmo sem
criar o arquivo, o app tenta `localhost:8000/api/v1` por padrão. Um
template com os valores de dev e produção está em `web/.env.example`.
Detalhes completos em
[09 — Variáveis de Ambiente](09-ENVIRONMENT.md).

### Rodando contra a API local (`localhost:8000`)

Isso pressupõe que exista, rodando à parte, uma instância da Sentinel.io
Analytics API respondendo em `localhost:8000` — esse serviço não faz parte
deste repositório. Sem ela, o app carrega normalmente, mas nenhuma seção
que depende de dados populará (ver
[13 — Troubleshooting](13-TROUBLESHOOTING.md#api-não-responde)).

### Rodando contra a API de produção, localmente

Para testar a UI localmente com dados reais, sem precisar de uma API local,
aponte `NEXT_PUBLIC_API_BASE_URL` para o Render:

```bash
NEXT_PUBLIC_API_BASE_URL=https://sentinel-api-sjie.onrender.com/api/v1
```

Isso funciona porque `http://localhost:3000` já está na allowlist de CORS
da API de produção (ver [11 — CORS](11-CORS.md)) — mas só na porta 3000
especificamente; rodar em outra porta (`next dev -p 3001`, por exemplo)
faria as chamadas serem bloqueadas por CORS.

## Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Inicia o Next.js com Turbopack em `http://localhost:3000`. Hot reload é
automático — confirmado rodando localmente (`✓ Ready in ~1s`).

## Outros scripts (`package.json`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção (`next build`) |
| `npm run start` | Serve o build de produção (`next start`) |
| `npm run lint` | ESLint (`eslint-config-next`) |

Não existe `npm test` nem qualquer framework de testes configurado no
projeto — nenhuma dependência de teste aparece em
`package.json`.

## Estrutura para se orientar

Ver a árvore completa em
[03 — Arquitetura do Frontend](03-FRONTEND_ARCHITECTURE.md#estrutura-de-diretórios-websrc).
