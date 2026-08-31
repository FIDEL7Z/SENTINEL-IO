# 11 — CORS

[← Índice](README.md)

## O que é CORS, em uma frase

CORS (Cross-Origin Resource Sharing) é o mecanismo do navegador que decide
se JavaScript rodando em `https://sentinel-io-delta.vercel.app` tem
permissão de ler a resposta de uma chamada `fetch` feita para
`https://sentinel-api-sjie.onrender.com` — um domínio diferente. Por
padrão, o navegador **bloqueia** essa leitura, a menos que o servidor
(a API) responda explicitamente autorizando aquela origem.

## Por que isso importa aqui especificamente

Como documentado em
[02 — Arquitetura do Produto](02-PRODUCT_ARCHITECTURE.md#onde-a-busca-de-dados-acontece-no-navegador-não-no-servidor),
**todo fetch de dado no Sentinel.io acontece no navegador do usuário**, não
em um servidor Next.js. Isso significa que CORS não é um detalhe
opcional — sem a origem correta liberada na API, a home page carrega o HTML
normalmente, mas **nenhum dado aparece**, porque cada chamada à API é
rejeitada pelo navegador antes mesmo de chegar ao componente.

## Origens confirmadas na allowlist (30/08/2026)

Testado enviando o header `Origin` diretamente contra
`https://sentinel-api-sjie.onrender.com` e observando se a resposta traz
`Access-Control-Allow-Origin`:

| Origem | Permitida? |
|---|---|
| `http://localhost:3000` | ✅ Sim |
| `https://sentinel-io.vercel.app` | ✅ Sim |
| `https://sentinel-io-delta.vercel.app` (domínio de produção atual) | ✅ Sim |
| Qualquer preview deployment da Vercel (ex.: `sentinel-io-git-main.vercel.app`, ou um domínio com hash aleatório) | ❌ Não |
| Um domínio customizado hipotético (ex.: `sentinel.io`) | ❌ Não |
| Qualquer outra origem não listada acima | ❌ Não |

É uma **allowlist explícita e exata** — não é um wildcard (`*`) nem um
padrão de regex que aceite qualquer subdomínio `*.vercel.app`. Confirmado
testando múltiplas variações de subdomínio Vercel plausíveis e observando
que só as três origens acima passam.

## Por que a configuração foi necessária

Sem essa allowlist, ou com ela mal configurada, o navegador bloqueia as
respostas da API mesmo que a API tenha processado a requisição
corretamente (o request chega, é respondido com `200`, mas o
JavaScript no navegador nunca recebe o corpo da resposta) — o sintoma na
prática é indistinguível de "a API não respondeu", mas a causa raiz é
outra. Ver diagnóstico em
[13 — Troubleshooting](13-TROUBLESHOOTING.md#cors-bloqueando-o-frontend).

## Como adicionar um novo domínio à allowlist

A allowlist é configuração **do lado da API** (Render), não do frontend.
O Sentinel.io não tem, e não deveria ter, nenhum mecanismo para contornar
CORS no lado do cliente — não é possível "liberar CORS pelo frontend" de
forma legítima, e usar um wildcard (`*`) do lado do servidor junto com
`Access-Control-Allow-Credentials: true` (que a API já envia) sequer é uma
combinação válida no protocolo CORS.

Passos para adicionar um domínio novo (ex.: um domínio customizado de
produção, ou o padrão de preview deployments da Vercel):

1. Identificar o valor exato da origem que precisa ser liberada — o
   esquema + host, sem path (ex.: `https://sentinel.io`, não
   `https://sentinel.io/` nem `https://sentinel.io/home`).
2. Adicionar essa origem à configuração de CORS da API no Render (a
   variável/lista específica não pôde ser confirmada nesta auditoria, já
   que o código-fonte da API está fora deste repositório — mas o padrão
   observado na resposta, `access-control-allow-origin` refletindo uma
   origem de uma lista fixa, é consistente com uma configuração de
   `CORSMiddleware` do FastAPI com `allow_origins` explícito).
3. Redeployar a API no Render para a mudança ter efeito.
4. Validar (ver seção abaixo).

## Como testar/diagnosticar um problema de CORS

**No navegador**, com a aplicação aberta:

1. Abrir o DevTools → aba Console.
2. Um erro de CORS aparece como algo como: `Access to fetch at
   'https://sentinel-api-sjie.onrender.com/api/v1/...' from origin
   'https://...' has been blocked by CORS policy: No
   'Access-Control-Allow-Origin' header is present on the requested
   resource.`
3. Na aba Network, a requisição aparece como feita (status pode até
   mostrar `200`), mas o navegador impede o JavaScript de ler a resposta —
   por isso o dado nunca chega ao componente.

**Por linha de comando**, sem precisar abrir um navegador — simulando a
origem que o navegador enviaria:

```bash
curl -s -i "https://sentinel-api-sjie.onrender.com/api/v1/health" \
  -H "Origin: https://SEU-DOMINIO-AQUI" \
  | grep -i "access-control-allow-origin"
```

- Se a linha `access-control-allow-origin: https://SEU-DOMINIO-AQUI`
  aparecer no resultado, a origem está liberada.
- Se nada aparecer, a origem não está na allowlist — é necessário
  adicioná-la do lado da API (Render), conforme os passos acima.
