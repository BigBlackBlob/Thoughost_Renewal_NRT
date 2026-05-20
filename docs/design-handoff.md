# Design Handoff

This project uses a measured handoff model for precision visual feedback. Designers can continue to describe preferences with natural language, screenshots, and annotations; implementation turns that feedback into CSS tokens, component parameters, screenshot comparisons, and a short acceptance checklist.

The goal is not to ask designers to write code. The goal is that each visual change is locatable, reproducible, screenshot-verifiable, and easy to roll back.

## Feedback Template

Use one entry per visual issue:

```text
Page:
Locale:
Viewport:
Screenshot / annotation:
Area:
Expected change:
Priority:
Notes:
```

Good viewport values are:

- `390x844` for mobile
- `768x1024` for tablet when needed
- `1440x900` for desktop

Good expected-change labels are:

- Font size
- Font weight
- Letter spacing
- Line height
- Vertical spacing
- Horizontal alignment
- Image crop
- Module density
- Hover or focus state
- Mobile tap target

## Handoff Rhythm

Handle one visual layer per round so comparisons stay clean:

1. Header and home hero
2. News and releases
3. Footer
4. Detail pages
5. Mobile menu and responsive polish

Avoid mixing unrelated layers in the same round unless the issue is a shared token regression.

## Token First Rule

Most visual changes should start in `src/app/globals.css`. Prefer existing CSS custom properties before adding component-level numbers.

Current token groups:

- `--type-*`: shared type scale, body copy, metadata, card titles, detail titles, prose rhythm
- `--header-*`: header height, edge spacing, logo size, navigation size, icon sizing, social gaps
- `--hero-*`: hero heights, pane width, pane gaps, overlay strength, title size, CTA sizing, mobile hero density
- `--news-*`: news section top spacing, heading size, list gaps, row padding, date and title sizing
- `--release-*` / `--releases-*`: releases section spacing, heading size, cover size, cover gaps
- `--footer-*`: footer type sizes, social icon sizing, logo spacing, divider spacing, muted color
- `--motion-*`: transition duration and easing

Only add a local component variable or class when no existing token clearly owns the requested behavior.

## Designer Language Map

| Designer wording | Implementation action |
| --- | --- |
| Text feels too loose or tight | Adjust `letter-spacing` or `line-height` |
| Block feels too scattered or crowded | Adjust section padding, row padding, or gap tokens |
| The mood is not sharp enough | Adjust font weight, rules, alignment, hover/focus states |
| The image feels unstable | Adjust container width, grid track, `object-fit`, or `object-position` |
| Mobile feels uncomfortable | Check tap target, line height, wrapping, and first-screen density |
| The page feels unbalanced | Check container max width, edge spacing, and grid column sizing |
| The typography feels weak | Check weight, size, contrast, and language-specific font fallback |

## Verification Flow

For each visual round:

1. Check the current worktree and keep unrelated changes out of the patch.
2. Start the local site.
3. Capture `390x844` and `1440x900` screenshots; capture `768x1024` if tablet behavior is relevant.
4. Check browser console errors.
5. Check no horizontal scrolling.
6. Check no visible text overflow.
7. Check interactive targets are at least `44px` on touch layouts.
8. Run code gates:

```bash
corepack pnpm@10.25.0 lint
corepack pnpm@10.25.0 typecheck
corepack pnpm@10.25.0 test
corepack pnpm@10.25.0 build
```

If a round only changes documentation, run the smallest relevant verification, usually `git diff --check`.

## Delivery Format

Report each round with three columns:

| Original feedback | Implemented token / component | Screenshot evidence |
| --- | --- | --- |
| Example: hero title feels too tight on mobile | `--hero-mobile-title-line`, `--hero-mobile-title-size` | `390x844` before/after |

Also include:

- Desktop screenshot path
- Mobile screenshot path
- Changed token or component summary
- Tests and checks run
- Known exclusions

## Scope Guardrails

- Keep the site on the current static-export route unless a separate product decision changes that.
- Do not introduce Figma plugins, CMS tooling, or visual editors in the first phase.
- Keep feedback natural-language friendly; designers should not need to know CSS, React, or Next.js.
- Keep magic numbers out of components when a token can express the change.
- Keep current uncommitted UI work separate from future handoff-process commits unless explicitly included.
