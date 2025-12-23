# 🚨 CONFIGURAÇÃO MANUAL NECESSÁRIA - HOSTINGER

## ⚠️ Problema Identificado

A Hostinger **SOBRESCREVE** automaticamente os arquivos:

- `server.js`
- `public/.htaccess`

Após cada build/deploy, esses arquivos voltam ao estado inicial.

---

## ✅ SOLUÇÃO - Configuração Manual (UMA VEZ)

### Passo 1: Aguarde o Auto-Deploy

Após fazer push, aguarde 2-5 minutos para a Hostinger fazer o build.

### Passo 2: Via File Manager da Hostinger

1. **Acesse:** hPanel → File Manager
2. **Navegue até:** `/home/u255583227/domains/taskscribe.com.br/public_html`
3. **Edite o arquivo `server.js`**
4. **Substitua TODO o conteúdo** pelo código do arquivo `server.js.hostinger` (que está neste repositório)
5. **Salve**

### Passo 3: Reiniciar Aplicação

No painel Node.js Apps:

- Clique em **Restart**

### Passo 4: Testar

- Limpe o cache: Cmd+Shift+R
- Acesse: https://taskscribe.com.br

---

## 📋 ALTERNATIVA: Script Automático (Requer SSH)

Se você tem acesso SSH, pode criar um script:

```bash
# Conectar via SSH
ssh u255583227@srv1659.hstgr.io

# Criar script de pós-deploy
cat > /home/u255583227/fix-server.sh << 'EOF'
#!/bin/bash
cp /home/u255583227/server.js.backup /home/u255583227/domains/taskscribe.com.br/public_html/server.js
touch /home/u255583227/domains/taskscribe.com.br/tmp/restart.txt
EOF

chmod +x /home/u255583227/fix-server.sh

# Salvar backup do server.js correto
cp server.js.hostinger /home/u255583227/server.js.backup

# Executar após cada deploy
/home/u255583227/fix-server.sh
```

---

## 🎯 Quando Fazer Isso

**Você precisa editar o server.js manualmente APENAS quando:**

- Fizer o primeiro deploy
- A Hostinger fizer um rebuild completo
- Reiniciar o servidor/aplicação pelo painel

**Não precisa fazer após cada push de código**, apenas quando o servidor for reiniciado completamente.

---

## 📊 Como Verificar se Funcionou

1. Acesse https://taskscribe.com.br
2. Abra DevTools (F12) → Network
3. Filtre por "Fetch/XHR"
4. Recarregue a página
5. Os arquivos `/_next/static/chunks/*.css` e `*.js` devem retornar **200 OK**

Se retornar 404, o server.js foi sobrescrito novamente.
