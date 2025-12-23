# 🚀 Guia de Deploy - Landing Page TaskScribe na Hostinger

## 📋 Índice

1. [Mono-repo vs Multi-repo: Qual escolher?](#mono-repo-vs-multi-repo-qual-escolher)
2. [Preparação do Projeto](#preparação-do-projeto)
3. [Deploy na Hostinger - Opção 1: Node.js Apps](#deploy-na-hostinger---opção-1-nodejs-apps)
4. [Deploy na Hostinger - Opção 2: VPS (RECOMENDADO)](#deploy-na-hostinger---opção-2-vps-recomendado)
5. [Configuração de Domínio](#configuração-de-domínio)
6. [Troubleshooting](#troubleshooting)

---

## 🤔 Mono-repo vs Multi-repo: Qual escolher?

### Opção 1: Mono-repo (Situação Atual) ✅ RECOMENDADO

**Vantagens:**

- ✅ **Código compartilhado**: Tipos, constantes e utilitários podem ser reutilizados entre Desktop e LP
- ✅ **Versionamento sincronizado**: Garantia de que a LP sempre reflete a versão atual do produto
- ✅ **CI/CD simplificado**: Um único pipeline gerencia ambos (Desktop + LP)
- ✅ **Histórico unificado**: Todas as mudanças do produto em um único lugar
- ✅ **Gerenciamento mais simples**: Uma única issue tracker, um PR review process
- ✅ **Deployment seletivo**: Hostinger pode fazer deploy apenas da pasta `/lp` via GitHub

**Desvantagens:**

- ⚠️ Clone inicial maior (mas Hostinger clona apenas `/lp`)
- ⚠️ Workflows mais complexos (mas já resolvido com paths em GitHub Actions)

### Opção 2: Multi-repo (Repositórios Separados)

**Vantagens:**

- ✅ Repositórios menores e focados
- ✅ Permissões de acesso independentes
- ✅ Deploy 100% isolado

**Desvantagens:**

- ❌ **Duplicação de código**: Tipos e constantes precisam ser copiados/sincronizados
- ❌ **Versionamento desacoplado**: LP pode ficar desatualizada em relação ao Desktop
- ❌ **Gerenciamento duplicado**: Issues, PRs, dependências em dois lugares
- ❌ **Risco de inconsistência**: Design system, branding e features podem divergir
- ❌ **Trabalho dobrado**: Configuração de CI/CD, linters, prettier, tsconfig duplicados

### 📊 Recomendação Final

**MANTENHA O MONO-REPO** 🎯

Sua landing page está diretamente relacionada ao produto desktop. Separar os repositórios traria mais complexidade operacional do que benefícios. A Hostinger permite fazer deploy apenas da pasta `/lp` via GitHub, então não há desperdício de recursos.

**Quando considerar Multi-repo:**

- Se a LP evoluir para um produto web completo (SaaS)
- Se equipes diferentes gerenciarem Desktop e Web
- Se a LP precisar de deploys muito mais frequentes (várias vezes por dia)

---

## 🛠️ Preparação do Projeto

### 1. Verificar Estrutura do Projeto

```bash
cd /Users/wallysongalvao/Documents/workspace/taskscribe/lp
```

Certifique-se de que existe:

- ✅ `package.json` com scripts `build` e `start`
- ✅ `next.config.ts` configurado
- ✅ `.env.local` com variáveis de ambiente (não commitadas)

### 2. Criar `.env.example` (para documentação)

Crie um arquivo `.env.example` na pasta `lp/`:

```bash
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=

# Vercel Analytics (opcional)
NEXT_PUBLIC_VERCEL_ANALYTICS=

# App Info
NEXT_PUBLIC_APP_NAME=TaskScribe
NEXT_PUBLIC_APP_URL=https://taskscribe.com

# Stripe (se usar pagamentos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### 3. Configurar `.gitignore` (verificar se já existe)

```bash
cat lp/.gitignore
```

Deve conter:

```
# Ambientes
.env.local
.env.production.local
.env.development.local

# Next.js
.next/
out/
build/

# Node
node_modules/
```

### 4. Otimizar `package.json` para Produção

Verifique se tem os scripts corretos em `lp/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

### 5. Testar Build Local

```bash
cd lp
yarn build
yarn start
```

Acesse `http://localhost:3000` e verifique se tudo funciona.

---

## 🌐 Deploy na Hostinger - Opção 1: Node.js Apps

> ⚠️ **Atenção**: Esta opção é mais simples, mas tem limitações. Para mais controle e performance, veja a [Opção 2: VPS](#deploy-na-hostinger---opção-2-vps-recomendado).

### Opção A: Deploy via GitHub (Recomendado) 🎯

#### 1. Preparar Repositório

No repositório do TaskScribe, crie um arquivo `.hostingerignore` na raiz:

```bash
# .hostingerignore (na raiz do projeto)
# Ignorar tudo que não seja a landing page
src/
src-tauri/
public/
docs/
scripts/
coverage/
supabase/
.github/
*.md
!lp/
```

#### 2. Acessar hPanel da Hostinger

1. Faça login no [hPanel](https://hpanel.hostinger.com)
2. Vá em **Websites** → **Adicionar Website**
3. Selecione **Node.js Apps**

#### 3. Configurar Deploy via GitHub

**Passo 3.1 - Conectar Repositório:**

- Clique em **Importar Git Repository**
- Autorize o acesso ao GitHub
- Selecione o repositório: `WallysonGalvao/taskScribe`
- **Branch**: `main` (ou `master`)

**Passo 3.2 - Configurar Pasta Raiz:**

- **Root Directory**: `lp/` ⚠️ **IMPORTANTE**
- Isso faz a Hostinger considerar apenas a pasta `/lp` como projeto

**Passo 3.3 - Configurar Comandos de Build:**

```bash
# Install command
yarn install --frozen-lockfile

# Build command
yarn build

# Start command
yarn start
```

**Passo 3.4 - Configurar Variáveis de Ambiente:**
Adicione suas variáveis de ambiente:

```
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=TaskScribe
NEXT_PUBLIC_APP_URL=https://taskscribe.com
# Adicione outras variáveis do .env.local
```

**Passo 3.5 - Versão do Node.js:**

- Selecione **Node.js 20.x** (ou superior)

#### 4. Deploy

- Clique em **Deploy**
- Aguarde o processo (5-10 minutos na primeira vez)
- Você receberá um URL temporário: `https://taskscribe-xxx.hostingerapp.com`

#### 5. Testar

Acesse o URL temporário e verifique se a landing page carregou corretamente.

---

### Opção B: Deploy via Upload Manual (Não Recomendado)

⚠️ **Não recomendado** porque:

- Você perde CI/CD automático
- Precisa fazer build local e upload toda vez
- Maior risco de erros

**Se mesmo assim quiser usar:**

1. Build local:

```bash
cd lp
yarn build
```

2. Compacte os arquivos necessários:

```bash
zip -r taskscribe-lp.zip \
  .next/ \
  public/ \
  package.json \
  next.config.ts \
  node_modules/ \
  -x "*.git*" -x "*.DS_Store"
```

3. No hPanel:
   - **Websites** → **Adicionar Website** → **Node.js Apps**
   - Clique em **Upload seus arquivos**
   - Faça upload do `taskscribe-lp.zip`

4. Configure os mesmos comandos e variáveis da Opção A

---

## �️ Deploy na Hostinger - Opção 2: VPS (RECOMENDADO)

> ✅ **Recomendado para produção**: Mais controle, melhor performance, acesso SSH completo.

### Por que VPS é melhor?

**Vantagens do VPS:**

- ✅ **Controle total** do servidor (root access)
- ✅ **Melhor performance** (recursos dedicados)
- ✅ **Nginx/Apache** para proxy reverso e cache
- ✅ **PM2** para gerenciamento de processos (auto-restart, clustering)
- ✅ **Certificado SSL** com Let's Encrypt (renovação automática)
- ✅ **Logs detalhados** e monitoramento
- ✅ **Deploy automático** via GitHub Actions
- ✅ **Custo-benefício** melhor em longo prazo

**Desvantagens do Node.js Apps:**

- ❌ Recursos compartilhados (pode ter lentidão)
- ❌ Menos controle sobre configuração
- ❌ Dificuldade com websockets/long polling
- ❌ Limitações de CPU/RAM

---

### 📦 Pré-requisitos

1. **VPS Hostinger contratado** ([painel VPS](https://hpanel.hostinger.com))
2. **Domínio configurado** (opcional, mas recomendado)
3. **Cliente SSH** instalado:
   - macOS/Linux: Terminal nativo
   - Windows: PowerShell, PuTTY ou Windows Terminal

---

### 🚀 Passo a Passo Completo

#### **Etapa 1: Acessar o VPS**

1. **Obter credenciais do VPS**:
   - Acesse o [hPanel](https://hpanel.hostinger.com)
   - Vá em **VPS** → Selecione seu VPS
   - Anote: **IP do servidor**, **usuário** (geralmente `root`) e **senha**

2. **Conectar via SSH**:

   ```bash
   ssh root@SEU_IP_DO_VPS
   # Digite a senha quando solicitado
   ```

3. **Atualizar o sistema** (primeira vez):
   ```bash
   apt update && apt upgrade -y
   ```

---

#### **Etapa 2: Instalar Dependências**

1. **Instalar Node.js (via NodeSource - versão LTS)**:

   ```bash
   # Instalar Node.js 20.x LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs

   # Verificar versões
   node -v  # Deve mostrar v20.x.x
   npm -v   # Deve mostrar 10.x.x
   ```

2. **Instalar Yarn (opcional, mas recomendado)**:

   ```bash
   npm install -g yarn
   yarn -v
   ```

3. **Instalar PM2 (gerenciador de processos)**:

   ```bash
   npm install -g pm2
   pm2 -v
   ```

4. **Instalar Git**:

   ```bash
   apt install -y git
   git --version
   ```

5. **Instalar Nginx (proxy reverso)**:
   ```bash
   apt install -y nginx
   systemctl status nginx  # Verificar se está rodando
   ```

---

#### **Etapa 3: Configurar Usuário Não-Root (Segurança)**

> ⚠️ **Importante**: Nunca rode aplicações Node.js como root em produção.

```bash
# Criar usuário para a aplicação
adduser taskscribe
# Digite uma senha forte e preencha os dados (ou deixe em branco)

# Adicionar ao grupo sudo (para comandos administrativos)
usermod -aG sudo taskscribe

# Trocar para o novo usuário
su - taskscribe
```

---

#### **Etapa 4: Fazer Deploy do Projeto**

1. **Clonar repositório**:

   ```bash
   cd ~
   git clone https://github.com/WallysonGalvao/taskScribe.git
   cd taskScribe/lp
   ```

2. **Instalar dependências**:

   ```bash
   yarn install --frozen-lockfile
   # ou: npm ci
   ```

3. **Configurar variáveis de ambiente**:

   ```bash
   # Copiar template
   cp .env.example .env.local

   # Editar com nano ou vim
   nano .env.local
   ```

   Adicione suas variáveis (exemplo):

   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_APP_NAME=TaskScribe
   NEXT_PUBLIC_APP_URL=https://taskscribe.com
   # ... outras variáveis
   ```

4. **Build do projeto**:

   ```bash
   yarn build
   # ou: npm run build
   ```

5. **Testar localmente**:
   ```bash
   yarn start
   # Ctrl+C para parar
   ```

---

#### **Etapa 5: Configurar PM2**

1. **Criar arquivo de configuração PM2**:

   ```bash
   cd ~/taskScribe/lp
   nano ecosystem.config.js
   ```

2. **Adicionar configuração**:

   ```javascript
   module.exports = {
     apps: [
       {
         name: "taskscribe-lp",
         script: "npm",
         args: "start",
         cwd: "/home/taskscribe/taskScribe/lp",
         instances: "max", // Usa todos os CPUs (cluster mode)
         exec_mode: "cluster",
         autorestart: true,
         watch: false,
         max_memory_restart: "500M",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
         },
         error_file: "/home/taskscribe/logs/lp-error.log",
         out_file: "/home/taskscribe/logs/lp-out.log",
         log_file: "/home/taskscribe/logs/lp-combined.log",
         time: true,
       },
     ],
   };
   ```

3. **Criar pasta de logs**:

   ```bash
   mkdir -p ~/logs
   ```

4. **Iniciar aplicação com PM2**:

   ```bash
   pm2 start ecosystem.config.js

   # Verificar status
   pm2 status
   pm2 logs taskscribe-lp

   # Ver monitoramento em tempo real
   pm2 monit
   ```

5. **Configurar PM2 para iniciar no boot**:

   ```bash
   pm2 startup
   # Copie e execute o comando que aparecer

   pm2 save
   ```

---

#### **Etapa 6: Configurar Nginx (Proxy Reverso)**

1. **Voltar para usuário root**:

   ```bash
   exit  # Sair do usuário taskscribe
   # Ou abrir novo terminal SSH como root
   ```

2. **Criar configuração Nginx**:

   ```bash
   nano /etc/nginx/sites-available/taskscribe
   ```

3. **Adicionar configuração** (sem SSL por enquanto):

   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name taskscribe.com www.taskscribe.com;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;

       # Proxy para Next.js
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;

           # Timeouts
           proxy_connect_timeout 60s;
           proxy_send_timeout 60s;
           proxy_read_timeout 60s;
       }

       # Cache para arquivos estáticos
       location /_next/static/ {
           proxy_pass http://localhost:3000;
           proxy_cache_valid 200 60m;
           add_header Cache-Control "public, max-age=3600, immutable";
       }

       # Cache para imagens
       location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
           proxy_pass http://localhost:3000;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Ativar site**:

   ```bash
   ln -s /etc/nginx/sites-available/taskscribe /etc/nginx/sites-enabled/

   # Testar configuração
   nginx -t

   # Recarregar Nginx
   systemctl reload nginx
   ```

5. **Configurar Firewall**:

   ```bash
   # Permitir HTTP, HTTPS e SSH
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS

   # Ativar firewall
   ufw enable
   ufw status
   ```

---

#### **Etapa 7: Configurar SSL/HTTPS com Let's Encrypt**

1. **Instalar Certbot**:

   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Obter certificado SSL**:

   ```bash
   # Certifique-se de que o domínio está apontando para o IP do VPS
   certbot --nginx -d taskscribe.com -d www.taskscribe.com
   ```

3. **Seguir instruções do Certbot**:
   - Digite seu email
   - Aceite os termos
   - Escolha redirecionar HTTP → HTTPS (opção 2)

4. **Testar renovação automática**:

   ```bash
   certbot renew --dry-run
   ```

5. **Verificar HTTPS**:
   - Acesse `https://taskscribe.com`
   - Verifique o cadeado verde no navegador

---

#### **Etapa 8: Configurar Deploy Automático (CI/CD)**

1. **Criar script de deploy no VPS**:

   ```bash
   su - taskscribe
   nano ~/deploy.sh
   ```

2. **Adicionar script**:

   ```bash
   #!/bin/bash

   echo "🚀 Starting deployment..."

   # Navegar para o projeto
   cd ~/taskScribe

   # Fazer backup da versão atual
   BACKUP_DIR=~/backups/$(date +%Y%m%d_%H%M%S)
   mkdir -p $BACKUP_DIR
   cp -r lp/.next $BACKUP_DIR/ 2>/dev/null || true

   # Atualizar código
   echo "📥 Pulling latest changes..."
   git pull origin main

   # Navegar para pasta da LP
   cd lp

   # Instalar/atualizar dependências
   echo "📦 Installing dependencies..."
   yarn install --frozen-lockfile

   # Build
   echo "🔨 Building application..."
   yarn build

   # Reload PM2
   echo "♻️ Reloading PM2..."
   pm2 reload ecosystem.config.js

   echo "✅ Deployment completed!"
   pm2 status
   ```

3. **Dar permissão de execução**:

   ```bash
   chmod +x ~/deploy.sh
   ```

4. **Testar script**:

   ```bash
   ~/deploy.sh
   ```

5. **Configurar GitHub Actions** (no seu repositório local):

   Crie `.github/workflows/deploy-lp.yml`:

   ```yaml
   name: Deploy Landing Page

   on:
     push:
       branches: [main]
       paths:
         - "lp/**"
     workflow_dispatch:

   jobs:
     deploy:
       name: Deploy to VPS
       runs-on: ubuntu-latest

       steps:
         - name: Deploy via SSH
           uses: appleboy/ssh-action@v1.0.0
           with:
             host: ${{ secrets.VPS_HOST }}
             username: ${{ secrets.VPS_USER }}
             key: ${{ secrets.VPS_SSH_KEY }}
             script: |
               /home/taskscribe/deploy.sh
   ```

6. **Configurar secrets no GitHub**:

   No GitHub, vá em **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - `VPS_HOST`: IP do seu VPS
   - `VPS_USER`: `taskscribe`
   - `VPS_SSH_KEY`: Chave SSH privada (veja abaixo)

7. **Gerar par de chaves SSH** (no seu computador local):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions-taskscribe" -f ~/.ssh/taskscribe-deploy

   # Copiar chave pública para o VPS
   ssh-copy-id -i ~/.ssh/taskscribe-deploy.pub taskscribe@SEU_IP_DO_VPS

   # Copiar chave privada (adicionar como secret no GitHub)
   cat ~/.ssh/taskscribe-deploy
   ```

---

### 📊 Monitoramento e Manutenção

#### **1. Comandos PM2 Úteis**

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs taskscribe-lp

# Ver apenas erros
pm2 logs taskscribe-lp --err

# Monitoramento com dashboard
pm2 monit

# Reiniciar aplicação
pm2 restart taskscribe-lp

# Reload (zero-downtime)
pm2 reload taskscribe-lp

# Parar aplicação
pm2 stop taskscribe-lp

# Ver uso de memória/CPU
pm2 show taskscribe-lp
```

#### **2. Logs do Nginx**

```bash
# Logs de acesso
tail -f /var/log/nginx/access.log

# Logs de erro
tail -f /var/log/nginx/error.log

# Logs do site específico (se configurado)
tail -f /var/log/nginx/taskscribe-access.log
```

#### **3. Monitoramento de Recursos**

```bash
# CPU e memória
htop

# Espaço em disco
df -h

# Uso de disco por pasta
du -sh ~/taskScribe/*
```

#### **4. Backup Automático**

Crie script de backup (`~/backup.sh`):

```bash
#!/bin/bash

BACKUP_DIR=~/backups/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Backup do código
tar -czf $BACKUP_DIR/taskscribe-code.tar.gz ~/taskScribe/lp

# Backup dos logs
tar -czf $BACKUP_DIR/logs.tar.gz ~/logs

# Manter apenas últimos 7 dias
find ~/backups -type d -mtime +7 -exec rm -rf {} +

echo "✅ Backup completed: $BACKUP_DIR"
```

Agendar com cron:

```bash
crontab -e

# Adicionar linha (backup diário às 3h da manhã)
0 3 * * * /home/taskscribe/backup.sh >> /home/taskscribe/logs/backup.log 2>&1
```

---

### 🔒 Hardening de Segurança (Recomendado)

#### **1. Desabilitar login root via SSH**

```bash
# Editar configuração SSH
sudo nano /etc/ssh/sshd_config

# Alterar linhas:
PermitRootLogin no
PasswordAuthentication no  # Força uso de chaves SSH

# Reiniciar SSH
sudo systemctl restart sshd
```

#### **2. Fail2Ban (proteção contra brute force)**

```bash
sudo apt install -y fail2ban

# Criar configuração local
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Ativar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### **3. Atualizar sistema regularmente**

```bash
# Criar script de atualização
sudo nano /usr/local/bin/update-system.sh
```

Adicionar:

```bash
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
apt autoclean
```

Agendar com cron (semanalmente):

```bash
sudo crontab -e

# Adicionar (domingo às 4h)
0 4 * * 0 /usr/local/bin/update-system.sh
```

---

### ✅ Checklist Pós-Deploy VPS

- [ ] Node.js 20+ instalado
- [ ] PM2 configurado e rodando
- [ ] Nginx proxy reverso funcionando
- [ ] SSL/HTTPS ativo (Let's Encrypt)
- [ ] Firewall (ufw) configurado
- [ ] Deploy automático (GitHub Actions) funcionando
- [ ] Logs sendo coletados corretamente
- [ ] Backup automático agendado
- [ ] Monitoramento de uptime ativo
- [ ] Segurança hardening aplicado
- [ ] Domínio apontando corretamente
- [ ] Performance testada (Lighthouse > 90)

---

## �🔗 Configuração de Domínio

### 1. Conectar Domínio Principal

No hPanel:

1. Vá em **Domínios** → **Gerenciar**
2. Selecione `taskscribe.com`
3. Clique em **Conectar ao Website**
4. Selecione o website da landing page
5. Ative **Forçar HTTPS** ✅

### 2. Configurar DNS (se necessário)

Se o domínio estiver em outro registrador:

1. Aponte o **A Record** para o IP da Hostinger
2. Adicione **CNAME** para `www` → `taskscribe.com`

**Propagação DNS**: 4-48 horas

### 3. Certificado SSL

A Hostinger emite certificado SSL gratuito automaticamente (Let's Encrypt).

---

## 🐛 Troubleshooting

### Problema 1: Build falha com erro de memória

**Solução:**
Adicione variável de ambiente:

```
NODE_OPTIONS=--max-old-space-size=4096
```

### Problema 2: Página não carrega (404)

**Causas comuns:**

- ✅ Verificar se **Root Directory** está como `lp/`
- ✅ Verificar se comando `start` é `yarn start` (não `next start` sozinho)
- ✅ Checar logs no hPanel → **Logs** → **Error Logs**

### Problema 3: Variáveis de ambiente não funcionam

**Solução:**

- Variáveis do Next.js **precisam** do prefixo `NEXT_PUBLIC_` para serem acessíveis no browser
- Re-deploy depois de adicionar variáveis

### Problema 4: Imagens não carregam

**Solução:**
Verifique `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Se a Hostinger não suporta otimização de imagens
  },
};
```

### Problema 5: Deploy automático não funciona

**Solução:**

1. Verificar webhook do GitHub em **Settings** → **Webhooks**
2. Re-conectar repositório no hPanel
3. Fazer um push de teste

---

## 🔄 Workflow de Deploy Automático

Com GitHub conectado, o deploy é automático:

```bash
# 1. Fazer mudanças na LP
cd lp
# editar arquivos...

# 2. Commit e push
git add .
git commit -m "feat: update landing page hero section"
git push origin main

# 3. Hostinger detecta mudança e faz deploy automático ✅
# Acompanhe em: hPanel → Websites → Deployments
```

### Deploy Seletivo (Opcional)

Se quiser que apenas mudanças na pasta `/lp` disparem deploy, configure um webhook customizado:

1. No hPanel, copie a URL do webhook de deploy
2. No GitHub, vá em **Settings** → **Webhooks** → **Add webhook**
3. Configure o webhook para disparar apenas em push que afetem `lp/**`

---

## 📊 Monitoramento

### 1. Logs de Aplicação

**hPanel** → **Websites** → Seu site → **Logs**:

- **Error Logs**: Erros do Node.js/Next.js
- **Access Logs**: Requisições HTTP

### 2. Analytics

Já configurado no código (`@vercel/analytics`):

- Funciona na Hostinger também
- Acesse analytics em [Vercel Analytics](https://vercel.com/analytics)

### 3. Uptime Monitoring (Opcional)

Ferramentas gratuitas:

- [UptimeRobot](https://uptimerobot.com)
- [BetterUptime](https://betteruptime.com)
- [Pingdom](https://www.pingdom.com)

---

## 🎯 Checklist de Deploy

Antes de fazer deploy:

- [ ] Build local funciona (`yarn build && yarn start`)
- [ ] Todas as variáveis de ambiente documentadas em `.env.example`
- [ ] `next.config.ts` está otimizado para produção
- [ ] Imagens estão otimizadas (WebP, dimensões corretas)
- [ ] SEO metadata configurado (title, description, og:image)
- [ ] Robots.txt e sitemap.xml configurados
- [ ] Analytics configurado
- [ ] Testado em diferentes navegadores
- [ ] Testado em mobile
- [ ] Performance verificada (Lighthouse > 90)

Depois do deploy:

- [ ] Testar URL temporário
- [ ] Conectar domínio principal
- [ ] Forçar HTTPS habilitado
- [ ] Certificado SSL ativo
- [ ] Deploy automático funcionando
- [ ] Monitoramento configurado

---

## 📚 Recursos Adicionais

- [Documentação Hostinger - Node.js Hosting](https://support.hostinger.com/pt-BR/articles/6957601-como-hospedar-aplicacoes-node-js)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)

---

## 🆘 Suporte

**Problemas com Hostinger:**

- Chat ao vivo 24/7: [Hostinger Support](https://www.hostinger.com.br/contato)
- Email: support@hostinger.com

**Problemas com Next.js:**

- Discord da Vercel/Next.js
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

**Última atualização**: Dezembro 2025
**Versão**: 1.0.0
