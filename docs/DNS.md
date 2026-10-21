# DNS do marc.os.eti.br

O DNS de `os.eti.br` fica na **Cloudflare**. O site é servido pela **Vercel**; o e-mail chega pelo
**Cloudflare Email Routing** (lido no Gmail) e sai pela **Brevo**.
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
Ao ativar o Email Routing (seção 2.1), o `MX .` e o `v=spf1 -all` do raiz são substituídos
pelos da Cloudflare; o `_dmarc` (`p=reject`) continua.

## 1. Site (Vercel) — registro A próprio para o `marc`

Hoje o `marc` funciona pelo coringa `*`. Mas o coringa só cobre nomes que **não existem**: assim
que o `marc` ganhar qualquer registro (MX, TXT, ou mesmo `cv.marc`), o coringa deixa de valer
para ele e o site cai. Por isso, **antes** de configurar o e-mail, crie (sem apagar nada):

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `marc` | `216.198.79.1` | DNS only (nuvem cinza) |

> O IP é o recomendado pela Vercel (Settings → Domains → `marc.os.eti.br`). Se o painel mostrar
> outro, use o do painel. Depois de criar, o domínio deve continuar "Valid Configuration" na Vercel.

## 2. E-mail — contato@marc.os.eti.br (Cloudflare + Gmail + Brevo, grátis)

O plano gratuito do Zoho acabou, então o e-mail é montado com três peças gratuitas:

- **Receber:** Cloudflare Email Routing repassa `contato@marc.os.eti.br` para o Gmail.
- **Ler e responder:** Gmail (o ícone de envelope do site abre o Gmail).
- **Enviar:** o Gmail envia como `contato@marc.os.eti.br` pelo SMTP da Brevo (300 e-mails/dia grátis).

### 2.1 Ativar o Email Routing (Cloudflare)

A Cloudflare só permite ativar o Email Routing **primeiro no domínio raiz**; o `marc` entra
depois, em Settings → Subdomains.

1. Cloudflare → `os.eti.br` → **Email → Email Routing → Get started / Enable**.
2. O assistente quer criar no **raiz** os MX `route1/2/3.mx.cloudflare.net` e um SPF, e vai
   apontar conflito com o `MX .` e o `v=spf1 -all`. **Permita** que ele substitua esses dois.
   **Mantenha** o `_dmarc` (`p=reject`): ele continua impedindo falsificação de `@os.eti.br`.
3. Em **Destination addresses**, adicione o seu Gmail e confirme pelo link que chega nele.
4. Em **Settings → Subdomains**, adicione `marc`. A Cloudflare cria sozinha os MX, o SPF
   (`v=spf1 include:_spf.mx.cloudflare.net ~all`) e o DKIM de encaminhamento no `marc`.
5. Em **Routing rules → Create address**: `contato` @ `marc.os.eti.br` → **Send to an email** → seu Gmail.
6. No raiz, deixe **sem regras** e o **catch-all desativado**: e-mail para `@os.eti.br` é recusado.
7. Teste: de **outra** conta (não o próprio Gmail), mande para `contato@marc.os.eti.br`.
   Deve chegar no Gmail (olhe também o spam na primeira vez).

### 2.2 DMARC próprio do `marc`

| Tipo | Nome | Conteúdo |
|---|---|---|
| TXT | `_dmarc.marc` | `v=DMARC1; p=none; rua=mailto:contato@marc.os.eti.br` |

Sem ele, o `marc` herda o `p=reject` do raiz, e qualquer erro de configuração faria seus
e-mails serem recusados. Depois que tudo funcionar por umas semanas, dá para subir para `p=quarantine`.

### 2.3 Autenticar o domínio na Brevo

1. Crie a conta grátis em **brevo.com** (pode pôr "Pessoal" como empresa).
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain** → `marc.os.eti.br`
   → autenticar manualmente ("Authenticate the domain yourself").
3. Crie na Cloudflare os registros que a Brevo mostrar (os valores são gerados por conta):
   - **TXT** `marc` com `brevo-code:...`
   - **DKIM**: em geral 2 **CNAME** (`brevo1._domainkey.marc` e `brevo2._domainkey.marc`),
     nuvem cinza. Contas mais antigas recebem um TXT `mail._domainkey.marc`.
   - **DMARC**: já existe (2.2) — não crie outro.
   - **SPF**: se a Brevo pedir um `include`, **edite** o SPF existente do `marc` em vez de criar
     outro (só pode haver **um** `v=spf1` por nome), por exemplo:
     `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all`
4. Clique em **Authenticate** na Brevo até tudo ficar verde.
5. **Senders → Add a sender**: nome "Marcos Guimarães", e-mail `contato@marc.os.eti.br`.
   O código de confirmação chega no Gmail pelo Email Routing.

### 2.4 Chave SMTP da Brevo

**SMTP & API → SMTP → Generate a new SMTP key**. Anote:

- **Servidor:** `smtp-relay.brevo.com` · **Porta:** `587`
- **Login:** o "SMTP login" mostrado na página (não é o seu e-mail; algo como `xxxx@smtp-brevo.com`)
- **Senha:** a SMTP key gerada (aparece uma vez só — guarde num gerenciador de senhas)

### 2.5 "Enviar como" no Gmail

1. Gmail → engrenagem → **Ver todas as configurações → Contas e importação →
   Enviar e-mail como → Adicionar outro endereço de e-mail**.
2. Nome: `Marcos Guimarães` · E-mail: `contato@marc.os.eti.br` · deixe "Tratar como alias" marcado.
3. Servidor SMTP `smtp-relay.brevo.com`, porta `587`, login e senha do passo 2.4,
   **Conexão segura com TLS**.
4. O Gmail manda um código para `contato@marc.os.eti.br` (chega no próprio Gmail) → confirme.
5. Em "Enviar e-mail como", marque **"Responder do mesmo endereço para o qual a mensagem foi enviada"**.

### 2.6 Testar

1. De outra conta, mande um e-mail para `contato@marc.os.eti.br` → chega no Gmail.
2. Responda pelo Gmail com o remetente `contato@marc.os.eti.br`.
3. Na conta que recebeu a resposta (se for Gmail: ⋮ → **Mostrar original**), confira
   `DKIM: PASS` (com `marc.os.eti.br`) e `DMARC: PASS`. O SPF pode aparecer como do domínio
   da Brevo — normal; o DMARC passa pelo DKIM.

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
