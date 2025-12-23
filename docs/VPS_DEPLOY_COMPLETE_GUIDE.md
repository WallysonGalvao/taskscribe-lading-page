# 🖥️ Guia Completo: Deploy VPS - TaskScribe Landing Page

> **Complemento do [HOSTINGER_DEPLOY_GUIDE.md](./HOSTINGER_DEPLOY_GUIDE.md)**
>
> Este guia cobre especificamente o deploy via **VPS Hostinger** (opção recomendada para produção).

## 📋 Índice

1. [Por que VPS?](#por-que-vps)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup Inicial do VPS](#setup-inicial-do-vps)
4. [Deploy da Aplicação](#deploy-da-aplicação)
5. [Configuração de Proxy Reverso (Nginx)](#configuração-de-proxy-reverso-nginx)
6. [SSL/HTTPS com Let's Encrypt](#sslhttps-com-lets-encrypt)
7. [Deploy Automático (CI/CD)](#deploy-automático-cicd)
8. [Monitoramento e Manutenção](#monitoramento-e-manutenção)
9. [Segurança](#segurança)
10. [Troubleshooting VPS](#troubleshooting-vps)

---

## 🎯 Por que VPS?

### Comparação: Node.js Apps vs VPS

| Recurso             | Node.js Apps               | VPS                             |
| ------------------- | -------------------------- | ------------------------------- |
| **Controle**        | ❌ Limitado                | ✅ Root access completo         |
| **Performance**     | ⚠️ Recursos compartilhados | ✅ Recursos dedicados           |
| **Proxy Reverso**   | ❌ Não configurável        | ✅ Nginx/Apache customizável    |
| **Process Manager** | ❌ Básico                  | ✅ PM2 com clustering           |
| **SSL**             | ✅ Automático              | ✅ Let's Encrypt (customizável) |
| **Logs**            | ⚠️ Limitados               | ✅ Acesso completo              |
| **CI/CD**           | ⚠️ Via webhook             | ✅ Scripts personalizados       |
| **Custo**           | $$ Mais caro/app           | $ Melhor custo-benefício        |
| **Complexidade**    | ✅ Simples                 | ⚠️ Requer conhecimento          |

**Conclusão**: VPS é recomendado para **produção profissional**.

---

## 📦 Pré-requisitos

- ✅ **VPS Hostinger contratado** ([comprar aqui](https://www.hostinger.com.br/servidor-vps))
- ✅ **Domínio registrado** (taskscribe.com)
- ✅ **Cliente SSH** instalado
- ✅ **Conhecimento básico** de Linux/terminal
- ✅ **Git** instalado localmente

**Planos VPS recomendados**:

- **KVM 1**: Para testes (até 10k visitas/mês)
- **KVM 2**: Produção leve (até 50k visitas/mês) ✅ **Recomendado**
- **KVM 4+**: Alta performance (100k+ visitas/mês)

---

## 🚀 Setup Inicial do VPS

### Etapa 1: Acessar o VPS

1. **Obter credenciais**:
   - Acesse [hPanel](https://hpanel.hostinger.com)
   - Vá em **VPS** → Selecione seu VPS
   - Anote: **IP**, **usuário** (root) e **senha**

2. **Conectar via SSH**:

   ```bash
   ssh root@SEU_IP_DO_VPS
   # Digite a senha quando solicitado
   ```

3. **Atualizar sistema** (primeira vez):
   ```bash
   apt update && apt upgrade -y
   ```

---

### Etapa 2: Instalar Dependências

#### 1. Node.js 20 LTS (via NodeSource)

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Instalar Node.js
apt install -y nodejs

# Verificar instalação
node -v  # Deve mostrar: v20.x.x
npm -v   # Deve mostrar: 10.x.x
```

#### 2. Yarn (opcional, mas recomendado)

```bash
npm install -g yarn
yarn -v
```

#### 3. PM2 (Process Manager)

```bash
npm install -g pm2

# Verificar
pm2 -v
```

#### 4. Git

```bash
apt install -y git
git --version
```

#### 5. Nginx (Proxy Reverso)

```bash
apt install -y nginx

# Verificar status
systemctl status nginx

# Deve mostrar: "active (running)"
```

#### 6. Certbot (SSL/HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --version
```

#### 7. Ferramentas úteis

```bash
apt install -y htop curl wget unzip build-essential
```

---

### Etapa 3: Configurar Usuário Não-Root (Segurança)

> ⚠️ **NUNCA rode aplicações Node.js como root em produção!**

```bash
# Criar usuário dedicado
adduser taskscribe
# Digite uma senha forte e preencha os dados (ou deixe em branco)

# Adicionar ao grupo sudo (para comandos administrativos)
usermod -aG sudo taskscribe

# Trocar para o novo usuário
su - taskscribe
```

A partir de agora, use o usuário `taskscribe` para operações da aplicação.

---

## 🚢 Deploy da Aplicação

### Etapa 4: Clonar e Configurar Projeto

```bash
# 1. Clonar repositório
cd ~
git clone https://github.com/WallysonGalvao/taskScribe.git
cd taskScribe/lp

# 2. Instalar dependências
yarn install --frozen-lockfile
# Ou: npm ci

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
nano .env.local
```

**Exemplo de `.env.local`**:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=TaskScribe
NEXT_PUBLIC_APP_URL=https://taskscribe.com
NEXT_PUBLIC_VERCEL_ANALYTICS=your-analytics-id
# ... outras variáveis
```

```bash
# 4. Build do projeto
yarn build

# 5. Testar localmente
yarn start
# Ctrl+C para parar

# Testar em outra aba/janela:
curl http://localhost:3000
```

---

### Etapa 5: Configurar PM2

#### 1. Criar arquivo de configuração

```bash
cd ~/taskScribe/lp
nano ecosystem.config.js
```

#### 2. Adicionar configuração

```javascript
module.exports = {
  apps: [
    {
      name: "taskscribe-lp",
      script: "npm",
      args: "start",
      cwd: "/home/taskscribe/taskScribe/lp",

      // Cluster mode: usa todos os CPUs disponíveis
      instances: "max",
      exec_mode: "cluster",

      // Auto-restart e limites
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      // Variáveis de ambiente
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Logs
      error_file: "/home/taskscribe/logs/lp-error.log",
      out_file: "/home/taskscribe/logs/lp-out.log",
      log_file: "/home/taskscribe/logs/lp-combined.log",
      time: true,

      // Configurações adicionais
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

#### 3. Criar pasta de logs

```bash
mkdir -p ~/logs
```

#### 4. Iniciar aplicação

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js

# Verificar status
pm2 status

# Ver logs
pm2 logs taskscribe-lp

# Monitoramento em tempo real
pm2 monit
```

#### 5. Configurar PM2 para iniciar no boot

```bash
# Gerar script de startup
pm2 startup

# IMPORTANTE: Copie e execute o comando que aparecer (será algo como):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u taskscribe --hp /home/taskscribe

# Salvar estado atual do PM2
pm2 save
```

---

## 🌐 Configuração de Proxy Reverso (Nginx)

### Etapa 6: Configurar Nginx

#### 1. Voltar para usuário root

```bash
exit  # Sair do usuário taskscribe
# Ou abrir novo terminal SSH como root
```

#### 2. Criar configuração do site

```bash
nano /etc/nginx/sites-available/taskscribe
```

#### 3. Adicionar configuração (HTTP - sem SSL por enquanto)

```nginx
# Upstream para Next.js
upstream nextjs_backend {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name taskscribe.com www.taskscribe.com;

    # Logs
    access_log /var/log/nginx/taskscribe-access.log;
    error_log /var/log/nginx/taskscribe-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        image/x-icon
        application/vnd.ms-fontobject
        font/opentype
        font/truetype
        font/woff
        font/woff2;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Limite de tamanho de upload (se necessário)
    client_max_body_size 10M;

    # Proxy para Next.js
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Cache bypass
        proxy_cache_bypass $http_upgrade;
    }

    # Cache agressivo para arquivos estáticos Next.js
    location /_next/static/ {
        proxy_pass http://nextjs_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache para imagens
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)$ {
        proxy_pass http://nextjs_backend;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache para fontes
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        proxy_pass http://nextjs_backend;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

#### 4. Ativar site

```bash
# Criar link simbólico
ln -s /etc/nginx/sites-available/taskscribe /etc/nginx/sites-enabled/

# Remover configuração padrão (opcional)
rm /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Deve mostrar: "syntax is ok" e "test is successful"

# Recarregar Nginx
systemctl reload nginx
```

#### 5. Configurar Firewall

```bash
# Permitir HTTP, HTTPS e SSH
ufw allow 22/tcp    # SSH (IMPORTANTE!)
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Ativar firewall
ufw enable

# Verificar status
ufw status verbose
```

#### 6. Testar HTTP

```bash
curl -I http://taskscribe.com
# Deve retornar HTTP 200
```

---

## 🔒 SSL/HTTPS com Let's Encrypt

### Etapa 7: Configurar Certificado SSL

> ⚠️ **Pré-requisito**: Domínio deve estar apontando para o IP do VPS.

#### 1. Verificar DNS

```bash
# No seu computador
nslookup taskscribe.com
# Deve retornar o IP do seu VPS

dig taskscribe.com +short
# Deve retornar o IP do VPS
```

#### 2. Obter certificado SSL

```bash
# Certbot configurará automaticamente o Nginx
certbot --nginx -d taskscribe.com -d www.taskscribe.com

# Siga as instruções:
# 1. Digite seu email (para avisos de expiração)
# 2. Aceite os termos (Y)
# 3. Compartilhar email com EFF? (opcional - N)
# 4. Redirecionar HTTP para HTTPS? (SIM - opção 2)
```

#### 3. Verificar configuração

```bash
# Nginx foi atualizado automaticamente
cat /etc/nginx/sites-available/taskscribe

# Deve ter novos blocos para SSL (porta 443)
```

#### 4. Testar HTTPS

```bash
curl -I https://taskscribe.com
# Deve retornar HTTP 200

# Verificar SSL
openssl s_client -connect taskscribe.com:443 -servername taskscribe.com < /dev/null
```

#### 5. Testar renovação automática

```bash
# Dry-run (teste sem renovar de verdade)
certbot renew --dry-run

# Deve mostrar: "Congratulations, all renewals succeeded"
```

#### 6. Verificar cron de renovação automática

```bash
# Certbot cria automaticamente um timer systemd
systemctl status certbot.timer

# Deve mostrar: "active"
```

---

## 🔄 Deploy Automático (CI/CD)

### Etapa 8: Configurar Deploy via GitHub Actions

#### 1. Criar script de deploy no VPS

```bash
su - taskscribe  # Trocar para usuário taskscribe
nano ~/deploy.sh
```

#### 2. Adicionar script de deploy

```bash
#!/bin/bash

set -e  # Para no primeiro erro

echo "🚀 Starting TaskScribe LP deployment..."
echo "⏰ $(date)"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
PROJECT_DIR=~/taskScribe
LP_DIR=$PROJECT_DIR/lp
BACKUP_DIR=~/backups
LOG_FILE=~/logs/deploy.log

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $LOG_FILE
}

# Criar diretórios necessários
mkdir -p $BACKUP_DIR $LOG_FILE

# Backup da versão atual
log "📦 Creating backup..."
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR/$BACKUP_TIMESTAMP
if [ -d "$LP_DIR/.next" ]; then
    cp -r $LP_DIR/.next $BACKUP_DIR/$BACKUP_TIMESTAMP/ || warn "Backup failed"
    log "✅ Backup created at $BACKUP_DIR/$BACKUP_TIMESTAMP"
fi

# Atualizar código
log "📥 Pulling latest changes from GitHub..."
cd $PROJECT_DIR
git fetch origin main || error "Git fetch failed"
git reset --hard origin/main || error "Git reset failed"
log "✅ Code updated"

# Navegar para LP
cd $LP_DIR

# Instalar/atualizar dependências
log "📦 Installing dependencies..."
yarn install --frozen-lockfile || error "Yarn install failed"
log "✅ Dependencies installed"

# Build
log "🔨 Building application..."
yarn build || error "Build failed"
log "✅ Build completed"

# Reload PM2
log "♻️ Reloading PM2..."
pm2 reload ecosystem.config.js || error "PM2 reload failed"
log "✅ PM2 reloaded"

# Verificar se está rodando
sleep 3
if pm2 list | grep -q "online.*taskscribe-lp"; then
    log "✅ Application is running"
else
    error "Application failed to start"
fi

# Limpar backups antigos (manter últimos 5)
log "🧹 Cleaning old backups..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm -rf
log "✅ Old backups cleaned"

# Resumo
echo ""
log "🎉 Deployment completed successfully!"
log "📊 PM2 Status:"
pm2 status

echo ""
log "📝 Recent logs:"
pm2 logs taskscribe-lp --lines 10 --nostream

echo ""
log "🌐 Check: https://taskscribe.com"
```

#### 3. Tornar script executável

```bash
chmod +x ~/deploy.sh
```

#### 4. Testar script localmente

```bash
~/deploy.sh
```

---

#### 5. Configurar chaves SSH para GitHub Actions

**No VPS** (como usuário taskscribe):

```bash
# Gerar par de chaves SSH
ssh-keygen -t ed25519 -C "github-actions-taskscribe" -f ~/.ssh/github-actions -N ""

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# Ajustar permissões
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# IMPORTANTE: Copiar chave PRIVADA (adicionar no GitHub Secrets)
cat ~/.ssh/github-actions
# Copie TODO o conteúdo (incluindo BEGIN e END)
```

---

#### 6. Criar workflow do GitHub Actions

**No seu repositório local**, crie `.github/workflows/deploy-lp.yml`:

```yaml
name: Deploy Landing Page to VPS

on:
  push:
    branches: [main]
    paths:
      - "lp/**"
      - ".github/workflows/deploy-lp.yml"
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Production VPS
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            /home/taskscribe/deploy.sh

      - name: Deployment Status
        if: success()
        run: |
          echo "🎉 Deployment completed successfully!"
          echo "🌐 Site: https://taskscribe.com"

      - name: Deployment Failed
        if: failure()
        run: |
          echo "❌ Deployment failed!"
          echo "Check logs in GitHub Actions"
```

---

#### 7. Configurar GitHub Secrets

No GitHub, vá em **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

**Adicione 3 secrets**:

1. **`VPS_HOST`**:

   ```
   SEU_IP_DO_VPS
   ```

2. **`VPS_USER`**:

   ```
   taskscribe
   ```

3. **`VPS_SSH_KEY`**:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [conteúdo da chave privada copiada anteriormente]
   -----END OPENSSH PRIVATE KEY-----
   ```

---

#### 8. Testar Deploy Automático

```bash
# No seu computador
cd ~/Documents/workspace/taskscribe

# Fazer uma mudança na LP
cd lp
nano README.md  # Adicione uma linha qualquer

# Commit e push
git add .
git commit -m "test: trigger auto deploy"
git push origin main

# Acompanhar no GitHub:
# https://github.com/WallysonGalvao/taskScribe/actions
```

---

## 📊 Monitoramento e Manutenção

### Comandos PM2 Úteis

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs taskscribe-lp

# Ver apenas erros
pm2 logs taskscribe-lp --err

# Ver apenas output
pm2 logs taskscribe-lp --out

# Dashboard interativo
pm2 monit

# Informações detalhadas
pm2 show taskscribe-lp

# Reiniciar (com downtime)
pm2 restart taskscribe-lp

# Reload (zero-downtime)
pm2 reload taskscribe-lp

# Parar aplicação
pm2 stop taskscribe-lp

# Remover do PM2
pm2 delete taskscribe-lp

# Ver uso de memória/CPU
pm2 list
```

---

### Logs do Nginx

```bash
# Logs de acesso
tail -f /var/log/nginx/taskscribe-access.log

# Logs de erro
tail -f /var/log/nginx/taskscribe-error.log

# Ver últimas 100 linhas
tail -n 100 /var/log/nginx/taskscribe-access.log

# Filtrar por código de erro
grep " 500 " /var/log/nginx/taskscribe-error.log
```

---

### Monitoramento de Recursos

```bash
# CPU e memória (interativo)
htop

# Uso de disco
df -h

# Uso por pasta
du -sh ~/taskScribe/*
du -h --max-depth=1 ~/taskScribe/lp

# Processos Node.js
ps aux | grep node

# Uso de rede
ss -tulpn | grep :3000  # Verificar se porta 3000 está aberta
```

---

### Rotação de Logs

```bash
# Configurar logrotate para logs do PM2
sudo nano /etc/logrotate.d/pm2-taskscribe
```

Adicionar:

```
/home/taskscribe/logs/*.log {
    daily
    rotate 14
    missingok
    notifempty
    compress
    delaycompress
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

### Backup Automático

```bash
# Criar script de backup
nano ~/backup.sh
```

Adicionar:

```bash
#!/bin/bash

BACKUP_DIR=~/backups/scheduled/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Backup do código
echo "📦 Backing up code..."
tar -czf $BACKUP_DIR/taskscribe-code.tar.gz ~/taskScribe/lp

# Backup dos logs
echo "📋 Backing up logs..."
tar -czf $BACKUP_DIR/logs.tar.gz ~/logs

# Backup da configuração Nginx
echo "⚙️ Backing up Nginx config..."
sudo cp /etc/nginx/sites-available/taskscribe $BACKUP_DIR/nginx-taskscribe.conf

# Manter apenas últimos 7 dias
echo "🧹 Cleaning old backups..."
find ~/backups/scheduled -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

echo "✅ Backup completed: $BACKUP_DIR"
ls -lh $BACKUP_DIR
```

```bash
# Tornar executável
chmod +x ~/backup.sh

# Agendar com cron (diário às 3h da manhã)
crontab -e

# Adicionar linha:
0 3 * * * /home/taskscribe/backup.sh >> /home/taskscribe/logs/backup.log 2>&1
```

---

## 🔒 Segurança

### 1. Desabilitar Login Root via SSH

```bash
# Como root
sudo nano /etc/ssh/sshd_config

# Alterar/adicionar linhas:
PermitRootLogin no
PasswordAuthentication no  # Força uso de chaves SSH apenas
PubkeyAuthentication yes
```

```bash
# Reiniciar SSH
sudo systemctl restart sshd

# ⚠️ ATENÇÃO: Teste a conexão SSH com outro terminal ANTES de sair!
```

---

### 2. Fail2Ban (Proteção contra Brute Force)

```bash
sudo apt install -y fail2ban

# Criar configuração personalizada
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Procurar por [sshd] e alterar:
# enabled = true
# maxretry = 3
# findtime = 10m
# bantime = 1h

# Ativar e iniciar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Verificar status
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

---

### 3. Atualizações Automáticas de Segurança

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Selecione "Yes"
```

---

### 4. Hardening Nginx

Adicione ao `/etc/nginx/sites-available/taskscribe` (dentro do bloco server):

```nginx
# Esconder versão do Nginx
server_tokens off;

# Prevenir clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# XSS Protection
add_header X-XSS-Protection "1; mode=block" always;

# MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# HSTS (força HTTPS por 1 ano)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

Recarregar Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### 5. Limitar Taxa de Requisições (Rate Limiting)

No `/etc/nginx/nginx.conf` (dentro de `http {}`):

```nginx
# Zona de rate limiting (10MB armazena ~160k IPs)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=50r/s;
```

No `/etc/nginx/sites-available/taskscribe`:

```nginx
location / {
    limit_req zone=general burst=20 nodelay;
    # ... resto da configuração
}

location /api/ {
    limit_req zone=api burst=5 nodelay;
    # ... configuração de API
}
```

---

## 🐛 Troubleshooting VPS

### Problema 1: PM2 não inicia no boot

**Sintomas**: Depois de reiniciar o VPS, a aplicação não está rodando.

**Solução**:

```bash
# Remover configuração antiga
pm2 unstartup

# Reconfigurar
pm2 startup

# Executar o comando gerado (será algo como):
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u taskscribe --hp /home/taskscribe

# Salvar estado
pm2 save

# Testar
sudo reboot
# Aguardar 2 minutos e verificar:
ssh taskscribe@SEU_IP
pm2 status
```

---

### Problema 2: Nginx retorna 502 Bad Gateway

**Sintomas**: Site mostra "502 Bad Gateway"

**Causas possíveis**:

1. Next.js não está rodando
2. Porta errada
3. Firewall bloqueando

**Solução**:

```bash
# 1. Verificar se Next.js está rodando
pm2 status
pm2 logs taskscribe-lp --lines 50

# 2. Testar porta 3000 localmente
curl http://localhost:3000

# 3. Verificar configuração Nginx
sudo nginx -t
cat /etc/nginx/sites-available/taskscribe | grep proxy_pass

# 4. Ver logs Nginx
sudo tail -f /var/log/nginx/taskscribe-error.log

# 5. Reiniciar tudo
pm2 restart taskscribe-lp
sudo systemctl restart nginx
```

---

### Problema 3: SSL não renova automaticamente

**Sintomas**: Certificado expira e site fica inacessível.

**Solução**:

```bash
# 1. Verificar timer do Certbot
sudo systemctl status certbot.timer

# 2. Se inativo, ativar:
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 3. Testar renovação manual
sudo certbot renew --dry-run

# 4. Forçar renovação (se necessário)
sudo certbot renew --force-renewal

# 5. Recarregar Nginx
sudo systemctl reload nginx
```

---

### Problema 4: Deploy automático falha

**Sintomas**: Push no GitHub não dispara deploy.

**Solução**:

```bash
# 1. Verificar chaves SSH
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys

# 2. Testar conexão SSH localmente
ssh taskscribe@SEU_IP "/home/taskscribe/deploy.sh"

# 3. Verificar permissões do script
ls -l ~/deploy.sh
# Deve ser: -rwxr-xr-x

# 4. Ver logs de deploy
cat ~/logs/deploy.log

# 5. Verificar secrets no GitHub
# Settings → Secrets and variables → Actions
# Verificar VPS_HOST, VPS_USER, VPS_SSH_KEY
```

---

### Problema 5: Falta de memória (OOM - Out of Memory)

**Sintomas**: Aplicação trava, PM2 reinicia constantemente.

**Solução**:

```bash
# 1. Verificar uso de memória
free -h
htop

# 2. Adicionar arquivo swap (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 3. Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 4. Verificar swap ativo
free -h

# 5. Reduzir instâncias PM2 (se necessário)
pm2 scale taskscribe-lp 2  # Reduzir para 2 instâncias

# 6. Aumentar limite de memória no ecosystem.config.js
nano ~/taskScribe/lp/ecosystem.config.js
# Alterar: max_memory_restart: '1G'
pm2 reload ecosystem.config.js
```

---

### Problema 6: Site lento / Alta latência

**Causas possíveis**:

1. Cache não configurado
2. Sem compressão Gzip
3. Build não otimizado
4. Muitas instâncias PM2

**Solução**:

```bash
# 1. Verificar cache Nginx (já configurado)
curl -I https://taskscribe.com/_next/static/...
# Deve ter: Cache-Control: public, max-age=...

# 2. Verificar Gzip
curl -I -H "Accept-Encoding: gzip" https://taskscribe.com
# Deve ter: Content-Encoding: gzip

# 3. Rebuild com otimizações
cd ~/taskScribe/lp
yarn build
pm2 reload taskscribe-lp

# 4. Ajustar PM2 (usar 'max' para cluster)
# No ecosystem.config.js:
# instances: 'max'

# 5. Testar performance
curl -w "@-" -o /dev/null -s https://taskscribe.com <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

---

### Problema 7: Logs gigantes ocupando disco

**Solução**:

```bash
# 1. Verificar tamanho dos logs
du -sh ~/logs
du -sh /var/log/nginx

# 2. Limpar logs antigos manualmente
find ~/logs -name "*.log" -mtime +30 -delete

# 3. Configurar rotação (já configurado anteriormente)
cat /etc/logrotate.d/pm2-taskscribe

# 4. Forçar rotação
sudo logrotate -f /etc/logrotate.d/pm2-taskscribe

# 5. Limitar tamanho de logs PM2 (ecosystem.config.js)
max_size: '10M',
max_files: 5,
```

---

## ✅ Checklist Final - Deploy VPS

### Setup Inicial

- [ ] VPS acessível via SSH
- [ ] Sistema atualizado (`apt update && apt upgrade`)
- [ ] Node.js 20+ instalado
- [ ] Yarn instalado
- [ ] PM2 instalado
- [ ] Git instalado
- [ ] Nginx instalado
- [ ] Certbot instalado
- [ ] Usuário não-root criado (`taskscribe`)

### Aplicação

- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] `.env.local` configurado
- [ ] Build completado com sucesso
- [ ] PM2 rodando aplicação
- [ ] PM2 configurado para iniciar no boot
- [ ] Logs sendo gerados corretamente

### Nginx & SSL

- [ ] Nginx configurado como proxy reverso
- [ ] Site acessível via HTTP
- [ ] DNS apontando para VPS
- [ ] Certificado SSL obtido (Let's Encrypt)
- [ ] Site acessível via HTTPS
- [ ] Renovação automática de SSL testada
- [ ] Headers de segurança configurados
- [ ] Gzip habilitado
- [ ] Cache configurado

### Segurança

- [ ] Firewall (ufw) ativo
- [ ] SSH hardening (root login desabilitado)
- [ ] Fail2Ban instalado
- [ ] Atualizações automáticas habilitadas
- [ ] Rate limiting configurado

### CI/CD

- [ ] Script de deploy criado
- [ ] Chaves SSH geradas
- [ ] GitHub Secrets configurados
- [ ] Workflow do GitHub Actions criado
- [ ] Deploy automático testado e funcionando

### Monitoramento

- [ ] Logs acessíveis (PM2 e Nginx)
- [ ] Rotação de logs configurada
- [ ] Backup automático agendado
- [ ] Monitoramento de uptime configurado (opcional)
- [ ] Alertas configurados (opcional)

### Performance

- [ ] Lighthouse score > 90
- [ ] Tempo de resposta < 500ms
- [ ] Gzip funcionando
- [ ] Cache funcionando
- [ ] Recursos do servidor adequados

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Ferramentas de Teste

- **SSL Test**: [SSL Labs](https://www.ssllabs.com/ssltest/)
- **Performance**: [PageSpeed Insights](https://pagespeed.web.dev/)
- **Security Headers**: [Security Headers](https://securityheaders.com/)
- **DNS**: [DNS Checker](https://dnschecker.org/)

### Monitoramento (Gratuito)

- [UptimeRobot](https://uptimerobot.com) - Monitoring uptime
- [BetterUptime](https://betteruptime.com) - Incident management
- [LogTail](https://logtail.com) - Log management
- [Sentry](https://sentry.io) - Error tracking

---

## 🆘 Suporte

**Problemas com Hostinger VPS**:

- Chat 24/7: [Hostinger Support](https://www.hostinger.com.br/contato)
- Tutorial VPS: [Hostinger Tutorials](https://www.hostinger.com.br/tutoriais/vps)

**Problemas com configuração**:

- PM2 Issues: [GitHub Issues](https://github.com/Unitech/pm2/issues)
- Nginx Forum: [Nginx Forum](https://forum.nginx.org/)
- Next.js Discord: [Vercel Discord](https://discord.gg/nextjs)

---

**Última atualização**: Dezembro 2025  
**Versão**: 2.0.0  
**Autor**: TaskScribe Team
