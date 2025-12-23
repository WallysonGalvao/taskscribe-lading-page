# 🔧 Solução: Limpar Cache e Service Workers

## 🎯 Problema Identificado

Se um dispositivo acessa normalmente e outro não (mesma rede), o servidor está funcionando corretamente. O problema é **cache local do navegador**.

---

## ✅ Solução Completa - Chrome/Edge/Brave

### Passo 1: Limpar Cache Completo

1. Abra **DevTools** (F12 ou Cmd+Option+I)
2. Vá em **Application** (ou Aplicativo)
3. No menu lateral, procure por:
   - **Storage** → Clique em **Clear site data**
   - Marque TODAS as opções:
     - ✅ Local storage
     - ✅ Session storage
     - ✅ IndexedDB
     - ✅ Web SQL
     - ✅ Cookies
     - ✅ Cache storage
     - ✅ Service workers
4. Clique em **Clear site data**

### Passo 2: Desregistrar Service Workers

1. Ainda em **Application**
2. Clique em **Service Workers** (menu lateral)
3. Se houver algum service worker registrado para `taskscribe.com.br`:
   - Clique em **Unregister**

### Passo 3: Limpar Cache de Rede

1. Vá em **Network** (Rede)
2. Clique com botão direito → **Clear browser cache**
3. Marque a opção **Disable cache** (deixe marcado)

### Passo 4: Hard Reload

Feche as DevTools e:
- **Mac:** Cmd + Shift + R
- **Windows/Linux:** Ctrl + Shift + R
- **Ou:** Cmd/Ctrl + Shift + Delete → Limpar dados de navegação

---

## ✅ Solução - Firefox

1. **Menu** → **Preferências** → **Privacidade e Segurança**
2. Em **Cookies e Dados de Sites**, clique em **Limpar Dados**
3. Marque:
   - ✅ Cookies e Dados de Sites
   - ✅ Conteúdo Web em Cache
4. Clique em **Limpar**
5. Recarregue: Cmd+Shift+R

---

## ✅ Solução - Safari (Mac)

1. **Safari** → **Preferências** → **Privacidade**
2. Clique em **Gerenciar Dados de Sites**
3. Procure por `taskscribe.com.br`
4. Clique em **Remover** ou **Remover Todos**
5. **Safari** → **Limpar Histórico**
6. Selecione "todo o histórico"
7. Recarregue: Cmd+Option+R

---

## 🧪 Teste em Modo Anônimo/Privado

Para confirmar que o problema é cache:

1. Abra uma **janela anônima/privada**:
   - Chrome/Edge: Ctrl+Shift+N (Win) / Cmd+Shift+N (Mac)
   - Firefox: Ctrl+Shift+P (Win) / Cmd+Shift+P (Mac)
   - Safari: Cmd+Shift+N
2. Acesse: https://taskscribe.com.br
3. Se funcionar = problema é cache!

---

## 🔍 Se Ainda Não Funcionar

Abra o **Console** (F12 → Console) e copie TODO o erro que aparecer. Geralmente será algo como:

```
Uncaught Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

Ou

```
Error: There was an error while hydrating. Because the error happened outside of a Suspense boundary...
```

Se aparecer esse tipo de erro, me envie o erro completo.

---

## 💡 Prevenção Futura

Para evitar esse problema no futuro, adicione no navegador:

1. DevTools → Network → ✅ **Disable cache** (deixe sempre marcado durante desenvolvimento)
2. Configure o navegador para não salvar cache de sites em desenvolvimento

---

## 🎯 Resumo Rápido

```bash
# Atalhos úteis:
Hard Reload (Mac):       Cmd + Shift + R
Hard Reload (Win/Linux): Ctrl + Shift + R
DevTools:                F12 ou Cmd/Ctrl + Shift + I
Modo Anônimo (Chrome):   Cmd/Ctrl + Shift + N
Limpar Cache:            Cmd/Ctrl + Shift + Delete
```

---

## ⚠️ Importante

O erro "client-side exception" indica que:
- ✅ O servidor está OK
- ✅ O HTML está sendo carregado
- ❌ O JavaScript/CSS em cache está desatualizado
- ❌ Causando erro de hidratação do React

Limpar o cache resolve 99% desses casos!
