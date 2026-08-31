# 09 — Variáveis de Ambiente

[← Índice](README.md)

## A única variável do projeto

```
NEXT_PUBLIC_API_BASE_URL
```

Lida em um único lugar do código, `web/src/lib/api/client.ts:3-4`:

```ts
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
```

Não existe `NEXT_PUBLIC_API_URL` em nenhum lugar do código — se essa
variável (com esse nome) for definida em algum ambiente, ela é
simplesmente ignorada, e o app cai no valor de `NEXT_PUBLIC_API_BASE_URL`
ou no fallback.

A variável **precisa incluir o prefixo `/api/v1`** — todo path de recurso
(`/indicators`, `/kpis`, etc.) é concatenado diretamente a ela em
`apiGet()`.

## Valores por ambiente

| Ambiente | Valor | Onde está configurado |
|---|---|---|
| Desenvolvimento local | `http://localhost:8000/api/v1` | `web/.env.local` (git-ignored) — é também o valor de fallback embutido no código |
| Produção (Vercel) | `https://sentinel-api-sjie.onrender.com/api/v1` | Environment Variables do projeto na Vercel (confirmado indiretamente: o bundle JS publicado em `sentinel-io-delta.vercel.app` contém a string `onrender.com/api/v1`) |
| Preview (Vercel) | **Não confirmado** — depende de como a variável foi escopada no painel da Vercel (Production / Preview / Development) | Não verificável sem acesso ao painel |

Um template documentando os dois valores está em `web/.env.example`
(versionado no repositório — a única exceção ao `.env*` do
`.gitignore`).

## Por que build-time importa no Next.js

`NEXT_PUBLIC_*` é o prefixo que o Next.js usa para decidir quais
variáveis de ambiente ficam **embutidas no bundle JavaScript enviado ao
navegador** — ao contrário de uma variável de servidor, que só existe em
runtime. Isso é inlining literal de texto durante `next build`: o valor
vira uma constante no código compilado, não uma leitura dinâmica.

Duas consequências práticas:

1. **A variável precisa existir antes do `next build` rodar.** Definir ou
   alterar `NEXT_PUBLIC_API_BASE_URL` depois que o build já aconteceu não
   tem efeito nenhum — é preciso rebuildar (o que, na Vercel, normalmente
   significa: mudar a variável no painel e disparar um novo deploy).
2. **Cada deploy "trava" o valor que estava presente no momento do build
   daquele deploy.** Se o valor mudar no painel da Vercel mas nenhum novo
   deploy for disparado, o site em produção continua servindo o valor
   antigo.

## Comportamento do fallback

Se `NEXT_PUBLIC_API_BASE_URL` estiver ausente em qualquer ambiente —
inclusive em produção, por erro de configuração — o app usa
silenciosamente `http://localhost:8000/api/v1`. Em produção isso resulta
em toda chamada de API falhando (o navegador do usuário tentaria acessar
`localhost:8000`, que não existe para ele), sem nenhum aviso na tela — ver
[13 — Troubleshooting](13-TROUBLESHOOTING.md#frontend-usando-localhost-em-produção).

## Não é secreto

`NEXT_PUBLIC_API_BASE_URL` aponta para uma API pública e somente leitura —
não é um segredo, uma chave ou uma credencial. Ela pode (e deve) ficar
visível em `.env.example` e no bundle JS público sem risco de segurança.
