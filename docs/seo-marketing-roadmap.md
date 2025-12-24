# 🚀 TaskScribe - Roadmap de SEO & Marketing

> Documento detalhado com próximos passos para otimização de SEO, presença online e crescimento orgânico.

**Última atualização:** 23 de Dezembro de 2024  
**Status:** Em andamento

---

## 📊 Sumário Executivo

Este documento detalha as estratégias e ações necessárias para maximizar a visibilidade do TaskScribe nos mecanismos de busca e estabelecer uma presença online sólida. As ações estão organizadas por prioridade e estimativa de impacto.

---

## ✅ Já Implementado

| Item                | Arquivo                             | Status |
| ------------------- | ----------------------------------- | ------ |
| Sitemap dinâmico    | `lp/app/sitemap.ts`                 | ✅     |
| Robots.txt          | `lp/app/robots.ts`                  | ✅     |
| Open Graph images   | `lp/app/opengraph-image.tsx`        | ✅     |
| Twitter Cards       | `lp/app/twitter-image.tsx`          | ✅     |
| Schema.org JSON-LD  | `lp/app/components/seo/json-ld.tsx` | ✅     |
| Meta tags completas | `lp/app/layout.tsx`                 | ✅     |
| Hreflang (PT/EN)    | `lp/app/layout.tsx`                 | ✅     |
| Favicon SVG         | `lp/app/icon.svg`                   | ✅     |

---

## 🔴 Prioridade Alta (Esta Semana)

### 1. Configurar Variáveis de Ambiente de Produção

**Objetivo:** Garantir que URLs e configurações estejam corretas em produção.

**Arquivo:** `lp/.env.production` ou variáveis no Vercel

```env
# URL base do site (OBRIGATÓRIO)
NEXT_PUBLIC_BASE_URL=https://taskscribe.com.br

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxx

# Opcional: Chaves de verificação
GOOGLE_SITE_VERIFICATION=seu-codigo-aqui
```

**No Vercel Dashboard:**

1. Acesse Settings → Environment Variables
2. Adicione cada variável para Production environment
3. Redeploy o site

---

### 2. Verificar Domínio no Google Search Console

**Objetivo:** Indexar o site no Google e monitorar performance de busca.

**Passos:**

1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Clique em "Add Property"
3. Escolha "URL prefix" e adicione `https://taskscribe.com.br`
4. Use o método "HTML tag" para verificação
5. Copie o código de verificação

**Atualizar `lp/app/layout.tsx`:**

```typescript
export const metadata: Metadata = {
  // ... outras configurações
  verification: {
    google: "seu-codigo-de-verificacao-aqui",
  },
};
```

6. Faça deploy e clique em "Verify" no Search Console
7. **Submeta o Sitemap:**
   - Vá em Sitemaps → Add a new sitemap
   - Digite: `sitemap.xml`
   - Clique em Submit

**Métricas para acompanhar:**

- Páginas indexadas
- Erros de cobertura
- Core Web Vitals
- Palavras-chave de ranking

---

### 3. Configurar Google Analytics 4 (GA4)

**Objetivo:** Rastrear comportamento de usuários e conversões.

**Passos:**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma nova propriedade GA4
3. Obtenha o Measurement ID (formato: `G-XXXXXXXXXX`)

**Opção A - Via next/script (Recomendado):**

Crie `lp/app/components/analytics/google-analytics.tsx`:

```typescript
"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

**Adicione ao layout.tsx:**

```typescript
import { GoogleAnalytics } from "./components/analytics/google-analytics";

// No body:
<GoogleAnalytics />;
```

**Variável de ambiente:**

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

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

### 5. Otimizar Core Web Vitals

**Objetivo:** Melhorar performance e ranking no Google.

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
