# 🚀 TaskScribe - Roadmap de Performance (Lighthouse)

> Plano de ação para otimização de performance baseado na análise do Google Lighthouse.

**Última atualização:** 24 de Dezembro de 2024
**Score Atual:** 74%
**Meta:** 90%+

---

## 📊 Sumário Executivo

O site apresenta bom desempenho em métricas essenciais (LCP, FCP, CLS), mas sofre com **Total Blocking Time elevado (1,450ms)** causado principalmente por JavaScript excessivo. Este documento detalha as ações necessárias para alcançar score 90%+ no Lighthouse.

---

## 📈 Métricas Atuais vs Meta

| Métrica                  | Atual       | Score    | Meta       | Status |
| ------------------------ | ----------- | -------- | ---------- | ------ |
| **Performance Score**    | 74%         | 0.74     | 90%+       | 🔴     |
| First Contentful Paint   | 1.3s        | 0.98     | <1.8s      | ✅     |
| Largest Contentful Paint | 1.8s        | 0.98     | <2.5s      | ✅     |
| **Total Blocking Time**  | **1,450ms** | **0.15** | **<200ms** | 🔴     |
| Cumulative Layout Shift  | 0           | 1.0      | <0.1       | ✅     |
| Speed Index              | 1.6s        | 1.0      | <3.4s      | ✅     |

---

## 🔴 Prioridade CRÍTICA (Esta Semana)

### 1. ⚠️ Corrigir MIME Type dos Scripts Next.js

**Problema:** Scripts estão sendo servidos com `Content-Type: text/plain` ao invés de `application/javascript`, bloqueando a execução.

**Arquivos afetados:**

```
/_next/static/chunks/32d99f15292dc322.js
/_next/static/chunks/94f0e1c411a3145a.js
/_next/static/chunks/f4303b1b4a454276.js
/_next/static/chunks/turbopack-ba98df79f3069795.js
```

**Impacto:** CRÍTICO - Scripts não executam, funcionalidades quebram

#### Checklist de Solução:

- [ ] **Verificar configuração do servidor/CDN**

  - [ ] Checar headers da Vercel
  - [ ] Revisar `next.config.js` ou `next.config.mjs`
  - [ ] Verificar se há middleware interferindo

- [ ] **Adicionar headers corretos** (se usando Vercel)

Criar/atualizar `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/_next/static/(.*).js",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/javascript; charset=utf-8"
        }
      ]
    }
  ]
}
```

- [ ] **Testar em produção**
  - [ ] Fazer deploy
  - [ ] Verificar headers com DevTools (Network tab)
  - [ ] Confirmar que scripts executam corretamente

---

### 2. 🔍 Investigar e Corrigir Erros 500

**Problema:** 4 requisições retornando erro 500 no console

**Impacto:** Médio-Alto - Afeta funcionalidades e score de confiabilidade

#### Checklist de Investigação:

- [ ] **Identificar recursos que falham**

  - [ ] Abrir DevTools → Console
  - [ ] Listar URLs que retornam 500
  - [ ] Verificar se são APIs internas ou externas

- [ ] **Analisar logs do servidor**

  - [ ] Verificar logs da Vercel
  - [ ] Identificar stack traces de erros
  - [ ] Determinar causa raiz

- [ ] **Implementar correções**

  - [ ] Corrigir endpoints com erro
  - [ ] Adicionar error handling adequado
  - [ ] Implementar fallbacks quando apropriado

- [ ] **Validar solução**
  - [ ] Testar localmente
  - [ ] Deploy e teste em produção
  - [ ] Confirmar que não há mais erros 500

---

### 3. ⚡ Reduzir Total Blocking Time (TBT: 1,450ms → <200ms)

**Problema:** JavaScript bloqueando thread principal por 1.45 segundos

**Breakdown atual:**

- Script Parsing & Compilation: 1,235ms
- Script Evaluation: 948ms
- Other: 766ms

**Meta:** Reduzir TBT para <200ms

#### 3.1 Análise de JavaScript

- [ ] **Auditar bundles JavaScript**

  - [ ] Instalar `@next/bundle-analyzer`

  ```bash
  npm install @next/bundle-analyzer
  ```

  - [ ] Adicionar ao `next.config.js`:

  ```javascript
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });

  module.exports = withBundleAnalyzer({
    // ... outras configs
  });
  ```

  - [ ] Rodar análise: `ANALYZE=true npm run build`
  - [ ] Identificar pacotes grandes (>100KB)

#### 3.2 Code Splitting e Lazy Loading

- [ ] **Implementar dynamic imports para componentes pesados**

  ```typescript
  // Antes
  import HeavyComponent from "./HeavyComponent";

  // Depois
  const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
    loading: () => <Skeleton />,
    ssr: false, // se não precisa SSR
  });
  ```

- [ ] **Componentes candidatos para lazy loading:**
  - [ ] Modais e Dialogs
  - [ ] Formulários complexos
  - [ ] Gráficos e visualizações
  - [ ] Carousels de imagens
  - [ ] Chat/Intercom widgets
  - [ ] Analytics (Google Analytics, PostHog)

#### 3.3 Otimizar Bibliotecas de UI

- [ ] **Revisar importações do Radix UI**

  ```typescript
  // Evitar importar tudo
  // Ruim: import * from '@radix-ui/react-dialog'

  // Bom: importar apenas o necessário
  import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
  ```

- [ ] **Avaliar substituições de bibliotecas pesadas**
  - [ ] Identificar libs >50KB
  - [ ] Buscar alternativas mais leves
  - [ ] Considerar implementações customizadas para casos simples

#### 3.4 Otimizar Analytics e Third-Party Scripts

- [ ] **Postergar carregamento de analytics**

  ```typescript
  // Em GoogleAnalytics.tsx
  <Script
    src="..."
    strategy="lazyOnload" // ao invés de "afterInteractive"
  />
  ```

- [ ] **Usar Partytown para third-party scripts**
  ```bash
  npm install @builder.io/partytown
  ```
  - [ ] Configurar Partytown no `next.config.js`
  - [ ] Mover scripts pesados para Web Worker

#### 3.5 Tree Shaking e Dead Code Elimination

- [ ] **Verificar imports não utilizados**

  - [ ] Rodar `npx depcheck`
  - [ ] Remover dependências não usadas
  - [ ] Limpar imports não utilizados

- [ ] **Otimizar Tailwind CSS**
  - [ ] Verificar `purge` config no `tailwind.config.js`
  - [ ] Garantir que apenas classes usadas são incluídas

---

## 🟡 Prioridade ALTA (Próxima Semana)

### 6. 🖼️ Otimizar Entrega de Imagens ✅

**Problema:** Imagens não otimizadas (score: 0.5)

**Economia potencial:** Identificada pelo Lighthouse

**Status:** ✅ CONCLUÍDO

#### 6.1 Converter para Formatos Modernos ✅

- [x] **WebP e AVIF configurado**

  - [x] Next.js configurado para servir AVIF e WebP automaticamente
  - [x] Formatos modernos habilitados na configuração
  - [x] Quality ajustado para 85% (ótimo balanço qualidade/tamanho)

- [x] **Configuração do Next.js**
  - Arquivo: `next.config.ts:111-120`
  ```javascript
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  }
  ```

#### 6.2 Lazy Loading de Imagens ✅

- [x] **Lazy loading implementado**

  - Arquivo: `app/components/cards/feature-card.tsx:57-66`
  ```tsx
  <Image
    src={imageSrc}
    loading="lazy"
    quality={85}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
  />
  ```

- [x] **Footer logo com lazy loading**
  - Arquivo: `app/components/layout/footer.tsx:20`
  - Logo abaixo do fold agora carrega lazy ✅

- [x] **Header logo com priority**
  - Arquivo: `app/components/layout/header.tsx:35`
  - Logo acima do fold com `priority` para carregamento imediato ✅

#### 6.3 Dimensionamento Correto ✅

- [x] **Sizes prop configurado corretamente**
  - Responsive: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px`
  - Next.js agora serve tamanho otimizado para cada viewport
  - Reduz significativamente o peso das imagens em dispositivos móveis ✅

---

### 7. 🚫 Reduzir Render Blocking Resources (score: 0.5)

**Problema:** Recursos bloqueando renderização inicial

#### Checklist:

- [ ] **Identificar recursos bloqueantes**

  - [ ] Ver lista no relatório Lighthouse
  - [ ] Priorizar fontes, CSS crítico

- [ ] **Otimizar fontes**

  ```tsx
  // app/layout.tsx
  import { Inter } from "next/font/google";

  const inter = Inter({
    subsets: ["latin"],
    display: "swap", // FOUT ao invés de FOIT
    preload: true,
  });
  ```

- [ ] **Inline CSS crítico**

  - [ ] Identificar CSS above-the-fold
  - [ ] Considerar usar `@tailwindcss/postcss` com otimizações

- [ ] **Defer de scripts não essenciais**
  ```tsx
  <Script src="..." strategy="lazyOnload" />
  ```

---

## 🟢 Prioridade MÉDIA (Próximas 2 Semanas)

### 8. 💾 Configurar Cache-Control para Back/Forward Cache

**Problema:** `cache-control: no-store` impede back/forward cache

**Benefício:** Navegação instantânea quando usuário usa botão voltar

#### Checklist:

- [ ] **Revisar headers de cache**

  ```javascript
  // vercel.json ou next.config.js
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      },
      {
        "source": "/_next/static/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
  ```

- [ ] **Evitar `no-store` em recursos**

  - [ ] Identificar APIs que retornam `no-store`
  - [ ] Substituir por `max-age=0, must-revalidate` quando possível

- [ ] **Testar Back/Forward Cache**
  - [ ] Navegar entre páginas
  - [ ] Usar botão voltar
  - [ ] Verificar se página restaura instantaneamente

---

## 📋 Checklist Geral de Performance

### JavaScript

- [ ] Bundle size < 200KB (gzip)
- [ ] Code splitting implementado
- [ ] Lazy loading de componentes pesados
- [ ] Analytics carregados com `lazyOnload`
- [ ] Tree shaking configurado
- [ ] Dependências desnecessárias removidas

### CSS

- [ ] CSS crítico inline (se necessário)
- [ ] Tailwind purge configurado
- [ ] Fontes otimizadas com `font-display: swap`
- [ ] Sem CSS não utilizado

### Imagens

- [x] Formato WebP/AVIF ✅
- [x] Lazy loading abaixo do fold ✅
- [x] Dimensões corretas (width/height) ✅
- [x] Sizes prop configurado ✅
- [x] Quality otimizado (85%) ✅

### Acessibilidade

- [x] Todos botões com aria-label ou texto ✅
- [x] Contraste de cores WCAG AA (4.5:1) ✅
- [x] Landmark `<main>` presente ✅
- [x] Hierarquia de headings correta ✅
- [ ] Navegação por teclado funcional

### Cache e Headers

- [ ] MIME types corretos
- [ ] Cache-Control otimizado
- [ ] Compressão gzip/brotli ativa
- [ ] Back/forward cache habilitado

### Monitoramento

- [x] Lighthouse CI instalado ✅
- [x] Scripts npm configurados (lighthouse, perf-test) ✅
- [ ] Web Vitals sendo monitorados (PostHog/GA)
- [ ] Alertas para regressões de performance

---

## 🎯 Metas de Performance

| Período      | Performance Score | TBT     | LCP   | Acessibilidade |
| ------------ | ----------------- | ------- | ----- | -------------- |
| **Atual**    | 74%               | 1,450ms | 1.8s  | ~70%           |
| **Semana 1** | 80%+              | <800ms  | <1.5s | 90%+           |
| **Semana 2** | 85%+              | <400ms  | <1.2s | 95%+           |
| **Semana 3** | 90%+              | <200ms  | <1.0s | 100%           |

---

## 📊 Como Medir Progresso

### Lighthouse CI (Recomendado)

```bash
# Instalar
npm install -g @lhci/cli

# Rodar localmente
lhci autorun

# Ver tendências
lhci collect --url=https://taskscribe.com.br
```

### PageSpeed Insights

- [https://pagespeed.web.dev/?url=https://taskscribe.com.br](https://pagespeed.web.dev/?url=https://taskscribe.com.br)

### Chrome DevTools

1. Abrir DevTools (F12)
2. Aba Lighthouse
3. Gerar relatório (Mobile e Desktop)
4. Comparar com baseline

---

## 🔧 Ferramentas Úteis

### Análise

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

### Otimização de Imagens

- [Squoosh](https://squoosh.app/) - Compressor de imagens
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Otimizador de SVG
- [Plaiceholder](https://plaiceholder.co/) - Blur placeholders

### Acessibilidade

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Monitoramento

- [Vercel Analytics](https://vercel.com/analytics)
- [Google Search Console](https://search.google.com/search-console)
- [PostHog](https://posthog.com/)

---

## 📝 Notas de Implementação

### Ordem de Execução Recomendada

1. **Semana 1 - Crítico:**

   - Corrigir MIME types
   - Resolver erros 500
   - Implementar code splitting básico

2. **Semana 2 - Alta:**

   - Otimizar JavaScript (TBT)
   - Corrigir acessibilidade
   - Otimizar imagens

3. **Semana 3 - Média:**
   - Configurar cache
   - Ajustes finais de HTML semântico
   - Monitoramento contínuo

### Scripts Úteis

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "lighthouse": "lhci autorun",
    "perf-test": "npm run build && npm run lighthouse"
  }
}
```

---

**Responsável:** Wallyson Galvão
**Revisão:** Mensal ou após mudanças significativas
**Última análise Lighthouse:** 24/12/2024
