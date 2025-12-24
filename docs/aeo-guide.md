# 🤖 TaskScribe - Guia de AEO (Answer Engine Optimization)

> Como fazer o TaskScribe aparecer nas respostas do ChatGPT, Perplexity, Google AI Overviews e outros motores de busca baseados em IA.

**Última atualização:** 23 de Dezembro de 2024  
**Status:** Implementado

---

## 📊 O que é AEO?

**Answer Engine Optimization (AEO)** é a prática de otimizar conteúdo para ser citado e referenciado por motores de resposta baseados em IA, como:

- ChatGPT (OpenAI)
- Perplexity AI
- Google AI Overviews (SGE)
- Bing Copilot
- Claude (Anthropic)
- Bard/Gemini (Google)

### AEO vs SEO Tradicional

| Aspecto                      | SEO Tradicional       | AEO                           |
| ---------------------------- | --------------------- | ----------------------------- |
| **Objetivo**                 | Rankear em SERPs      | Ser citado em respostas de IA |
| **Métrica de Sucesso**       | Cliques, CTR, Posição | Menções, Citações             |
| **Formato**                  | Links em lista        | Resposta direta sintetizada   |
| **Comportamento do Usuário** | Clica no link         | Lê resposta sem clicar        |

---

## ✅ O que foi Implementado

### 1. Arquivos llms.txt (Novo Padrão)

**O que é:** Similar ao robots.txt, mas específico para LLMs (Large Language Models).

**Arquivos criados:**

| Arquivo         | Caminho                 | Propósito                     |
| --------------- | ----------------------- | ----------------------------- |
| `llms.txt`      | `/public/llms.txt`      | Resumo estruturado do produto |
| `llms-full.txt` | `/public/llms-full.txt` | Documentação completa para IA |

**Conteúdo inclui:**

- Descrição do produto
- Features e capacidades
- Pricing detalhado
- Requisitos de sistema
- FAQs
- Comparações com concorrentes
- Diretivas de uso para IA

### 2. Robots.txt Otimizado para AI Bots

Adicionamos regras específicas para crawlers de IA:

```txt
User-agent: GPTBot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### 3. Links no Head para Descoberta

```html
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
<link
  rel="alternate"
  type="text/plain"
  href="/llms-full.txt"
  title="LLMs Full Documentation"
/>
```

### 4. Schema.org JSON-LD Completo

Schemas implementados que IAs usam como fonte de dados estruturados:

- **FAQPage**: Perguntas frequentes estruturadas
- **SoftwareApplication**: Informações do app
- **Organization**: Dados da empresa
- **WebSite**: Informações do site

### 5. Sitemap Atualizado

Incluindo os novos arquivos llms.txt no sitemap:

```xml
<url>
  <loc>https://taskscribe.com.br/llms.txt</loc>
  <priority>0.5</priority>
</url>
<url>
  <loc>https://taskscribe.com.br/llms-full.txt</loc>
  <priority>0.5</priority>
</url>
```

---

## 🔧 Estrutura dos Arquivos llms.txt

### llms.txt (Resumido)

```markdown
# TaskScribe LLMs.txt

> Descrição curta do produto

## About TaskScribe

[Descrição detalhada]

## Pricing

[Planos e preços]

## Key Features

[Lista de features]

## FAQ

[Perguntas frequentes]

## AI Content Usage Directives

[Permissões e atribuição]
```

### llms-full.txt (Completo)

Contém:

- Documentação técnica detalhada
- Tabelas comparativas
- Modelos disponíveis
- Requisitos de sistema
- Casos de uso
- Guias de instalação
- Comparação com concorrentes (Otter.ai, Descript, Rev)

---

## 📋 Checklist de AEO

### Implementado ✅

- [x] Criar `/llms.txt` com informações estruturadas
- [x] Criar `/llms-full.txt` com documentação completa
- [x] Atualizar `robots.txt` com regras para AI bots
- [x] Adicionar links no `<head>` para descoberta
- [x] Schema.org JSON-LD (FAQPage, SoftwareApplication)
- [x] Atualizar sitemap com arquivos llms.txt
- [x] Estrutura Q&A no FAQ (formato que IAs adoram)
- [x] Conteúdo claro e direto (lead with the answer)
- [x] Tabelas comparativas (fácil para IA processar)

### Próximos Passos 📋

- [ ] Monitorar menções do TaskScribe em ChatGPT/Perplexity
- [ ] Criar páginas de comparação dedicadas
- [ ] Adicionar mais FAQs conversacionais
- [ ] Publicar artigos no blog com formato Q&A
- [ ] Submeter para diretórios que IAs referenciam
- [ ] Obter backlinks de sites autoritativos

---

## 🎯 Melhores Práticas de AEO

### 1. Estruturar Conteúdo para Compreensão de IA

**✅ Fazer:**

```markdown
## O que é TaskScribe?

TaskScribe é um software de transcrição que processa
áudio 100% localmente. Diferente de serviços em nuvem,
seus dados nunca saem do seu computador.
```

**❌ Evitar:**

```markdown
Nossa solução inovadora de ponta utiliza tecnologia
proprietária para revolucionar a experiência do usuário...
```

### 2. Usar Formato Q&A

IAs adoram conteúdo em formato de pergunta e resposta:

```markdown
### Preciso de internet para usar o TaskScribe?

Não. O TaskScribe funciona 100% offline. A transcrição
é feita localmente no seu computador.
```

### 3. Incluir Dados Estruturados

Tabelas, listas e dados organizados são mais fáceis para IAs processarem:

```markdown
| Modelo | Tamanho | Velocidade  | Precisão  |
| ------ | ------- | ----------- | --------- |
| tiny   | 39MB    | Mais rápido | Boa       |
| small  | 244MB   | Rápido      | Muito boa |
| large  | 1.5GB   | Lento       | Excelente |
```

### 4. Ser Específico com Números

```markdown
✅ "Processa áudio em até 4x mais rápido com GPU NVIDIA"
❌ "Processamento muito mais rápido"

✅ "Suporta 99+ idiomas incluindo Português e Inglês"
❌ "Suporta múltiplos idiomas"

✅ "Plano Pro custa $19/mês ou R$47/mês"
❌ "Preços acessíveis"
```

### 5. Manter Conteúdo Atualizado

IAs preferem informações recentes. Inclua:

- Data de última atualização
- Versão do software
- Changelog

---

## 🔍 Como Verificar se Está Funcionando

### 1. Testar no ChatGPT

Pergunte ao ChatGPT:

- "O que é TaskScribe?"
- "Qual a melhor ferramenta de transcrição offline?"
- "Alternativas ao Otter.ai com privacidade?"

### 2. Testar no Perplexity

Mesmas perguntas, verificando se TaskScribe é mencionado.

### 3. Verificar Crawlers nos Logs

No Vercel Analytics ou logs do servidor, procure por:

- GPTBot
- ChatGPT-User
- ClaudeBot
- PerplexityBot

### 4. Usar Ferramentas de Monitoramento

- [brandwatch.com](https://brandwatch.com) - Monitorar menções
- [mention.com](https://mention.com) - Alertas de menção
- Custom scripts para checar respostas de API

---

## 📊 Métricas de AEO

| Métrica                | Como Medir                    | Meta                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| Menções em ChatGPT     | Testes manuais regulares      | Aparecer em respostas relevantes |
| Citações em Perplexity | Verificar links nas respostas | Ser citado com link              |
| Tráfego de AI referral | Analytics (referrer analysis) | Aumentar mês a mês               |
| Crawls de AI bots      | Server logs                   | Crawls regulares                 |

---

## 🔗 Recursos

### Especificação llms.txt

- [llmstxt.org](https://llmstxt.org) - Especificação oficial
- [llms-txt.io](https://llms-txt.io) - Diretório de implementações

### Ferramentas

- [llmstxtgenerator.org](https://llmstxtgenerator.org) - Gerador de llms.txt
- [Ahrefs](https://ahrefs.com) - Monitorar backlinks e menções

### Artigos de Referência

- [SEO Discovery - AEO Guide](https://seodiscovery.com)
- [HubSpot - Answer Engine Optimization](https://hubspot.com)
- [Search Engine Land - llms.txt](https://searchengineland.com)

---

## 📝 Notas Técnicas

### User Agents de AI Bots

| Bot               | User Agent          | Empresa         |
| ----------------- | ------------------- | --------------- |
| GPTBot            | `GPTBot`            | OpenAI          |
| ChatGPT-User      | `ChatGPT-User`      | OpenAI (Browse) |
| ClaudeBot         | `ClaudeBot`         | Anthropic       |
| Claude-Web        | `anthropic-ai`      | Anthropic       |
| PerplexityBot     | `PerplexityBot`     | Perplexity      |
| Google-Extended   | `Google-Extended`   | Google AI       |
| Bingbot           | `Bingbot`           | Microsoft       |
| Applebot-Extended | `Applebot-Extended` | Apple           |

### Formato do llms.txt

O arquivo deve:

- Ser texto plano ou Markdown
- Estar em `/llms.txt` na raiz
- Ter linguagem clara e direta
- Incluir metadados de versão/data
- Especificar permissões de uso

---

_Documento criado como parte da estratégia de AEO do TaskScribe._
_Última atualização: Dezembro 2024_
