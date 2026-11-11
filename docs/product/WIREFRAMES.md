# Visual Product Sprint — proposals and wireframes

**Status (2026-11-11):** T-021 is complete. Proposal A — Editorial Index is selected for T-032 home-page implementation. The two independent reviews are recorded in `.ai/REVIEWS/2026-11-11-t021-proposal-scores.md`. No application code has been changed yet.

**Proposal time-box:** one compact desktop/mobile wireframe and one trade-off list per option; no high-fidelity mockup, external artwork, or asset copying. See `research/visual-reference-notes-2026-11-11.md` for two visual references and applicable empty-state principles.

## Shared requirements for both proposals

- The same nine general-audience category tiles are present on Home at all times: General Illustration, Festival & Celebration, Nature & Wildlife, Fantasy & Mythology, Portrait & Character, Fashion & Editorial, Architecture & Places, Abstract & Experimental, Indian Folk & Traditional. Category filtering can use the existing search/category state; do not invent additional routes.
- The hero includes search. The header is compact on phones; no oversized abstract hero scene or scroll-dependent category carousel.
- “Featured” means a clearly labelled editorial collection/category placement, not an unverified claim that an artwork was staff-selected. It may highlight the Indian Folk & Traditional category using a decorative UI icon/pattern, with the AI-inspired/not community-created notice. Actual featured artwork can appear only after a human-curated approved work is available.
- “Latest” contains only approved general-audience artworks. If none are available, show an honest explanation and one useful action. Loading uses neutral skeleton cards only. Do not use CSS scenes, gradients, stock images, sample creators or generated works as pretend art.
- Separate loading, empty/no-result, and error states. Errors have a safe retry. Public copy never says “backend” or “Supabase.” Safety labels, permanent AI-generated disclosure, artwork ID, rights and approved-only access remain unchanged.
- Use semantic headings, real form labels, visible keyboard focus, accessible button names, responsive text/tiles, reduced-motion support, lazy loading for real artwork images, and a useful screen-reader/DOM reading order.

## Proposal A — Editorial Index (Gallery Ash) — selected

**Emphasis:** simple editorial rhythm and easy scanning. All nine equal category tiles are visible together; no category is visually hidden behind a carousel or menu.

**Desktop wireframe**

```text
┌ compact header: Kamna mark | Explore | Indian Folk | Rules | Sign in / Upload ┐
├ hero: “Discover art beyond the ordinary.”                                     ┤
│ short AI-art disclosure                                                      │
│ [ Search approved art, titles, creators, tags…                 ] [Search]     │
├ Browse all nine collections                                                   ┤
│ [General] [Festival] [Nature]                                                 │
│ [Fantasy] [Portrait] [Fashion]                                                │
│ [Architecture] [Abstract] [Indian Folk]                                       │
├ Featured collection · Indian Folk & Traditional                               ┤
│ decorative collection icon + respectful AI-inspired note + [Explore]         │
├ Latest approved works                                                        │
│ [responsive masonry of real approved work only]                               │
└ honest empty/error/skeleton state as appropriate                              ┘
```

**Mobile wireframe:** 52–56 px header → short single-column title and compact search form → equal 3-column category tile grid (labels wrap to two lines; tiles remain tap-safe) → one featured editorial callout → two-column latest masonry when real works exist. If the API is loading, skeletons replace artwork cards; if empty, a designed text/icon empty state replaces the grid.

**Strengths:** strongest category parity and predictable reading order; content hierarchy is explicit; equal tiles make all nine entry points easy to find; relatively easy to maintain and test with CSS grid plus masonry for works.

**Trade-offs:** visually more orderly/less surprising than Pinterest; the equal tile block consumes vertical room on a small phone; Featured is a category placement until real editorially selected works exist.

## Proposal B — Collection Atlas (asymmetric bento)

**Emphasis:** a more expressive, Pinterest-like discovery board, while keeping every category visible and text-labelled. The asymmetry is built from UI tiles and icons, never pretend artwork.

**Desktop wireframe**

```text
┌ compact header: Kamna mark | Explore | search icon / account actions           ┐
├ compact hero: “Find your next visual language.” [wide search field]             ┤
├ collection atlas / 9 labelled tiles                                             ┤
│ [Indian Folk — 2 units] [General] [Festival] [Nature]                           │
│ [Fantasy] [Portrait] [Fashion] [Architecture] [Abstract]                        │
│ (All nine shown together; styles distinguish categories but not content.)       │
├ split discovery band                                                            │
│ Featured: Indian Folk editorial collection | latest approved count/context      │
├ Latest approved works · variable-height masonry                                 │
│ [real approved works only; responsive columns; lazy images]                    │
└ honest empty/error/skeleton state as appropriate                              ┘
```

**Mobile wireframe:** compact header → small two-line title with search immediately underneath → two-column atlas with Indian Folk as a two-column featured category tile and the remaining eight labelled tiles in stable row-major DOM order → compact Featured collection callout → latest two-column masonry or empty state. No category scroll rail, accordion, or extra click is required to reveal the remaining general categories.

**Strengths:** stronger visual hierarchy and a more distinctive discovery-board feel; gives the requested Indian Folk collection a visible, respectful entry point; uses variable tile sizes without inventing artworks.

**Trade-offs:** a selected larger tile can imply editorial priority, so the tile must stay labelled as a category rather than a claim about popularity; uneven geometry needs careful focus and reading-order tests; more CSS complexity than Proposal A.

## Independent rubric scores and selection — 2026-11-11

Both reviewers scored each proposal 1–5 on the seven project rubric dimensions. They were separately spawned read-only Manus subagents in isolated sandboxes; neither was the author, and they did not coordinate. They share the owner's Manus service/account, so this is agent independence, not a claim of separate human-account independence.

| Reviewer | Proposal A | Proposal B | Recommendation |
|---|---:|---:|---|
| `job_x2Bs3jRk` | 31/35 | 25/35 | A |
| `job_qgdTgkO0` | 32/35 | 28/35 | A |
| Mean | **31.5/35** | **26.5/35** | **A by 5 points** |

| Rubric dimension | A mean | B mean |
|---|---:|---:|
| UX clarity | 4.5 | 4.0 |
| Mobile-first behavior | 4.0 | 4.0 |
| Accessibility | 4.5 | 3.0 |
| Performance (proposal-level, unmeasured) | 4.0 | 3.5 |
| Security (proposal-level, not implementation verification) | 4.5 | 4.5 |
| Fit with plan | 5.0 | 4.5 |
| Maintainability | 5.0 | 3.0 |

**Decision:** Select Proposal A for implementation because both independent reviewers preferred it and it scored 10 aggregate points higher across their two reviews. Its equal category treatment, predictable reading order and simpler layout best fit the requirements. This is a design judgment, not measured user preference or performance evidence. Keep all implementation safeguards listed above.

## Mobile and error states

Mobile navigation stays compact. Loading uses neutral skeletons; no results/first-use explains what is missing and offers one relevant next action; errors show a plain safe message and retry. Sensitive previews never rely on hover. Text, keyboard focus, accessible names and state must remain usable at phone widths and with reduced motion.

## Owner summary

दो प्रस्तावों को दो अलग agents ने score किया।
Proposal A को 31.5/35 औसत मिला; Proposal B को 26.5/35।
इसलिए A चुना गया; app code अभी नहीं बदला।
हर category दिखेगी, artwork केवल approved होगा।
