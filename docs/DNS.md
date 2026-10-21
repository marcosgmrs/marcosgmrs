# DNS do marc.os.eti.br

O DNS de `os.eti.br` fica na **Cloudflare**. O site é servido pela **Vercel**; o e-mail chega pelo
**Cloudflare Email Routing** e é lido e enviado pelo **Gmail**.
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

## 2. E-mail — contato@marc.os.eti.br (Cloudflare recebe, Gmail envia)

O plano gratuito do Zoho acabou, então o e-mail usa duas peças gratuitas:

- **Receber:** Cloudflare Email Routing repassa `contato@marc.os.eti.br` para o Gmail.
- **Ler e enviar:** Gmail, com "Enviar e-mail como" pelo SMTP do próprio Google
  (`smtp.gmail.com` + senha de app). O ícone de envelope do site abre o Gmail.

> Limitação: o envio sai assinado (DKIM) como `gmail.com`, não como `marc.os.eti.br`, então o
> DMARC do `marc` não "alinha". Por isso o `_dmarc.marc` fica em `p=none` (seção 2.2) — sem ele,
> o `marc` herdaria o `p=reject` do raiz e as mensagens seriam recusadas. Se aparecer problema de
> entrega, troque só o SMTP pela Brevo (seção 2.5).

### 2.1 Receber: Email Routing (Cloudflare)

A Cloudflare só permite ativar o Email Routing **primeiro no domínio raiz**; o `marc` entra
depois, em Settings → Subdomains.

1. Cloudflare → `os.eti.br` → **Email → Email Routing → Get started**.
   Se o assistente pedir para criar um endereço no raiz, pule ("Skip") ou crie e apague depois.
2. Ele quer criar no **raiz** os MX `route1/2/3.mx.cloudflare.net` e um SPF, e vai apontar
   conflito com o `MX .` e o `v=spf1 -all`. **Permita** que substitua esses dois.
   **Mantenha** o `_dmarc` (`p=reject`): ele continua impedindo falsificação de `@os.eti.br`.
3. **Destination addresses → Add**: o seu Gmail. Confirme pelo link que chega nele.
4. **Settings → Subdomains → Add**: `marc`. A Cloudflare cria sozinha os MX, o SPF
   (`v=spf1 include:_spf.mx.cloudflare.net ~all`) e o DKIM de encaminhamento no `marc`.
5. **Routing rules → Create address**: `contato` @ `marc.os.eti.br` → **Send to an email** → seu Gmail.
6. No raiz, deixe **sem regras** e o **catch-all desativado**: e-mail para `@os.eti.br` é recusado.

### 2.2 DMARC próprio do `marc` (obrigatório antes de enviar)

| Tipo | Nome | Conteúdo |
|---|---|---|
| TXT | `_dmarc.marc` | `v=DMARC1; p=none; rua=mailto:contato@marc.os.eti.br` |

### 2.3 Liberar o Google no SPF do `marc`

**Edite** o SPF que a Cloudflare criou no `marc` (não crie outro — só pode haver **um**
`v=spf1` por nome):

```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all
```

### 2.4 Enviar: "Enviar e-mail como" no Gmail

1. Conta Google → **Segurança** → ative a **Verificação em duas etapas** (exigida para senha de app).
2. Acesse **myaccount.google.com/apppasswords**, crie uma senha de app (nome: `marc.os.eti.br`)
   e copie os 16 caracteres. Ela aparece uma vez só.
3. Gmail → engrenagem → **Ver todas as configurações → Contas e importação →
   Enviar e-mail como → Adicionar outro endereço de e-mail**.
4. Nome: `Marcos Guimarães` · E-mail: `contato@marc.os.eti.br` · deixe "Tratar como alias" marcado.
5. Servidor SMTP: `smtp.gmail.com` · Porta: `587` · Nome de usuário: **o seu endereço Gmail
   completo** · Senha: **a senha de app** · **Conexão segura com TLS**.
6. O Gmail manda um código para `contato@marc.os.eti.br`; ele chega no próprio Gmail pelo
   Email Routing. Confirme.
7. Em "Enviar e-mail como", marque **"Responder do mesmo endereço para o qual a mensagem foi enviada"**.

**Testar** (sempre de/para **outra** conta, não o próprio Gmail):
1. Mande de outra conta para `contato@marc.os.eti.br` → deve chegar no Gmail (olhe o spam na 1ª vez).
2. Responda escolhendo o remetente `contato@marc.os.eti.br`.
3. Na conta que recebeu (se for Gmail: ⋮ → **Mostrar original**): `SPF: PASS` e `DKIM: PASS`
   (ambos de gmail.com) são o esperado. `DMARC` pode aparecer como FAIL — normal neste modelo,
   e a política `p=none` faz a mensagem ser entregue mesmo assim.

### 2.5 Plano B de envio: Brevo (se o Gmail cair no spam)

Troca só o servidor SMTP do passo 2.4; o recebimento continua igual.

1. Conta grátis em **brevo.com** → **Senders, Domains & Dedicated IPs → Domains → Add a domain**
   → `marc.os.eti.br` → autenticar manualmente.
2. Crie na Cloudflare o que a Brevo mostrar: **TXT** `marc` com `brevo-code:...` e o **DKIM**
   (em geral 2 CNAME `brevo1._domainkey.marc` e `brevo2._domainkey.marc`, nuvem cinza).
   Se pedir SPF, acrescente o `include` no SPF existente do `marc`.
3. **SMTP & API → SMTP → Generate a new SMTP key**.
4. No Gmail, edite o `contato@marc.os.eti.br` em "Enviar e-mail como": servidor
   `smtp-relay.brevo.com`, porta `587`, login = "SMTP login" da Brevo, senha = SMTP key.
5. Com isso o DKIM sai como `marc.os.eti.br` e o DMARC passa a dar PASS.

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
