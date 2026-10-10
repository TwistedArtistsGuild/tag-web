# TAG design system (tag-web)

The look every page must share. Direction approved by the owner on 2026-10-10: **7A "Liquid Gradient, Magenta"**, TAG's identity made modern and smooth. Reference mockup and spec live beside this repo in `../docs/design/landing-7a/` and `../docs/specs/`. When a page is redesigned, it uses these tokens and primitives; it never invents its own.

## Palette (tokens only)

All colours come from `styles/tokens.css` as `var(--tag-…)`. **Never a raw hex outside that file.**

Theming is two attributes on `<html>`:
- `data-palette`: `orig` Original (default; the approved brand palette: Electric Indigo `#6233FF` + Chartreuse `#CEFF1D` on Onyx `#151318`, Ghost White `#F5F5FC` text) or `7a` Magenta. Cyan was removed (owner, 2026-10-10). A palette changes colours only. NEVER fonts or layout.
- `data-mode`: `dark` (default) or `light`.

The visitor picks both in the header palette picker. They're saved in `localStorage` (`tag-palette`, `tag-mode`) and applied before first paint. All 4 combinations define the same token names, so components never branch on palette or mode.
- A palette changes only the accent tokens: `--acc` (edges and glows), `--acc-text` (the only accent colour allowed for text), `--btn-end`, and the swatch. Surfaces, type scale, shapes and layout never change per palette.
- Light mode changes the surface and text tokens. Photo areas (hero, video, feature images) stay dark in both modes.
- Every new page is checked in all 4 combinations.

tag-theme (dark, default):

| Token | Value | Rule |
|---|---|---|
| `--tag-indigo` | `#6233ff` | Primary. Fills, edges, glows. **Never text on dark** (3.09:1). |
| `--tag-indigo-deep` | `#4a22e0` | Button gradient start, pressed. |
| `--tag-indigo-soft` | `#8f72ff` | Indigo text/links on dark. Never under white text (3.49:1). |
| `--tag-magenta` | `#ff4fd8` | Second brand colour (replaced chartreuse). Edges, glows, accents, text on dark. **Never under white text** (2.85:1). |
| `--tag-violet` | `#a62fd1` | Button gradient end. |
| `--tag-bg` / `--tag-bg-2` | `#151318` (brand Onyx) / `#1a171f` | Page / header-footer. |
| `--tag-surface` / `--tag-surface-2` | `#1d1a24` / `#24202d` | Cards, panels, inputs / raised. |
| `--tag-line` / `--tag-line-2` | white 8% / 14% | Hairlines. |
| `--tag-text` / `--tag-text-2` / `--tag-muted` | `#f5f5fc` / `#c9c5d6` / `#9a96aa` | Body / secondary / meta. |

Light theme: bg `#f7f5fc`, surface `#fff`, text `#1d1a24`, muted `#5d586b`, indigo usable as text, magenta text `#b0128c`, bright magenta for edges only.

- Chartreuse (`#ceff1d`) is the default accent (`orig` palette), always via tokens, never hard-coded. Its text colour in light mode is `#4a6600`.
- Light-mode accent text per palette: `#4a6600` for Original, `#b0128c` for Magenta.

## Brand motion

- **TAG morph mark** (`public/tag-mark.svg`, engine in `../docs/design/logo-morph/`): the mark morphs logo → record / palette / paintbrush / canvas / pencil in an endless loop, and its gradient colours morph with it: each icon is its own mix of ghost white, indigo, soft indigo and the accent (mixes in `utils/morphMark.js`). Use it as the brand's motion signature. It must run only while on screen and with the tab visible, sample shapes once, and show the static mark with reduced motion.
- **Static TAG mark** (`components/TagMark.js`): the same shape, unanimated, palette gradient fill (start colour `--tag-mark-start`: white on dark, near-black on light). It's the footer's brand, in place of the logo image and name.
- **Bloomscroll cue**: a small mouse icon whose wheel runs the original scroll-cue animation (slides down 6px and fades, 1.8s ease-in-out, endless loop, pure CSS). Use it only on Bloomscroll actions. It stays static with reduced motion.
- Signature gradients are tokens, reused, never re-typed:
  - edge `135deg indigo → faint white → magenta` (1px border via padding-box/border-box)
  - heading text `#fff → #d9ceff → indigo-soft → magenta`
  - button `135deg #4a22e0 → #6233ff → #a62fd1`
  - accent bar `90deg indigo → magenta`
- MUST: WCAG 2.2 AA in every theme: 4.5:1 body text, 3:1 large text and UI parts. Check new token pairs with a contrast script before using them. Primary buttons always use the button gradient (≥5.3:1 with white).

## Type

- Body **Manrope** (TAG's official font, `public/TAG OFFICIAL/FONT/`, `next/font/local`). Headings **Sora** 600/700 (`next/font`, self-hosted at build). Two families only. NEVER Inter, Roboto, Lato, Poiret One or comic-style faces.
- Headings: tight tracking (-0.025em), line-height 1.04–1.1, `text-wrap: balance`. Fluid sizes with `clamp()`.
- Meta labels: 12–13px uppercase, letter-spacing .12–.14em, `--tag-muted`.

## Shape, depth, spacing

- Radii tokens: 10 (inputs, small buttons), 14 (rows, chips), 20 (media), 28 (feature cards, panels), 999 (pills). Nested radii concentric.
- Borders 1px hairline or the gradient edge. NEVER 2–3px outlines or heavy glow borders.
- Shadows layered and soft, tinted indigo. Glow only as a subtle hover/focus accent.
- Sections: 96px vertical (72px phones), max width 1200px, 24px gutter (16px phones).
- NEVER divider lines between sections. Separate with spacing and a faint alternating band.
- Section heads: short gradient accent bar (44×4px) over a centred heading and intro line.

## Primitives (reuse, don't restyle per page)

Button (primary gradient / ghost / small), field (input, search, select, textarea), card (gradient edge), chip/badge, accordion, eyebrow, accent bar, gradient text. They live in `components/ui/*.css` and the daisyUI theme variables. If a page needs a variant, add it to the primitive, not to the page.

## Layout and alignment

- MUST: deliberate alignment to the grid, no accidental placement. Text blocks and their buttons share one centre line or one edge.
- Headings and intro lines centred. On phones, content stacked under a heading is centred too. Forms, long lists and legal text stay left.
- Hero taglines break by clause. The landing cascade uses one 12-column grid with equal row gaps: left edge / centred / right edge.
- Buttons are content-sized on phones (never full-width), ≥44px tall, and wrap to a second row when there's no room.
- No tall, skinny cards. Feature rows stack image-first on phones.
- MUST: no horizontal scroll at any width (check 320, 390, 768, 1440, 1920), with the sidebars closed **and open**.
- Every page must hold its layout with one or both sidebars open (they push content at ≥1280px). Size display type and grids from the space actually available (container queries / `cqi`), not only the viewport.

## Dashboard shell (shared by every page)

- Header is the only main navigation. Below 1060px it collapses to a hamburger, and the browse/cart sidebars open from header icon buttons. From 1060px they open from glassy edge tabs.
- Sidebars: Browse (left) and Cart (right). They push content at ≥1280px and overlay with a scrim below that (one at a time). A panel fills the width on phones. Close with Escape or the scrim. `inert` while closed; focus goes in on open and back to the opener on close.
- Sidebar lists use compact rows: a 52px thumbnail/avatar/date tile, a truncating title, one meta line, an optional price chip. Grids inside panels use `minmax(0, 1fr)` so long text can't widen the panel.
- Buttons in panels are content-sized and centred, like everywhere else.

## Interaction and accessibility

- Every hover style inside `@media (hover: hover) and (pointer: fine)`. `:active` press is fine.
- `prefers-reduced-motion`: no movement. The file that owns the motion turns it off.
- Animate only `transform` and `opacity`. NEVER `transition: all`.
- `:focus-visible` rings (magenta), never `outline: none` without a replacement. Sticky header never covers focus.
- Icon-only buttons have `aria-label`. Menus have `aria-expanded`. Escape closes menus and drawers.
- Mobile menu: animated hamburger (bars fold into an X, links stagger in), instant with reduced motion.
- Phone inputs are 16px or larger. Never disable zoom.
- `<a>`/`<Link>` for navigation, `<button>` for actions. NEVER `div onClick`.
- Alt text on every meaningful image; decorative ones `alt=""`/`aria-hidden`.
- Use `…`, curly quotes, and non-breaking spaces in brand names and units.

## Images

- A deliberate mix: TAG's original/performance photos (e.g. `public/queencitycirque.jpg`, event and music shots) alongside painting and art photos. Don't let one kind take over a page.
- `next/image` with `sizes`. The above-the-fold image is `priority`, the rest lazy. Always give an aspect ratio, so layout shift stays 0.

## CSS structure

Follow the owner's global CSS standard (`~/.claude/rules/css-structure.md`). For this repo:
- `styles/globals.css` holds only the Tailwind import, the daisyUI plugin block and `@import`s.
- Shared files: `styles/tokens.css`, `styles/base.css`, `styles/layout.css`, plus `components/ui/*.css`.
- Owned styles sit next to their component. Plain CSS, kebab-case. No new CSS Modules.
- Component rules go in `@layer components`. A file imported by a component starts with `@layer properties, theme, base, components, utilities;`.

## Performance

- Two font families, only the weights in use. No new third-party scripts.
- Media embeds (Vimeo) load on interaction, behind a poster image.
- Landing targets (Lighthouse mobile, median of 5): Performance ≥90, A11y/Best Practices/SEO ≥95, LCP ≤2.5s, CLS 0.
