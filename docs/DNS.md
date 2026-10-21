# DNS do marc.os.eti.br

O DNS de `os.eti.br` fica na **Cloudflare**. O site é servido pela **Vercel** e o e-mail pelo **Zoho Mail**.
Na Cloudflare, o campo "Nome" é relativo à zona `os.eti.br` (ex.: `marc` = `marc.os.eti.br`).

## 0. Estado atual da zona (não mexer)

| Tipo | Nome | Conteúdo | Para quê |
|---|---|---|---|
| CNAME | `*` | `cname.vercel-dns.com` | Coringa: todo subdomínio sem registro próprio vai para a Vercel |
| CNAME | `os.eti.br` | `cname.vercel-dns.com` | Domínio raiz (redireciona para `marc`) |
| CNAME | `opi-api` | `sime-api.onrender.com` | OPI API na Render |
| MX | `os.eti.br` | `.` | "Null MX": `@os.eti.br` não recebe e-mail |
| TXT | `os.eti.br` | `v=spf1 -all` | `@os.eti.br` não envia e-mail |
| TXT | `_dmarc` | `v=DMARC1; p=reject;` | Rejeita quem tentar falsificar `@os.eti.br` |

Os três últimos protegem o domínio raiz contra falsificação e **valem só para `@os.eti.br`**.
O `marc` recebe registros próprios de e-mail, que têm prioridade para esse nome.

## 1. Site (Vercel) — registro A próprio para o `marc`

Hoje o `marc` funciona pelo coringa `*`. Mas o coringa só cobre nomes que **não existem**: assim
que o `marc` ganhar qualquer registro (MX, TXT, ou mesmo `cv.marc`), o coringa deixa de valer
para ele e o site cai. Por isso, **antes** de configurar o e-mail, crie (sem apagar nada):

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `marc` | `216.198.79.1` | DNS only (nuvem cinza) |

> O IP é o recomendado pela Vercel (Settings → Domains → `marc.os.eti.br`). Se o painel mostrar
> outro, use o do painel. Depois de criar, o domínio deve continuar "Valid Configuration" na Vercel.

## 2. E-mail (Zoho Mail) — contato@marc.os.eti.br

1. Crie a conta no Zoho Mail (plano Forever Free) e adicione o domínio `marc.os.eti.br`.
2. Crie os registros abaixo. **Os valores do painel do Zoho têm prioridade** (o código de
   verificação e a chave DKIM são gerados lá).

| Tipo | Nome | Conteúdo | Prioridade |
|---|---|---|---|
| TXT | `marc` | `zoho-verification=zb________.zmverify.zoho.com` (copiar do Zoho) | |
| MX | `marc` | `mx.zoho.com` | 10 |
| MX | `marc` | `mx2.zoho.com` | 20 |
| MX | `marc` | `mx3.zoho.com` | 50 |
| TXT | `marc` | `v=spf1 include:zohomail.com ~all` | |
| TXT | `<seletor>._domainkey.marc` | chave DKIM gerada no Zoho | |
| TXT | `_dmarc.marc` | `v=DMARC1; p=none; rua=mailto:contato@marc.os.eti.br` | |

3. Crie o usuário `contato`. O login fica em https://mail.zoho.com (ícone de envelope no topo do site).
4. Teste: mande um e-mail de outra conta para `contato@marc.os.eti.br` e responda de volta.
   No Gmail, "Mostrar original" deve indicar `SPF: PASS`, `DKIM: PASS` e `DMARC: PASS`.

> Se o Zoho colocar sua conta no datacenter da Europa ou da Índia, os MX mudam
> (ex.: `mx.zoho.eu`). Use sempre os que o painel mostrar.

## 3. Currículo no DNS

Easter egg: um currículo consultável pelo terminal.

```bash
dig TXT cv.marc.os.eti.br +short
nslookup -q=TXT cv.marc.os.eti.br   # Windows
```

Cada linha é um registro TXT separado (o DNS não garante a ordem de vários TXT no mesmo
nome, por isso cada assunto tem o seu). Regras: no máximo 255 caracteres por registro e
**sem acentos** — o `dig` exibe acento como `\195\163`.

| Tipo | Nome | Conteúdo |
|---|---|---|
| TXT | `cv.marc` | `Marcos Guimaraes \| Desenvolvedor Front-end (Angular + TypeScript) \| Sao Goncalo, RJ - aberto a remoto \| Mais: dig TXT {contato,projetos,stack,xp}.cv.marc.os.eti.br +short` |
| TXT | `contato.cv.marc` | `contato@marc.os.eti.br \| https://marc.os.eti.br \| linkedin.com/in/marcosgmrs \| github.com/marcosgmrs` |
| TXT | `projetos.cv.marc` | `OPI-RJ opi-rj.os.eti.br \| OPI API opi-api.os.eti.br \| SIME sime.os.eti.br \| Vibe Coding vibecoding.os.eti.br \| aprenda-angular.os.eti.br \| mineralogia.os.eti.br` |
| TXT | `stack.cv.marc` | `Dia a dia: HTML, CSS, JavaScript, TypeScript, Angular, RxJS, Git \| Primeiros passos: React, Vite, Leaflet, Python, FastAPI \| Infra: Windows, Linux, redes, manutencao de PCs` |
| TXT | `xp.cv.marc` | `2026- Suporte Tecnico SEIJES-RJ \| 2023-26 Suporte Tecnico SEPPENRJ \| 2022-23 Instrutor de Sistemas, Esc. Tec. San Marino \| 2022 Instrutor, Onyou \| Tecnico em Processamento de Dados` |

> Na tabela acima o `|` aparece como `\|` só por causa do Markdown. Na Cloudflare, cole
> com `|` normal e **sem aspas** (ela adiciona as aspas sozinha).

Quando mudar projetos ou experiência no site, lembre de atualizar estes registros também.
