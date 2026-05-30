## 1. Visual Theme & Atmosphere

A quiet, data-dense workspace — a thoughtful IDE for product strategy, not a marketing dashboard. Minimal chrome, high information density, nothing competing for attention. Default mode is dark; a fully tokenised light mode exists and shares the same alpha system. The brand is greyscale discipline: there is no branded primary colour. Colour is reserved for semantic meaning (entity tier, status). Single depth plane — surfaces are transparent overlays on one base background. No gradients, illustrations, patterns, or hero imagery. Icons carry affordance, copy carries meaning, and there is no emoji anywhere.

---

## 2. Color Palette & Roles

All colours are OKLCH. Surfaces and borders are opacity overlays, so light/dark share one alpha system.

**Base:** `--background` (light `oklch(0.985 0 0)` / dark `oklch(0.145 0 0)`), `--foreground` (inverts), `--card`, `--popover`, `--muted`, `--muted-foreground`, `--destructive`.

**Surfaces (overlay on background):** `--surface-1` (2% / 3%) inline cards, `--surface-2` (4% / 6%) section cards, `--surface-3` (7% / 10%) header banners, plus `--surface-hover` and `--surface-active`.

**Borders:** `--border-subtle` (6%), `--border-default` (12% / 10%), `--border-strong` (18%), `--border-focus` (30%, the only focus treatment — never a coloured ring).

**Entity-tier accents — the only colour system.** Each tier owns one accent used ONLY as a 2px left-accent border, a 15%-alpha icon-badge background, and a 5–6%-alpha card tint — never a solid fill: `--tier-bo` (blue), `--tier-po` (violet), `--tier-opp` (amber), `--tier-sol` (emerald), `--tier-asm` (orange), `--tier-test` (cyan).

**Status pills:** draft (zinc), explore (blue), commit (emerald), done (violet), archived (zinc), dropped (rose). **Functional accents:** `--accent-purple`, `--accent-green`, `--accent-red`.

---

## 3. Typography Rules

- **DM Sans** — UI, body, all headings (weights 300–700; `font-feature-settings: "ss01","cv11"`).
- **Source Serif 4** — italic 400, editorial customer quotes ONLY (`.pa-quote`), never elsewhere.
- **Geist Mono** — code, tabular numerics, metric values (`font-variant-numeric: tabular-nums`).
- Hierarchy: `.pa-h1` 28/600/-0.02em; `.pa-h2` 22–26/600 (strategic); `.pa-h3` 18–20/600 (tactical); `.pa-h4` 16–18/600 (leaf); body 14px / 1.625; caption 12px; micro 11px; eyebrow 10px/600/0.09em UPPERCASE.
- Title sizing is tier-based (strategic > tactical > leaf). No display fonts, no weights outside 300–700, no positive letter-spacing.

---

## 4. Component Stylings

shadcn/ui primitives over Radix, composed with `class-variance-authority` and a `cn()` helper.

- **Buttons** (`.pa-btn`, 14px / 500, 8px radius): `pa-btn-primary` (bg `--foreground`, text `--background`, hover opacity 0.9), `pa-btn-secondary` (bg `--surface-2` + `--border-default`, hover `--surface-hover`), `pa-btn-ghost` (transparent, `--muted-foreground`). Loading swaps text for a `Loader2` spinner.
- **Cards:** section card (`--surface-2`, `--border-subtle`, 12px radius); entity card (5% tier tint on `--surface-1` + 2px tier left-accent); hero banner (`--surface-3`, 16px radius); glass card (`--surface-2` + 12px backdrop-blur, floating only).
- **Inputs:** `--surface-2` + `--border-default`, 8px radius, `8px 12px` padding; focus → `--border-focus`, no ring. Labels above at 12px `--muted-foreground`; no floating labels.
- **Status pills, icon badges, breadcrumbs, quotes** per the tier/status system above. Icons: Lucide, stroke-width 2.

---

## 5. Layout Principles

- **Spacing scale:** 8 / 12 / 16 / 24 / 32 / 40 / 48 px. Tokens: `--spacing-page-*`, `--spacing-content-*`, `--spacing-entity-*`, `--spacing-block-*`.
- **Radius:** `--radius` 10px base; cards `rounded-xl` (12px), controls `rounded-md` (8px).
- **Grid:** collapsible left sidebar (240px / 56px) + main scroll area, max content width 880px (1080px ≥1280px). Metric tree is a horizontal canvas of 260px fixed-width cards.
- Whitespace is tight and intentional: cards 8px apart, content blocks 12px, sections 16–24px. `gap` on flex/grid parents, not sibling margins.

---

## 6. Depth & Elevation

Shadows are effectively off. The single depth plane is articulated by surface alpha and border strength, not shadow. Hover brightens via `--surface-hover` + `filter: brightness(1.1)` light / `1.25` dark. Optional `0 0 24px var(--shadow-color)` (8% alpha) on glass cards only. Popovers use shadcn `shadow-lg`; modal overlays use `--overlay` + 4px backdrop-blur. Surface stacking goes at most 3 levels deep — beyond that, use a popover or modal.

---

## 7. Do's and Don'ts

- DO use OKLCH tokens for every colour; DON'T hand-roll hex or introduce a branded primary.
- DO reserve colour for tier/status meaning; DON'T use solid fills of tier colours (2px left border + 15% badge + 5% tint only).
- DO use Lucide icons (stroke-2) and typographic arrows (`->` `<-` `^` `v`) and em-dashes; DON'T use emoji, gradients, illustrations, or custom SVG icons.
- DO default to dark mode; DON'T use coloured focus rings (focus is `--border-focus` 30% neutral) or scale/bounce/spring animations.
- DO address the user as "you" and the agent as "they"/"your co-worker"; DON'T write first-person product copy or put exclamation marks in error/empty states.

TODO: human input on team conventions (copy/voice nuance and brand do's & don'ts beyond what tokens reveal).

---

## 8. Responsive Behavior

Mobile-first, Tailwind breakpoints (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536).
- `<768px` (mobile): sidebar collapses to a 56px icon rail; entity cards full-width; metric tree stacks; page gutter 16px.
- `768–1024px` (tablet): sidebar expanded, single-column main; metric tree horizontal-scrolls.
- `≥1024px` (desktop): canonical layout — 240px sidebar + 880px main content.
- `≥1280px`: main content may expand to 1080px.
Touch targets ≥44×44px (button min-height 40px on touch). Collapsing order: eyebrow labels first, section titles stay; icon badges never shrink; status pills truncate to dot-only below 320px.
