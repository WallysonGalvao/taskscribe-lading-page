# 🚀 TaskScribe - Roadmap de SEO & Marketing

> Documento detalhado com próximos passos para otimização de SEO, presença online e crescimento orgânico.

**Última atualização:** 24 de Dezembro de 2024
**Status:** 75% Concluído ✅

---

## 📊 Sumário Executivo

Este documento detalha as estratégias e ações necessárias para maximizar a visibilidade do TaskScribe nos mecanismos de busca e estabelecer uma presença online sólida. As ações estão organizadas por prioridade e estimativa de impacto.

### 🎯 Progresso Geral

| Categoria                 | Status              | Progresso |
| ------------------------- | ------------------- | --------- |
| **SEO Técnico**           | ✅ Concluído        | 100%      |
| **Performance**           | ✅ Otimizado        | 85%       |
| **Analytics**             | ✅ Configurado      | 100%      |
| **Configuração Produção** | ✅ Completo         | 100%      |
| **Conteúdo**              | ⬜ Pendente         | 0%        |
| **Link Building**         | ⬜ Pendente         | 0%        |
| **Monitoramento**         | ⚠️ Parcial         | 60%       |

### ✅ Principais Conquistas

1. **SEO Técnico Completo:**
   - Sitemap, Robots.txt, Favicon
   - Meta tags, Open Graph, Twitter Cards
   - Schema.org JSON-LD (FAQPage, SoftwareApplication)
   - Hreflang tags (PT-BR, EN-US)

2. **Performance Otimizada:**
   - Score esperado: 74% → ~82-85%
   - TBT reduzido: ~500-700ms
   - Lazy loading, code splitting implementados
   - Cache-Control e Back/Forward Cache configurados

3. **Analytics e Produção Configurados:**
   - ✅ Google Analytics 4 (otimizado com `lazyOnload`)
   - ✅ PostHog Analytics
   - ✅ Google Search Console (propriedade verificada)
   - ✅ Vercel Analytics
   - ✅ Todas variáveis de ambiente configuradas na Hostinger
   - ✅ SMTP configurado para formulário de contato

### 🎯 Próximos Passos Prioritários

1. ⬜ **Submeter sitemap no Google Search Console** (aguardando indexação)
2. ⬜ **Testar Rich Results** com Schema.org validator
3. ⬜ Criar primeira página de comparação (vs Otter.ai)
4. ⬜ Iniciar blog com 3-5 artigos
5. ⬜ Submeter para Product Hunt e AlternativeTo

---

## ✅ Já Implementado

| Item                      | Arquivo                           | Status | Data       |
| ------------------------- | --------------------------------- | ------ | ---------- |
| Sitemap dinâmico          | `app/sitemap.ts`                  | ✅     | 24/12/2024 |
| Robots.txt                | `app/robots.ts`                   | ✅     | 24/12/2024 |
| Open Graph images         | `app/opengraph-image.tsx`         | ✅     | 23/12/2024 |
| Twitter Cards             | `app/twitter-image.tsx`           | ✅     | 23/12/2024 |
| Schema.org JSON-LD        | `app/components/seo/json-ld.tsx`  | ✅     | Anterior   |
| Meta tags completas       | `app/layout.tsx`                  | ✅     | Anterior   |
| Hreflang (PT/EN)          | `app/layout.tsx`                  | ✅     | Anterior   |
| Favicon SVG               | `app/icon.svg`                    | ✅     | 23/12/2024 |
| Google Analytics (GA4)    | `app/components/analytics/`       | ✅     | 24/12/2024 |
| Google Search Verification| `app/layout.tsx:172`              | ✅     | Anterior   |
| LLMs.txt (AEO)           | `public/llms.txt`                 | ✅     | 23/12/2024 |
| Performance Optimization  | Ver `lighthouse-performance-roadmap.md` | ✅ | 24/12/2024 |

---

## 🔴 Prioridade Alta (Esta Semana)

### 1. Configurar Variáveis de Ambiente de Produção ✅

**Objetivo:** Garantir que URLs e configurações estejam corretas em produção.

**Status:** ✅ TOTALMENTE CONFIGURADO (Hostinger)

**Variáveis configuradas:**

```env
# URL base do site
NEXT_PUBLIC_BASE_URL=https://www.taskscribe.com.br ✅

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX ✅

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxx ✅

# Build ID para cache busting
NEXT_PUBLIC_BUILD_ID=auto-gerado ✅

# SMTP para formulário de contato
SMTP_SERVER= ✅
SMTP_PORT= ✅
SMTP_USER= ✅
SMTP_PASSWORD= ✅
SMTP_TO= ✅
```

**Status na Hostinger:**
- ✅ SMTP configurado
- ✅ `NEXT_PUBLIC_BASE_URL` definido
- ✅ `NEXT_PUBLIC_GA_MEASUREMENT_ID` definido
- ✅ Todas variáveis de ambiente prontas para produção

---

### 2. Verificar Domínio no Google Search Console ✅

**Objetivo:** Indexar o site no Google e monitorar performance de busca.

**Status:** ✅ PROPRIEDADE VERIFICADA E ATIVA

**Implementado:**
- ✅ Meta tag de verificação em `app/layout.tsx:172-173`
  ```html
  <meta name="google-site-verification" content="b0TqUAE_dQjCZUHkWcsT4UBWnPxBZBzb3Ot2sOR5J_M" />
  ```
- ✅ Propriedade verificada: `https://www.taskscribe.com.br`
- ✅ Método de verificação: Tag HTML (automático)
- ✅ Sitemap disponível em `https://www.taskscribe.com.br/sitemap.xml`
- ✅ Robots.txt configurado em `https://www.taskscribe.com.br/robots.txt`

**Próximos passos:**

1. ⬜ **Submeter Sitemap no Google Search Console:**
   - Acesse [Google Search Console](https://search.google.com/search-console)
   - Vá em Sitemaps → Add a new sitemap
   - Digite: `sitemap.xml`
   - Clique em Submit

2. ⬜ **Aguardar indexação inicial:**
   - Google pode levar 1-7 dias para indexar as páginas
   - Acompanhar em "Coverage" ou "Pages"

3. ⬜ **Configurar alertas e relatórios:**
   - Configurar email para notificações de erros críticos
   - Agendar revisão semanal de métricas

4. **Métricas para acompanhar:**
   - Páginas indexadas
   - Erros de cobertura
   - Core Web Vitals
   - Palavras-chave de ranking
   - Impressões e cliques

---

### 3. Configurar Google Analytics 4 (GA4) ✅

**Objetivo:** Rastrear comportamento de usuários e conversões.

**Status:** ✅ JÁ IMPLEMENTADO E OTIMIZADO

**Implementação atual:**
- ✅ Componente criado em `app/components/analytics/google-analytics.tsx`
- ✅ Integrado no `app/layout.tsx:180`
- ✅ Strategy otimizada: `lazyOnload` (melhor performance) 🚀
- ✅ Variável de ambiente: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Código implementado:**
```typescript
// app/components/analytics/google-analytics.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="lazyOnload" // ✅ Otimizado para performance
/>
```

**Otimização de Performance:**
- ✅ Changed from `afterInteractive` to `lazyOnload`
- ✅ Reduz Total Blocking Time em ~200-300ms
- ✅ Não afeta First Input Delay

**Próximos passos:**
1. ⚠️ Verificar se `NEXT_PUBLIC_GA_MEASUREMENT_ID` está configurado na Hostinger
2. Validar que eventos estão sendo rastreados no GA4
3. Configurar conversões personalizadas (downloads, contatos)

---

### 4. Testar Rich Results (Schema.org)

**Objetivo:** Garantir que os rich snippets apareçam corretamente no Google.

**Ferramentas:**

1. [Rich Results Test](https://search.google.com/test/rich-results)

   - Cole a URL: `https://taskscribe.com.br`
   - Verifique se FAQPage, SoftwareApplication estão válidos

2. [Schema Markup Validator](https://validator.schema.org/)
   - Valide cada tipo de schema

**Resultado esperado:**

- ✅ FAQPage detected (perguntas frequentes)
- ✅ SoftwareApplication detected (info do app)
- ✅ Organization detected (empresa)
- ✅ WebSite detected (site)

---

## 🟡 Prioridade Média (Próximas 2 Semanas)

### 5. Otimizar Core Web Vitals ✅

**Objetivo:** Melhorar performance e ranking no Google.

**Status:** ✅ OTIMIZAÇÕES IMPLEMENTADAS

**Documento detalhado:** Ver `docs/lighthouse-performance-roadmap.md`

**Implementações concluídas (24/12/2024):**
1. ✅ Bundle Analyzer configurado (`npm run analyze`)
2. ✅ Lazy loading de componentes (ContactFormDialog)
3. ✅ Analytics otimizados (Google Analytics com `lazyOnload`)
4. ✅ Cache-Control para Back/Forward Cache
5. ✅ Fontes otimizadas (Sora com `display: swap`)
6. ✅ MIME types corrigidos
7. ✅ JavaScript MIME types (next.config.ts + .htaccess)
8. ✅ Imagens otimizadas (WebP/AVIF, lazy loading, sizes)

**Resultados esperados:**
- Performance Score: 74% → ~82-85% (+8-11%)
- Total Blocking Time: 1,450ms → ~750-950ms (-500-700ms)
- Back/Forward Cache: Habilitado para navegação instantânea

**Métricas-alvo:**

| Métrica                        | Bom    | Precisa Melhorar | Ruim   |
| ------------------------------ | ------ | ---------------- | ------ |
| LCP (Largest Contentful Paint) | ≤2.5s  | 2.5-4s           | >4s    |
| FID (First Input Delay)        | ≤100ms | 100-300ms        | >300ms |
| CLS (Cumulative Layout Shift)  | ≤0.1   | 0.1-0.25         | >0.25  |

**Ações:**

#### 5.1 Lazy Loading de Imagens

```tsx
import Image from "next/image";

// Usar loading="lazy" para imagens abaixo do fold
<Image src="/feature.png" alt="Feature" loading="lazy" placeholder="blur" />;
```

#### 5.2 Preload de Fontes Críticas

```html
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

#### 5.3 Otimizar CSS

- Remover CSS não utilizado
- Inline CSS crítico
- Usar `content-visibility: auto` para seções abaixo do fold

**Testar com:**

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [web.dev Measure](https://web.dev/measure/)
- Lighthouse no Chrome DevTools

---

### 6. Criar Páginas de Long Tail Keywords

**Objetivo:** Capturar tráfego de buscas específicas.

#### 6.1 Página de Comparação

**Arquivo:** `lp/app/vs/[competitor]/page.tsx`

| URL            | Competidor | Keywords                                 |
| -------------- | ---------- | ---------------------------------------- |
| `/vs/otter-ai` | Otter.ai   | "otter.ai alternativa", "otter vs local" |
| `/vs/descript` | Descript   | "descript alternativa privada"           |
| `/vs/trint`    | Trint      | "trint alternativa gratuita"             |
| `/vs/rev`      | Rev.com    | "rev transcription alternativa"          |

**Estrutura da página:**

```
# TaskScribe vs [Competidor]

## Comparação Rápida
[Tabela comparativa]

## Privacidade
[TaskScribe é 100% local, competidor envia para nuvem]

## Preço
[Comparar custos]

## Quando escolher TaskScribe
## Quando escolher [Competidor]

## FAQ específico
```

#### 6.2 Página de Casos de Uso

**Arquivo:** `lp/app/use-cases/[case]/page.tsx`

| URL                     | Caso de Uso | Keywords                                |
| ----------------------- | ----------- | --------------------------------------- |
| `/use-cases/meetings`   | Reuniões    | "transcrição de reuniões automatica"    |
| `/use-cases/podcasts`   | Podcasts    | "transcrever podcast para texto"        |
| `/use-cases/legal`      | Jurídico    | "transcrição audiências LGPD"           |
| `/use-cases/healthcare` | Saúde       | "transcrição consultas médicas privado" |
| `/use-cases/education`  | Educação    | "transcrever aulas palestras"           |

---

### 7. Blog com Conteúdo Educacional

**Objetivo:** Atrair tráfego orgânico com conteúdo de valor.

**Estrutura:** `lp/app/blog/[slug]/page.tsx`

**Ideias de artigos:**

| Título                                            | Keywords                          | Dificuldade |
| ------------------------------------------------- | --------------------------------- | ----------- |
| "Como Escolher o Melhor Modelo Whisper"           | whisper modelos diferenças        | Fácil       |
| "Guia Completo de Diarização de Áudio"            | speaker diarization tutorial      | Médio       |
| "Transcrição e LGPD: O Que Você Precisa Saber"    | transcrição LGPD compliance       | Médio       |
| "GPU vs CPU: Performance de Transcrição"          | transcrição GPU CUDA acceleration | Técnico     |
| "10 Dicas para Melhorar Qualidade de Transcrição" | melhorar transcrição audio        | Fácil       |
| "Como Criar Legendas SRT Automaticamente"         | legendas SRT YouTube              | Fácil       |

**Stack sugerido para o blog:**

- MDX para conteúdo
- Contentlayer ou next-mdx-remote
- Syntax highlighting (rehype-prism)
- Table of contents automático

---

## 🟢 Prioridade Baixa (Próximo Mês)

### 8. Presença em Diretórios e Comunidades

**Objetivo:** Construir backlinks e awareness.

#### 8.1 Diretórios de Software

| Plataforma    | URL                                   | Status |
| ------------- | ------------------------------------- | ------ |
| AlternativeTo | alternativeto.net/software/taskscribe | ⬜     |
| Product Hunt  | producthunt.com                       | ⬜     |
| Slant         | slant.co                              | ⬜     |
| G2            | g2.com                                | ⬜     |
| Capterra      | capterra.com                          | ⬜     |
| GetApp        | getapp.com                            | ⬜     |

#### 8.2 GitHub Awesome Lists

| Lista                    | Repositório                                      |
| ------------------------ | ------------------------------------------------ |
| Awesome Privacy          | github.com/pluja/awesome-privacy                 |
| Awesome Self-Hosted      | github.com/awesome-selfhosted/awesome-selfhosted |
| Awesome Machine Learning | github.com/josephmisiti/awesome-machine-learning |
| Awesome Whisper          | github.com/sindresorhus/awesome#whisper          |

**Como submeter:**

1. Fork o repositório
2. Adicione TaskScribe na categoria apropriada
3. Abra um Pull Request com descrição clara

#### 8.3 Comunidades Reddit

| Subreddit    | Regras              | Estratégia                   |
| ------------ | ------------------- | ---------------------------- |
| r/selfhosted | Sem spam            | Post de apresentação genuíno |
| r/privacy    | Foco em privacidade | Destacar processamento local |
| r/MacApps    | Apps para Mac       | Sem auto-promoção excessiva  |
| r/podcasting | Podcasters          | Focar em caso de uso         |
| r/LocalLLaMA | IA local            | Destacar integração Ollama   |

---

### 9. Monitoramento e Relatórios

**Objetivo:** Acompanhar métricas e ajustar estratégia.

**Dashboard recomendado:**

| Ferramenta            | Métrica                           | Frequência |
| --------------------- | --------------------------------- | ---------- |
| Google Search Console | Impressões, cliques, CTR, posição | Semanal    |
| Google Analytics      | Tráfego, conversões, bounce rate  | Semanal    |
| PostHog               | Funil de conversão, eventos       | Diário     |
| PageSpeed Insights    | Core Web Vitals                   | Mensal     |
| Ahrefs/Semrush        | Backlinks, keywords               | Mensal     |

**KPIs a acompanhar:**

```
📈 Crescimento Orgânico
- Impressões orgânicas (GSC)
- Cliques orgânicos (GSC)
- CTR médio (GSC)
- Posição média (GSC)

📊 Engajamento
- Tempo na página (GA)
- Páginas por sessão (GA)
- Bounce rate (GA)

🎯 Conversões
- Downloads do app
- Sign-ups (se aplicável)
- Contatos recebidos
```

---

### 10. Internacionalização Avançada

**Objetivo:** Expandir alcance para mercados internacionais.

#### 10.1 Subdomínios/Subdiretórios por Idioma

**Opção A - Subdiretórios (Recomendado):**

```
taskscribe.app/pt-BR   → Português Brasil
taskscribe.app/en      → English
taskscribe.app/es      → Español
```

**Opção B - Subdomínios:**

```
pt.taskscribe.app
en.taskscribe.app
es.taskscribe.app
```

#### 10.2 Implementação com next-intl

```bash
npm install next-intl
```

**Estrutura:**

```
app/
├── [locale]/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
├── i18n.ts
└── middleware.ts
```

#### 10.3 Hreflang Tags

Já implementado parcialmente. Para expansão:

```typescript
alternates: {
  canonical: BASE_URL,
  languages: {
    'pt-BR': `${BASE_URL}/pt-BR`,
    'en-US': `${BASE_URL}/en`,
    'es-ES': `${BASE_URL}/es`,
    'x-default': `${BASE_URL}/en`,
  },
},
```

---

## 📋 Checklist Completo

### Configuração Inicial

- [ ] Definir NEXT_PUBLIC_BASE_URL em produção
- [ ] Verificar domínio no Google Search Console
- [ ] Submeter sitemap.xml
- [ ] Configurar Google Analytics 4
- [ ] Testar Rich Results

### Otimização Técnica

- [ ] Auditar Core Web Vitals
- [ ] Implementar lazy loading de imagens
- [ ] Otimizar Web Fonts
- [ ] Verificar mobile-friendliness
- [ ] Testar em diferentes navegadores

### Conteúdo

- [ ] Criar página de comparação (vs Otter.ai)
- [ ] Criar páginas de casos de uso
- [ ] Iniciar blog com 3-5 artigos
- [ ] Adicionar testimonials (quando disponíveis)

### Link Building

- [ ] Submeter para AlternativeTo
- [ ] Preparar launch no Product Hunt
- [ ] Contribuir para Awesome Lists
- [ ] Participar de comunidades relevantes

### Monitoramento

- [ ] Configurar dashboard de métricas
- [ ] Definir KPIs e metas
- [ ] Agendar revisão mensal de performance

---

## 🎯 Metas para 90 Dias

| Métrica           | Atual | Meta 30 dias | Meta 60 dias | Meta 90 dias |
| ----------------- | ----- | ------------ | ------------ | ------------ |
| Páginas indexadas | ?     | 10+          | 20+          | 50+          |
| Impressões/mês    | ?     | 1.000        | 5.000        | 15.000       |
| Cliques/mês       | ?     | 100          | 500          | 1.500        |
| Backlinks         | ?     | 10           | 25           | 50           |
| Downloads         | ?     | -            | -            | -            |

---

## 📚 Recursos Úteis

### Ferramentas Gratuitas

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools)
- [Ubersuggest](https://neilpatel.com/ubersuggest/)

### Guias de Referência

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Core Web Vitals](https://web.dev/vitals/)

### Comunidades

- [r/SEO](https://reddit.com/r/SEO)
- [SEO Signals Lab (Facebook)](https://www.facebook.com/groups/seosignalslab)
- [Twitter #SEO](https://twitter.com/search?q=%23SEO)

---

## 📝 Notas de Implementação

### Próxima Sessão

- [ ] Implementar verificação Google Search Console
- [ ] Criar primeira página de comparação
- [ ] Auditar Core Web Vitals

### Dependências

- Domínio configurado e DNS propagado
- Acesso ao Google Search Console
- Conta Google Analytics criada

### Contatos

- **Desenvolvedor:** Wallyson Galvão
- **Repositório:** github.com/WallysonGalvao/taskScribe

---

_Este documento deve ser revisado e atualizado mensalmente._
