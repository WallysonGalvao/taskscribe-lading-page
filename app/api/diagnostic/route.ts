import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Diagnóstico - TaskScribe</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
        .success { color: #4ec9b0; }
        .error { color: #f48771; }
        .warning { color: #ce9178; }
        h1 { color: #4ec9b0; }
        h2 { color: #dcdcaa; margin-top: 20px; }
        pre { background: #2d2d2d; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .box { background: #252526; border: 1px solid #3e3e42; padding: 15px; margin: 10px 0; border-radius: 4px; }
        button { background: #0e639c; color: white; border: none; padding: 10px 20px; cursor: pointer; margin: 5px; border-radius: 4px; }
        button:hover { background: #1177bb; }
    </style>
</head>
<body>
    <h1>🔍 Diagnóstico TaskScribe</h1>
    <div id="results"></div>
    
    <div class="box">
        <h2>Ações Rápidas:</h2>
        <button onclick="clearAll()">🗑️ Limpar Tudo</button>
        <button onclick="location.reload()">🔄 Recarregar</button>
        <button onclick="window.open('/', '_blank')">🏠 Abrir Home (nova aba)</button>
    </div>
    
    <script>
        const results = document.getElementById('results');
        
        function log(message, type = 'info') {
            const div = document.createElement('div');
            div.className = type;
            div.innerHTML = message;
            results.appendChild(div);
        }
        
        function clearAll() {
            if (confirm('Limpar todo o storage, cookies e cache?')) {
                // Limpar storage
                localStorage.clear();
                sessionStorage.clear();
                
                // Limpar cookies
                document.cookie.split(";").forEach(c => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                
                // Desregistrar service workers
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        registrations.forEach(reg => reg.unregister());
                    });
                }
                
                alert('✅ Limpeza concluída! Recarregando...');
                location.reload();
            }
        }
        
        // Info do navegador
        log('<div class="box"><h2>1️⃣ Informações do Navegador</h2>');
        log(\`<strong>User Agent:</strong> \${navigator.userAgent}\`);
        log(\`<strong>Cookies Habilitados:</strong> \${navigator.cookieEnabled ? '✅' : '❌'}\`);
        log(\`<strong>Online:</strong> \${navigator.onLine ? '✅' : '❌'}\`);
        log(\`<strong>Idioma:</strong> \${navigator.language}\`);
        log('</div>');
        
        // Verificar Service Workers
        log('<div class="box"><h2>2️⃣ Service Workers</h2>');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length === 0) {
                    log('✅ Nenhum service worker registrado', 'success');
                } else {
                    log(\`❌ <strong>\${registrations.length} service worker(s) encontrado(s):</strong>\`, 'error');
                    registrations.forEach((reg, i) => {
                        log(\`  \${i + 1}. \${reg.scope}\`, 'error');
                    });
                    log('<button onclick="clearAll()">Remover Service Workers</button>', 'warning');
                }
                log('</div>');
            });
        } else {
            log('⚠️ Service Workers não suportados', 'warning');
            log('</div>');
        }
        
        // Verificar Storage
        log('<div class="box"><h2>3️⃣ Local Storage</h2>');
        if (localStorage.length === 0) {
            log('✅ Local Storage vazio', 'success');
        } else {
            log(\`❌ <strong>\${localStorage.length} item(ns) encontrado(s):</strong>\`, 'error');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                log(\`  <strong>\${key}:</strong> \${value.substring(0, 100)}\${value.length > 100 ? '...' : ''}\`, 'error');
            }
        }
        log('</div>');
        
        log('<div class="box"><h2>4️⃣ Session Storage</h2>');
        if (sessionStorage.length === 0) {
            log('✅ Session Storage vazio', 'success');
        } else {
            log(\`❌ <strong>\${sessionStorage.length} item(ns) encontrado(s):</strong>\`, 'error');
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const value = sessionStorage.getItem(key);
                log(\`  <strong>\${key}:</strong> \${value.substring(0, 100)}\${value.length > 100 ? '...' : ''}\`, 'error');
            }
        }
        log('</div>');
        
        // Verificar Cookies
        log('<div class="box"><h2>5️⃣ Cookies</h2>');
        const cookies = document.cookie.split(';').filter(c => c.trim());
        if (cookies.length === 0) {
            log('✅ Nenhum cookie encontrado', 'success');
        } else {
            log(\`❌ <strong>\${cookies.length} cookie(s) encontrado(s):</strong>\`, 'error');
            cookies.forEach(cookie => {
                log(\`  \${cookie.trim()}\`, 'error');
            });
        }
        log('</div>');
        
        // Testar Assets
        log('<div class="box"><h2>6️⃣ Teste de Assets</h2>');
        log('Testando carregamento de assets...');
        
        // Testa arquivo estático real (logo)
        fetch('/logo-icon.svg')
            .then(r => {
                log(\`Logo SVG: \${r.status} \${r.statusText}\`, r.ok ? 'success' : 'error');
            })
            .catch(e => {
                log(\`Logo SVG Error: \${e.message}\`, 'error');
            });
        
        // Testa se consegue carregar a home
        fetch('/')
            .then(r => {
                log(\`Home Status: \${r.status} \${r.statusText}\`, r.ok ? 'success' : 'error');
                // Verifica content-type
                const contentType = r.headers.get('content-type');
                log(\`Home Content-Type: \${contentType}\`, contentType?.includes('html') ? 'success' : 'warning');
                log('</div>');
            })
            .catch(e => {
                log(\`Home Error: \${e.message}\`, 'error');
                log('</div>');
            });
            
        // Resumo
        setTimeout(() => {
            log('<div class="box" style="background: #1e3a5f; border-color: #4ec9b0;"><h2>📋 Recomendações:</h2>');
            
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(regs => {
                    if (regs.length > 0 || localStorage.length > 0 || cookies.length > 0) {
                        log('<p class="error"><strong>⚠️ AÇÃO NECESSÁRIA:</strong></p>');
                        log('<p>Foi detectado armazenamento/cache antigo. Clique no botão abaixo:</p>');
                        log('<button onclick="clearAll()" style="background: #f48771; font-size: 16px; padding: 15px 30px;">🗑️ LIMPAR TUDO E RECARREGAR</button>');
                    } else {
                        log('<p class="success">✅ Navegador limpo! Se ainda houver erro, o problema pode ser:</p>');
                        log('<ul><li>Extensões do navegador interferindo</li><li>DNS cache (flush DNS)</li><li>Teste em modo anônimo</li></ul>');
                    }
                    log('</div>');
                });
            }
        }, 1000);
    </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
