# Style Audit — Colors, Fonts, Type Scale

> **STATUS: fixes applied (2026-07-05).** Colors + font-size consolidation done — see
> "Applied" at the bottom. Fonts already passed. Two minor 13px labels were left as-is
> (noted below).


Scope: the **live design only** (theme is locked to `pastel` in `ThemeContext.jsx`).
The `signal` / `kinetic` / `blueprint` / `himachal` / `pixel` / `voxel` themes and the
unused Service* components (`ServiceAccordion/Tabs/Sticky/Split/Bento/Spotlight`) are dead
CSS and are excluded. Rendered surface = `Nav`, `Hero`, `CursorShowreel`,
`ServiceHAccordion`, `CaseBooks`, `Sections` (Growth / Clients / Expertise / Awards / FinalCta).

---

## 1. Fonts — ✅ CONSISTENT

Every `font-family` in the rendered surface resolves to one of the four tokens. No raw
families leak in. Roles are used correctly:

| Token | Stack | Used for |
|-------|-------|----------|
| `--font-display` | Lyon Display → Fraunces → Georgia (serif) | headings, card titles |
| `--font-body` | Suisse Int'l → Inter (sans) | body copy, blurbs, CTAs |
| `--font-mono` | Suisse Int'l → Inter | eyebrows, index labels, chips |
| `--font-num` | Suisse Int'l → Inter | large stat numbers |

**No action needed.** (Note: Lyon Display and Suisse Int'l are licensed and are not
loaded via `@font-face` — the page currently renders the free fallbacks Fraunces + Inter.
That's intentional per the comment in `index.css`, but worth confirming for production.)

---

## 2. Colors — ⚠️ TWO ISSUES

### Palette tokens (pastel), all defined in `index.css`
- Neutrals: `--bg #f8f8f9`, `--surface #f4f0e6` (beige), `--card #fff`, `--text #17161a`, `--dim #4a4852`, `--muted #807d89`, `--line`, `--line-strong`
- Purple (action): `--accent #6c4ce0`, `--accent-bright`, `--accent-soft`
- Support: `--lavender`, `--lavender-soft`, `--yellow #ffd84d`, `--ink`

### Issue A — Rust is hardcoded, not a token, and in two shades
The rust brand-pop color is pasted as a literal **6+ times in live rules**, in **two
different shades**:

| Shade | Live locations |
|-------|----------------|
| `#c24a1e` | `.btn-primary` bg (L754), pastel `.kicker` (L827), `.svid .avlede` (L2017), `.hpanel__capicon` (L2129), `.hpanel__idx` (L2137) |
| `#d6602e` | `.growth__eyebrow` (L2278) — a *different, brighter* rust |

→ **Fix:** add `--rust: #c24a1e` (+ optional `--rust-bright`) to the pastel token block and
replace the literals. One source of truth; the two-shade drift goes away.

### Issue B — Yellow still renders (you asked for *never yellow*)
- `[data-theme='pastel'] .avexp__col h3` → `border-bottom: 2px solid var(--yellow)` (L1069).
  This is the **Expertise** section's group-heading underline — it renders live as a yellow bar.

→ **Fix:** switch that underline to `--rust` or `--accent` (purple). *(The other `--yellow` /
`--gold` hits at L1248–1264 and L1838 are in dead `.avcase` / `.avservices` rules — no visual
impact, safe to ignore or delete.)*

---

## 3. Font sizes — ⚠️ SCALE IS BYPASSED

A fixed 8-pt scale is declared in `:root` (`--fs-display 48`, `--fs-lg 24`, `--fs-title 20`,
`--fs-body 16`, `--fs-label 12`) with a comment saying "no fluid clamps or odd values."
Reality across the (base+pastel) CSS:

- **31** declarations use the `--fs-*` tokens
- **71** are hardcoded px
- **22** are bespoke `clamp()`s — almost all unique

### Concrete inconsistencies in the rendered surface

| Role | Selector | Current size | Problem |
|------|----------|--------------|---------|
| Hero H1 | `.hero--pastel .hero__title` | `var(--fs-display)` = 48 | ✅ on token |
| Section H2 | `.avh2` | `36px` hardcoded | not a token |
| Section H2 | `.svid__h` | `36px` hardcoded | duplicated literal |
| Section H2 | `.growth__title` | `clamp(26px, 3vw, 36px)` | different method, same role |
| Large statement | `.avfinal__text` | `var(--fs-lg)` = 24 | a "section" line but much smaller |
| Card title | `.cbook__title` | `clamp(21px, 1.9vw, 29px)` | one card scale |
| Card title | `.hpanel__title` | `clamp(20px, 1.8vw, 26px)` | *different* card scale, same role |
| Sub / blurb | `.hpanel__sub` | `14px` | — |
| Sub / blurb | `.cbook__body` | `12px` | body copy smaller than a label |
| Labels | mixed | `11 / 12 / 13 / 13.5 / 14 / 15px` | should collapse to 12 + 14 |

**Takeaway:** three different "section heading" sizes (24 / 36 / clamp-36), two different
"card title" scales, and a 11–15px spread for small text. Same visual role → different size.

### Proposed consolidated scale (add as tokens, then map)
```
--fs-display : 48px   hero H1                         (already used)
--fs-h2      : 36px   every section heading           (new — replaces the 36px literals & growth clamp)
--fs-lg      : 24px   large statement lines
--fs-title   : 22px   all card titles                 (cbook + hpanel unify here)
--fs-body    : 16px   body copy
--fs-sub     : 14px   blurbs / subheads
--fs-label   : 12px   eyebrows, index, stat labels
```

---

## Recommended fixes (in priority order)
1. **Yellow → rust/purple** on the Expertise underline (L1069). *(1 line, honors the palette rule.)*
2. **Tokenize rust:** add `--rust`, replace the 6 literals, unify `#d6602e` → rust. *(~6 edits.)*
3. **Unify section headings** to `--fs-h2` (36): `.avh2`, `.svid__h`, `.growth__title`. *(3 edits.)*
4. **Unify card titles** to `--fs-title` (22): `.cbook__title`, `.hpanel__title`. *(2 edits.)*
5. **Collapse small-text spread** to `--fs-body/--fs-sub/--fs-label` (16/14/12). *(~10 edits.)*

Nothing here changes layout or the look meaningfully — it makes the same design internally
consistent and token-driven. Fonts already pass.

---

## Applied (2026-07-05)

**New tokens** (`index.css`): `--rust #c24a1e`, `--rust-bright #d6602e`, `--fs-h2 36px`,
`--fs-sub 14px`; `--fs-title` retuned 20 → 22; mobile `--fs-h2 28px`.

**Colors**
- Rust tokenized — all `#c24a1e` → `var(--rust)` (13 refs), `#d6602e` → `var(--rust-bright)`. Zero raw rust literals remain.
- Expertise heading underline `var(--yellow)` → `var(--rust)` (the last live yellow).

**Font sizes**
- Section headings → `--fs-h2`: `.avh2`, `.svid .svid__h`, `.growth__title` (was a clamp).
- Card titles → `--fs-title` (22): `.cbook__title` (was clamp→29), `.hpanel__title` (was clamp→26).
- Small text tokenized (identical values, no visual change): live `12px → --fs-label`,
  `14px → --fs-sub`, `16px → --fs-body` across nav/hero/growth/cbook/hpanel/awards.

**Verified**: tokens resolve (`--rust #c24a1e`, `--fs-h2 36px`, `--fs-title 22px`), `.avh2`
computes 36px, `.cbook__title` 22px, Expertise underline `rgb(194,74,30)` rust, no console errors.

**Deferred (minor):** two live `13px` labels — `.numrow__*` (hero proof row) and `.svid__tab`
— left untouched to avoid reflow in tightly-tuned areas. Round to `--fs-sub`/`--fs-label` later
if desired. Dead `--yellow`/`--gold` refs in unused `.avcase`/`.avservices` rules are harmless.
