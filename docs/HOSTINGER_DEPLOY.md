# Guia de Deploy na Hostinger

Este documento descreve como configurar e resolver problemas do deploy da landing page TaskScribe na Hostinger.

## Arquitetura do Deploy

A Hostinger usa **Phusion Passenger** para rodar aplicações Node.js. Isso significa que:

1. O servidor espera um arquivo `server.js` na raiz do projeto
2. A configuração Apache é feita via `.htaccess`
3. As variáveis de ambiente precisam ser configuradas no painel da Hostinger

## Arquivos de Configuração

### 1. server.js (raiz do projeto)

Este arquivo é necessário para o Phusion Passenger iniciar o Next.js:

```javascript
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

### 2. public/.htaccess

Este arquivo configura o Apache para servir corretamente os arquivos:

- Configura MIME types corretos para JS, CSS, etc.
- Habilita compressão gzip
- Configura caching
- Força HTTPS
- Redireciona para o Node.js

⚠️ **IMPORTANTE**: O `.htaccess` no diretório `public/` é copiado para a raiz do build durante o deploy.

## Variáveis de Ambiente Necessárias

No painel da Hostinger, configure estas variáveis:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_URL=https://taskscribe.com.br
NEXT_PUBLIC_POSTHOG_API_KEY=sua_chave_aqui
```

## Processo de Deploy

### Via Git (Recomendado)

1. Configure o repositório no painel da Hostinger
2. Escolha a branch correta (main/master)
3. Configure o build command: `npm install && npm run build`
4. Configure o start command: `npm start`

### Via CLI

```bash
# Build local
npm run build

# Comprimir o build
zip -r build.zip .next package.json server.js public

# Upload via FTP ou painel
```

## Troubleshooting

### Erro: "Application error: a client-side exception has occurred"

**Causas comuns:**

1. **i18n não inicializado**: O `I18nProvider` pode falhar em ambientes SSR
   - ✅ Solucionado: `i18n/config.ts` agora verifica `typeof window`
2. **Service Workers antigos**: Cache de versões anteriores

   - Solução: Acessar `/api/diagnostic` e limpar tudo

3. **MIME Types incorretos**: Arquivos .js servidos como text/plain

   - ✅ Solucionado: `.htaccess` configura MIME types

4. **CSP muito restritivo**: Content-Security-Policy bloqueando scripts
   - Verificar headers no DevTools > Network

### Como verificar MIME types

```bash
curl -I https://taskscribe.com.br/_next/static/chunks/main.js
```

O header `Content-Type` deve ser `application/javascript`.

### Logs do Servidor

Na Hostinger, acesse:

1. hPanel > Avançado > Gerenciador de Arquivos
2. Navegue até `logs/error_log`
3. Ou `logs/access_log` para ver requests

### Página de Diagnóstico

Acesse `https://taskscribe.com.br/api/diagnostic` para:

- Verificar service workers
- Limpar cache/storage
- Testar carregamento de assets

## Checklist de Deploy

- [ ] `server.js` está na raiz do projeto
- [ ] `public/.htaccess` está presente
- [ ] Variáveis de ambiente configuradas no painel
- [ ] Build executado com sucesso (`npm run build`)
- [ ] Node.js versão correta (18+) no painel
- [ ] DNS configurado corretamente
- [ ] SSL/HTTPS habilitado

## Forçar Atualização de Cache

Se usuários estão vendo versões antigas:

1. **Para desenvolvedores**: Adicione query string `?v=1234` nos assets
2. **Para usuários**: Instrua a usar Ctrl+F5 ou Ctrl+Shift+R
3. **Cache busting automático**: O `layout.tsx` já tem um script que detecta novas builds

## Contato

Se os problemas persistirem após seguir este guia, verifique:

- Console do navegador (F12 > Console)
- Network tab para requests falhos
- Logs do servidor no painel Hostinger
