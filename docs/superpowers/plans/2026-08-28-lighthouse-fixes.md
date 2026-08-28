# Lighthouse Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir Performance (~78 → 90+) e Accessibility (~92 → 100) no `index.html`, eliminando render-blocking externo e corrigindo avisos de a11y identificados no relatório `127.0.0.1_5500-20260828T180333.json`.

**Architecture:** Quatro ondas incrementais — quick wins de a11y primeiro (sem dependências), depois self-host de fontes, depois substituição de Material Symbols por SVGs locais (padrão já usado em `assets/logos/` e `assets/icons/`), rebuild de CSS e re-audit Lighthouse. Cada onda entrega software testável no browser.

**Tech Stack:** HTML estático, CSS design system (`css/tokens.css` … `main.min.css`), `npm run build:css`, Live Server / `npx serve` para testes.

## Global Constraints

- Manter design dark luxury (obsidian `#0A0A0C`, copper `#D97706`, graphite `#121216`).
- Sem Tailwind, sem CSS inline — alterações só em `css/*.css` e HTML.
- Após editar CSS fonte, correr `npm run build:css`; páginas usam `css/main.min.css`.
- Ícones decorativos: `alt=""` + `aria-hidden="true"`; ícones com significado: `aria-label` no link/button pai.
- Nav canónico e copy PT-PT inalterados.
- Não commitar unless pedido pelo utilizador.

## Baseline (Lighthouse — index, anónimo, Live Server)

| Categoria        | Score |
|------------------|-------|
| Performance      | 78    |
| Accessibility    | 92    |
| Best Practices   | 100   |
| SEO              | 100   |

**Gargalos:** Google Fonts (~894 ms blocking), Material Symbols (~248 ms), FCP 2.1 s.

**A11y:** contraste `.terminal__title` / `.terminal__comment`; `h4` no footer salta níveis após `h2` da secção CTA (sem `h3` intermédio).

---

## Mapa de ficheiros

| Ficheiro | Responsabilidade |
|----------|------------------|
| `css/components.css` | Estilos terminal, footer, ícones UI |
| `css/typography.css` | `@font-face` self-hosted |
| `assets/fonts/` | WOFF2 Montserrat, Inter, Geist |
| `assets/icons/ui/*.svg` | Substitutos Material Symbols (~20 ícones) |
| `index.html` + 4 HTMLs + `partials/*` | Head links, markup ícones, footer headings |
| `scripts/build-css.js` | Regenerar `main.min.css` |

**Ícones Material a migrar (lista única):**  
`menu`, `close`, `arrow_forward`, `north_east`, `mail`, `call`, `location_on`, `local_fire_department`, `speed`, `diamond`, `code`, `bolt`, `check_circle`, `check_box`, `terminal`, `hourglass_empty`, `design_services`, `trending_down`, `trending_up`, `star`, `expand_more`

---

## Onda 1 — Accessibility quick wins (~20 min)

**Meta:** Accessibility 92 → 98–100

### Task 1: Corrigir ordem de headings no footer

**Files:**
- Modify: `index.html`, `services.html`, `portfolio.html`, `aboutUs.html`, `contacts.html`, `partials/footer.html`
- Modify: `css/components.css` (só se necessário — classe mantém-se)

**Interfaces:**
- Produces: `<p class="site-footer__column-title">` em vez de `<h4 class="site-footer__column-title">`

- [ ] **Step 1:** Substituir `<h4 class="site-footer__column-title">` por `<p class="site-footer__column-title">` (fechar com `</p>`) nos 6 ficheiros — 3 ocorrências cada.

- [ ] **Step 2:** Verificar visualmente — estilo inalterado (`.site-footer__column-title` já estiliza o elemento).

- [ ] **Step 3:** Lighthouse → Accessibility → confirmar "Heading order" verde.

### Task 2: Corrigir contraste do terminal

**Files:**
- Modify: `css/components.css:673-700`

- [ ] **Step 1:** Ajustar `.terminal__title`:

```css
.terminal__title {
  flex: 1;
  text-align: center;
  color: var(--color-text-muted);
  opacity: 0.72;
  font-size: 0.625rem;
  letter-spacing: var(--ls-widest);
  text-transform: uppercase;
}
```

- [ ] **Step 2:** Ajustar `.terminal__comment`:

```css
.terminal__comment { color: var(--color-text-muted); opacity: 0.72; }
```

- [ ] **Step 3:** Correr `npm run build:css`

- [ ] **Step 4:** Lighthouse → confirmar "Background and foreground colors" verde no terminal.

---

## Onda 2 — Self-host fontes (~45 min)

**Meta:** Performance 78 → ~85; eliminar ~894 ms render-blocking Google Fonts

### Task 3: Descarregar e registar fontes locais

**Files:**
- Create: `assets/fonts/montserrat-600.woff2`, `montserrat-700.woff2`, `inter-400.woff2`, `inter-500.woff2`, `geist-500.woff2`
- Create: `css/fonts.css`
- Modify: `css/main.css` (importar `fonts.css` antes de typography)
- Modify: `css/tokens.css` (fallback stack inalterado)

**Interfaces:**
- Produces: `@font-face` rules consumidas por `--font-display`, `--font-body`, `--font-label`

- [ ] **Step 1:** Criar `assets/fonts/` e descarregar WOFF2 via google-webfonts-helper ou fontsource:
  - Montserrat 600, 700
  - Inter 400, 500
  - Geist 500 (Google Fonts — verificar licença; fallback: manter só Montserrat+Inter se Geist indisponível)

- [ ] **Step 2:** Criar `css/fonts.css`:

```css
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('../assets/fonts/montserrat-600.woff2') format('woff2');
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('../assets/fonts/montserrat-700.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/inter-400.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('../assets/fonts/inter-500.woff2') format('woff2');
}

@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('../assets/fonts/geist-500.woff2') format('woff2');
}
```

- [ ] **Step 3:** Adicionar `@import url('fonts.css');` como primeira linha de `css/main.css`.

- [ ] **Step 4:** Actualizar `scripts/build-css.js` — incluir `fonts.css` no array `files` **antes** de `typography.css`.

### Task 4: Remover Google Fonts dos HTMLs

**Files:**
- Modify: `index.html`, `services.html`, `portfolio.html`, `aboutUs.html`, `contacts.html` (head)

- [ ] **Step 1:** Remover estas 3 linhas de cada HTML:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@500&family=Montserrat:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2:** Adicionar preload da fonte crítica (Montserrat 700 — usada no logo/headings):

```html
  <link rel="preload" href="assets/fonts/montserrat-700.woff2" as="font" type="font/woff2" crossorigin>
```

- [ ] **Step 3:** `portfolio.html` — remover também link Space Mono se existir; adicionar `@font-face` Space Mono em `fonts.css` **ou** substituir `--font-mono` por stack system (`ui-monospace, monospace`) — YAGNI: usar system mono unless portfolio needs Space Mono visually.

- [ ] **Step 4:** `npm run build:css` + reload — confirmar tipografia visual idêntica.

- [ ] **Step 5:** Lighthouse → Performance; FCP deve baixar ~0.5–1 s.

---

## Onda 3 — Substituir Material Symbols (~2 h)

**Meta:** Performance ~85 → 90+; eliminar ~248 ms blocking + request extra

### Task 5: Criar SVGs UI e classe CSS

**Files:**
- Create: `assets/icons/ui/*.svg` (20 ficheiros)
- Modify: `css/components.css` — secção `.ui-icon`

**Interfaces:**
- Produces: classe `.ui-icon`, modificadores `.ui-icon--sm`, `.ui-icon--arrow`, `.ui-icon--filled`

- [ ] **Step 1:** Criar SVGs 24×24, fill `#FFB77D` (primary) ou `#DBC2B0` (muted) — seguir estilo de `assets/icons/bolt.svg`.

- [ ] **Step 2:** Adicionar em `css/components.css`:

```css
.ui-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.ui-icon--sm { width: 1rem; height: 1rem; }
.ui-icon--arrow { width: 1.125rem; height: 1.125rem; }
```

- [ ] **Step 3:** Mapear classes existentes:
  - `.icon-arrow` → `<img class="ui-icon ui-icon--arrow" …>`
  - `.icon-sm` → `.ui-icon--sm`
  - `.service-card__icon` → `.ui-icon` com width 2rem se necessário
  - `.nav__toggle-icon` → SVG menu/close 1.5rem

### Task 6: Migrar ícones — nav + partials (prioridade)

**Files:**
- Modify: `partials/header.html`, 5× HTML headers idênticos

- [ ] **Step 1:** Substituir toggles menu/close:

```html
<!-- antes -->
<span class="material-symbols-outlined nav__toggle-icon nav__toggle-icon--open">menu</span>
<!-- depois -->
<img class="ui-icon nav__toggle-icon nav__toggle-icon--open" src="assets/icons/ui/menu.svg" alt="" aria-hidden="true" width="24" height="24">
```

- [ ] **Step 2:** Testar menu mobile (abrir/fechar/escape).

### Task 7: Migrar ícones — index.html

**Files:**
- Modify: `index.html` (~25 ocorrências)

- [ ] **Step 1:** Substituir todas as `<span class="material-symbols-outlined …">` por `<img class="ui-icon …" src="assets/icons/ui/{name}.svg" alt="" aria-hidden="true" width="24" height="24">`.

- [ ] **Step 2:** Accordion `expand_more` — manter rotação CSS existente em `.accordion__icon` (aplicar ao `img`).

### Task 8: Migrar ícones — restantes páginas

**Files:**
- Modify: `services.html`, `portfolio.html`, `aboutUs.html`, `contacts.html`

- [ ] **Step 1:** Mesmo padrão Task 7, página a página.

- [ ] **Step 2:** Remover de **todos** os HTMLs:

```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
```

- [ ] **Step 3:** Remover regras `.material-symbols-outlined` de `css/components.css` se existirem.

- [ ] **Step 4:** `npm run build:css`

---

## Onda 4 — Validação e polish opcional (~30 min)

### Task 9: Re-audit Lighthouse

- [ ] **Step 1:** Live Server anónimo → `index.html` → Lighthouse (Mobile, Slow 4G).

- [ ] **Step 2:** Registar scores alvo:

| Categoria     | Alvo  |
|---------------|-------|
| Performance   | ≥ 90  |
| Accessibility | 100   |
| Best Practices| 100   |
| SEO           | 100   |

- [ ] **Step 3:** Exportar JSON para `lighthouse-index-v2.json` e comparar FCP/LCP.

### Task 10 (opcional): Reduzir CSS não usado

**Files:**
- Modify: `scripts/build-css.js` ou adicionar purge step

- [ ] **Step 1:** Auditar classes usadas vs definidas — remover secções mortas em `components.css` (ex. estilos Material Symbols, utilities legacy).

- [ ] **Step 2:** Meta: poupar ~23 KiB reportados em "Reduce unused CSS".

---

## Ordem de execução recomendada

```
Onda 1 (a11y)  →  Onda 2 (fontes)  →  Onda 3 (ícones)  →  Onda 4 (audit)
     ↓                  ↓                   ↓
  20 min             45 min              2 h
  A11y ~100          Perf ~85            Perf ~90+
```

## Critérios de done

- [ ] Lighthouse Accessibility = 100 no `index.html`
- [ ] Zero requests a `fonts.googleapis.com` / `fonts.gstatic.com`
- [ ] Zero `<link>` Material Symbols
- [ ] FCP < 1.5 s (mobile simulado)
- [ ] Menu mobile, modal portfólio, accordion FAQ funcionam
- [ ] `npm run build:css` passa sem erro

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Geist indisponível para self-host | Usar fallback `system-ui` para `--font-label` |
| Ícones filled (`icon--filled`) diferem do outline | Criar variantes `-filled.svg` |
| Space Mono só no portfolio | System mono ou descarregar 1 peso |
| Regressão visual | Comparar screenshots antes/depois |

---

## Self-review (spec coverage)

| Requisito Lighthouse | Task |
|----------------------|------|
| Render-blocking Google Fonts | Task 3–4 |
| Render-blocking Material Symbols | Task 5–8 |
| Contraste terminal | Task 2 |
| Heading order footer | Task 1 |
| Unused CSS | Task 10 (opcional) |
| Re-validação | Task 9 |
