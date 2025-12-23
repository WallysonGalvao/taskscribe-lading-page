# ⚠️ INSTRUÇÕES IMPORTANTES - CONFIGURAÇÃO HOSTINGER

## 🔧 Configuração no Painel Node.js Apps da Hostinger

**COPIE EXATAMENTE ESTAS CONFIGURAÇÕES:**

### 1. Application Startup File

```
npm start
```

OU

```
yarn start
```

### 2. Application Root

```
/home/u255583227/domains/taskscribe.com.br/public_html
```

### 3. Node.js Version

```
22.x
```

### 4. Environment Variables (Adicionar todas)

```
NODE_ENV=production
PORT=3000
```

---

## 📝 IMPORTANTE: Arquivos que a Hostinger Sobrescreve

⚠️ **NÃO EDITE ESTES ARQUIVOS MANUALMENTE NO SERVIDOR:**

- `public/.htaccess` - Gerado automaticamente pela Hostinger
- ~~`server.js`~~ - REMOVIDO! Agora usamos `npm start` padrão

A Hostinger gerencia esses arquivos automaticamente baseado nas configurações do painel.

---

## ✅ Após configurar, execute:

1. No painel Node.js Apps: **Save** → **Restart**
2. Aguarde 2-5 minutos
3. Limpe o cache do navegador (Cmd+Shift+R)
4. Acesse: https://taskscribe.com.br

---

## 🔍 Se ainda der erro 404

Verifique no File Manager se existe:

- `/public_html/.next/` - Se NÃO existir, o build falhou
- `/public_html/node_modules/` - Se NÃO existir, rode rebuild

**Como forçar rebuild:**

1. Painel Node.js Apps → **Stop**
2. Delete a pasta `.next` via File Manager
3. Node.js Apps → **Start**

---

## 📊 Como a Hostinger funciona:

1. Detecta push no GitHub
2. Faz `git pull`
3. Executa `yarn install` (ou `npm install`)
4. Executa `yarn build` (ou `npm run build`)
5. Gera/atualiza `public/.htaccess`
6. Reinicia o Passenger com o comando configurado

Por isso SEMPRE use `npm start` ou `yarn start` como startup command!
