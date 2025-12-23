# 🔧 Troubleshooting - Erros 404 de Assets CSS/JS

## Problema

Arquivos CSS e JS estão retornando 404:

- `/_next/static/chunks/9fa8c5bb457f473b.css` → 404
- `/_next/static/chunks/cc61e17397805473.js` → 404

## Causa Provável

O Next.js não está sendo executado corretamente no servidor ou a pasta `.next` não foi gerada.

---

## ✅ Checklist de Verificação (Via File Manager ou SSH)

### 1. Verificar se a pasta `.next` existe

**Caminho:** `/home/u255583227/domains/taskscribe.com.br/public_html/.next`

- [ ] A pasta `.next` existe?
- [ ] Dentro dela existe a pasta `static/chunks/`?
- [ ] Os arquivos CSS/JS estão lá?

**Se NÃO existir**, o build não rodou. Veja seção "Forçar Rebuild".

### 2. Verificar logs do Passenger

**Via SSH (se tiver acesso):**

```bash
tail -f ~/logs/passenger.log
# ou
tail -f ~/domains/taskscribe.com.br/logs/passenger.log
```

**Via Painel Hostinger:**

- Node.js Apps → Ver Logs

**Procure por erros como:**

- `Cannot find module 'next'`
- `Error: ENOENT: no such file or directory, open '.next/BUILD_ID'`
- Erros de permissão

### 3. Verificar se `node_modules` existe

**Caminho:** `/home/u255583227/domains/taskscribe.com.br/public_html/node_modules`

- [ ] A pasta `node_modules` existe?
- [ ] Dentro dela existe a pasta `next/`?

**Se NÃO existir**, rode `yarn install` no servidor.

### 4. Verificar se o `server.js` está correto

**Caminho:** `/home/u255583227/domains/taskscribe.com.br/public_html/server.js`

Deve existir e ter permissão de execução (chmod +x).

---

## 🔄 Soluções

### Solução 1: Forçar Rebuild via SSH (RECOMENDADO)

Se você tem acesso SSH:

```bash
# Conectar ao servidor
ssh u255583227@srv1659.hstgr.io

# Navegar até a pasta
cd /home/u255583227/domains/taskscribe.com.br/public_html

# Limpar build anterior
rm -rf .next

# Instalar dependências
yarn install --production=false

# Fazer build
yarn build

# Verificar se .next foi criado
ls -la .next

# Reiniciar aplicação
touch tmp/restart.txt
# ou via painel: Node.js Apps → Restart
```

### Solução 2: Forçar Rebuild via Painel Hostinger

1. Acesse o File Manager
2. Delete a pasta `.next` (se existir)
3. No painel **Node.js Apps**:
   - Clique em **Rebuild**
   - Ou clique em **Stop** → **Start**

### Solução 3: Verificar Configuração do Painel

No painel **Node.js Apps**, certifique-se:

**Application Startup File:** `server.js`
**Application Root:** `/home/u255583227/domains/taskscribe.com.br/public_html`
**Node.js Version:** 20.x ou superior

**Environment Variables (Adicionar se não existir):**

```
NODE_ENV=production
PORT=3000
```

---

## 🧪 Testar Manualmente

Via SSH, você pode testar se o servidor está funcionando:

```bash
cd /home/u255583227/domains/taskscribe.com.br/public_html

# Rodar servidor manualmente (para debug)
NODE_ENV=production node server.js

# Deve aparecer:
# > TaskScribe LP ready on http://0.0.0.0:3000 (production)
```

Se isso funcionar, o problema é o Passenger. Reinicie via painel.

---

## 📋 Informações do Servidor

**Servidor:** srv1659.hstgr.io  
**Usuário:** u255583227  
**Caminho:** `/home/u255583227/domains/taskscribe.com.br/public_html`  
**Node Version:** 22.x (alt-nodejs22)

---

## 🆘 Se nada funcionar

1. **Verifique o console do navegador** - Copie o erro completo
2. **Verifique os logs do Passenger** - Copie os erros
3. **Tire screenshot** da estrutura de pastas no File Manager
4. **Verifique se o domínio está apontando corretamente** para a pasta

Entre em contato com o suporte da Hostinger se o problema persistir.
