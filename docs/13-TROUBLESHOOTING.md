# 13 — Troubleshooting

[← Índice](README.md)

Cada item segue: Sintoma → Possível causa → Diagnóstico → Solução.

## API não responde

**Sintoma**: todas as seções da home ficam presas em carregamento (`···`,
esqueletos pulsando) indefinidamente; nenhum erro visível na tela.

**Possível causa**: a API caiu, está em cold start (ver
[Render em cold start](#render-em-cold-start)), ou `NEXT_PUBLIC_API_BASE_URL`
aponta para um endereço que não existe/não responde.

**Diagnóstico**:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sentinel-api-sjie.onrender.com/api/v1/health
```
Também vale checar o DevTools → Network do navegador: as chamadas para
`/api/v1/*` aparecem como `pending`/`failed`/`(canceled)`?

**Solução**: se o `curl` acima não retornar `200`, o problema é na API
(fora deste repositório) — aguardar/reportar. Se retornar `200` mas o
frontend continua sem dados, o problema é de configuração local
(variável errada) ou CORS — ver os itens específicos abaixo.

## CORS bloqueando o frontend

**Sintoma**: Network mostra as chamadas com status (às vezes `200`), mas
Console mostra erro de CORS; nenhum dado aparece na tela.

**Possível causa**: a origem atual (o domínio/porta que você está
acessando) não está na allowlist da API.

**Diagnóstico**: ver o passo a passo completo em
[11 — CORS](11-CORS.md#como-testardiagnosticar-um-problema-de-cors).

**Solução**: adicionar a origem à allowlist do lado da API (Render) — não
há solução do lado do frontend. Se estiver testando localmente, confirmar
que está rodando exatamente em `http://localhost:3000` (a única porta
local confirmada na allowlist).

## `NEXT_PUBLIC_API_BASE_URL` não aplicada

**Sintoma**: a variável foi alterada (no `.env.local` ou no painel da
Vercel), mas o comportamento do app não muda.

**Possível causa**: como é uma variável `NEXT_PUBLIC_*`, ela é embutida no
bundle **no momento do build** — mudá-la depois do build não tem efeito.
Ver [09 — Variáveis de Ambiente](09-ENVIRONMENT.md#por-que-build-time-importa-no-nextjs).

**Diagnóstico**: localmente, isso normalmente significa que o servidor de
dev não foi reiniciado depois de editar `.env.local`. Em produção,
significa que nenhum novo deploy foi disparado depois de mudar a variável
no painel da Vercel.

**Solução**: localmente, parar e rodar `npm run dev` de novo. Em produção,
disparar um novo build/deploy na Vercel depois de alterar a variável — só
mudar o valor no painel não é suficiente.

## Frontend usando localhost em produção

**Sintoma**: em produção, o Network do navegador mostra chamadas para
`localhost:8000` (que falham, porque não existe no ambiente do usuário).

**Possível causa**: `NEXT_PUBLIC_API_BASE_URL` não estava definida (ou
estava vazia) no ambiente da Vercel no momento do build daquele deploy
específico — o código caiu no fallback embutido em
`web/src/lib/api/client.ts`.

**Diagnóstico**: inspecionar o bundle JS publicado buscando por
`onrender.com` (deveria estar presente) ou `localhost:8000` (não deveria):
```bash
curl -s "https://SEU-DOMINIO/_next/static/immutable/chunks/<algum-chunk>.js" | grep -o "onrender[^\"']*\|localhost:8000[^\"']*"
```

**Solução**: confirmar a variável no painel da Vercel para o ambiente
correto (Production/Preview) e disparar um novo deploy.

## Render em cold start

**Sintoma**: a primeira chamada à API depois de um tempo sem uso demora
vários segundos (às vezes 20-30s+) antes de responder; chamadas
subsequentes são rápidas.

**Possível causa**: planos gratuitos/baixo custo do Render hibernam o
serviço depois de um período de inatividade e levam alguns segundos para
"acordar" na primeira requisição. **Não confirmado** nesta auditoria se o
plano atual da API sofre desse comportamento — não há acesso ao painel do
Render — mas é o padrão conhecido da plataforma para os planos não-sempre-ativos.

**Diagnóstico**: comparar o tempo da primeira chamada do dia com chamadas
subsequentes (`curl -w "%{time_total}\n"`).

**Solução**: nenhuma do lado do frontend — é uma característica do plano
de hospedagem da API. Se for um problema recorrente para os usuários,
avaliar um plano do Render sem hibernação (decisão de infraestrutura, fora
do escopo deste repositório).

## Dados não aparecem no dashboard

**Sintoma**: página carrega, layout aparece normal, mas os valores nunca
chegam (permanecem em `···` ou esqueleto).

**Possível causa**: qualquer uma das anteriores (API fora do ar, CORS,
variável de ambiente incorreta) — como não há tratamento de erro visível
(ver [05 — Funcionalidades](05-FEATURES.md#estados-de-erro)), os sintomas
de causas diferentes são visualmente idênticos.

**Diagnóstico**: sempre começar pelo Console e pela aba Network do
DevTools — é o único lugar onde a causa real aparece hoje, já que a UI não
distingue os cenários.

**Solução**: seguir a árvore de diagnóstico acima conforme o que aparecer
no Console/Network.

## Deploy da Vercel funcionando mas API falhando

**Sintoma**: o site abre normalmente (HTML, CSS, layout ok), mas nenhuma
seção populada com dado real.

**Possível causa**: o build da Vercel em si funcionou (por isso o site
"funciona" no sentido de abrir) — o problema está inteiramente na camada
de comunicação com a API: variável de ambiente incorreta no momento do
build, CORS, ou a API estar fora do ar. Esse é exatamente o cenário onde
"o frontend está pronto" e "os dados aparecem" são coisas diferentes.

**Diagnóstico**: seguir, em ordem: (1) a API responde `/health` com
`200`? (2) o bundle publicado contém a URL correta da API? (3) a origem do
domínio atual está na allowlist de CORS?

**Solução**: depende de qual das três perguntas acima falhou — ver os
itens específicos correspondentes neste documento.
