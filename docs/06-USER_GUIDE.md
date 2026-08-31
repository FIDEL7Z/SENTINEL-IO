# 06 — Guia do Usuário

[← Índice](README.md)

Este guia explica como usar o Sentinel.io sem nenhum conhecimento técnico.
Tudo o que é descrito aqui existe na página hoje.

## O que você vê ao abrir a página

Logo no topo, um resumo do país: de qual ano até qual ano os dados vão, se
o ano mais recente ainda está "em andamento" (dados parciais), e quantos
indicadores, estados e municípios estão cobertos.

## Como escolher um indicador

Logo abaixo do topo, há quatro cartões — cada um é um indicador diferente
(por exemplo, "Homicídio doloso" ou "Roubo de veículo"). **Clique em um
cartão** para colocá-lo em foco: o mapa, o ranking e o gráfico mais abaixo
na página passam a mostrar esse indicador.

Se o indicador que você procura não está entre os quatro em destaque, role
até a seção "Onde os registros se concentram" e use o seletor com lupa —
digite o nome do indicador para filtrar a lista, organizada por categoria.

## Como interpretar os cartões (KPIs)

Cada cartão mostra:

- O **valor total** do período mais recente comparável.
- Uma **seta e uma porcentagem** — quanto esse valor variou em relação ao
  mesmo período do ano anterior. A cor da seta importa: verde quando a
  mudança é uma boa notícia para aquele indicador, vermelho quando é uma
  má notícia. (Para indicadores neutros, como apreensões, a cor não muda —
  não existe "bom" ou "ruim" nesse caso.)
- Uma **linha fininha** (sparkline) mostrando a tendência recente sem
  precisar de eixos ou números.

## Como usar o mapa

O mapa do Brasil é colorido por intensidade: quanto mais escuro/intenso o
tom, maior o valor do indicador selecionado naquele estado, naquele ano. A
barra logo abaixo do mapa mostra a escala, do menor ao maior valor.

- **Passe o mouse sobre um estado** para ver o nome e o valor exato.
- **Clique em um estado** para fixá-lo em destaque (clique de novo para
  desmarcar).
- O ranking ao lado do mapa reage junto — passar o mouse em uma linha do
  ranking também destaca o estado correspondente no mapa.

## Como trocar o ano

Ao lado do seletor de indicador, há um controle com os anos disponíveis.
Clique em um ano para que o mapa e o ranking passem a mostrar os dados
daquele ano específico.

## Como interpretar o ranking

A lista ao lado do mapa mostra os 10 estados com maior valor para o
indicador e ano escolhidos, em ordem — o primeiro colocado tem a barra
mais longa, e os demais são proporcionais a ele.

## Como interpretar "O que mudou?"

Essa seção mostra o total anual do indicador em foco, ano após ano, com
uma seta e uma porcentagem entre cada par de anos consecutivos — a mesma
lógica de cores dos cartões (verde = boa notícia, vermelho = má notícia,
conforme o indicador). Quando o ano mais recente ainda não terminou, um
aviso abaixo explica que a comparação foi limitada aos mesmos meses em
todos os anos, para não comparar um ano inteiro com um ano pela metade.

## Como interpretar o gráfico de evolução temporal

O gráfico de área na parte de baixo da página mostra a série mês a mês do
indicador em foco, do início da série até o mês mais recente disponível.
Um trecho **tracejado, na cor âmbar**, marca o período classificado como
"ano parcial" pela fonte dos dados — ou seja, meses que ainda podem ser
atualizados. Passe o mouse sobre qualquer ponto do gráfico para ver o
valor exato daquele mês.

## O que fazer se algo não carregar

Hoje a página não mostra uma mensagem específica de erro — se um dado não
aparecer, o espaço fica em branco, com "···" ou com uma barra cinza
"piscando" indefinidamente. Se isso acontecer, a recomendação prática é
recarregar a página depois de alguns segundos. (Esse comportamento está
documentado tecnicamente em
[13 — Troubleshooting](13-TROUBLESHOOTING.md).)

## Sobre a fonte dos dados

Todos os números vêm do **Sinesp VDE**, mantido pelo Ministério da Justiça
e Segurança Pública — é a mesma informação que consta em fim de página do
site. O Sentinel.io não coleta, adiciona ou modifica dados por conta
própria: ele consulta uma API que já entrega os indicadores prontos. Antes
de tirar conclusões a partir dos números, vale ler
[07 — Interpretação dos Dados](07-DATA_INTERPRETATION.md), que explica
limitações importantes — como o que significa "dados parciais".
