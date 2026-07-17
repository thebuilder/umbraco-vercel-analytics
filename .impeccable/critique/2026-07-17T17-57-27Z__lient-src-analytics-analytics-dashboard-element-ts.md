---
target: the analytics page
total_score: 32
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T17-57-27Z
slug: lient-src-analytics-analytics-dashboard-element-ts
---
Method: dual-agent (A: /root/design_assessment_retry · B: /root/detector_assessment)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 4 | Loading, empty, error, and active-filter states are unusually thorough. |
| 2 | Match System / Real World | 3 | Core traffic language is clear; UTM and Flags assume analytics knowledge. |
| 3 | User Control and Freedom | 3 | Filters are removable and dialogs closable, but filter changes are immediate and lack undo. |
| 4 | Consistency and Standards | 4 | Strong, disciplined use of Umbraco primitives and semantic UUI tokens. |
| 5 | Error Prevention | 3 | Date ranges are constrained well; immediate cross-filtering has few guardrails. |
| 6 | Recognition Rather Than Recall | 3 | Main controls are visible, but row filtering is hidden until hover or focus. |
| 7 | Flexibility and Efficiency | 3 | Good keyboard navigation and focused detail dialogs; few expert accelerators. |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained styling, but many equal-weight report cards flatten the hierarchy. |
| 9 | Error Recovery | 4 | Errors are local, contextual, and generally paired with Retry. |
| 10 | Help and Documentation | 2 | Comparison periods, UTM, Flags, and row-filter effects need contextual explanation. |
| **Total** | | **32/40** | **Strong foundation, with discoverability and hierarchy gaps** |

## Anti-Patterns Verdict

**LLM assessment:** This does not read as generic AI-generated UI. It is visibly shaped around Umbraco conventions, uses restrained native primitives, and has unusually careful accessibility behavior. The main slop-adjacent trait is structural sameness: a long sequence of similarly styled boxes with repeated table/footer patterns can feel assembled from one reusable dashboard recipe rather than composed around editors' questions.

**Deterministic scan:** Clean. The detector returned `[]` for `analytics-dashboard.element.ts`: zero findings, no rule locations, and no suspected false positives. It did not uncover an issue missed by the design review.

**Visual overlays:** No reliable user-visible overlay is available. The detector assessment could not connect to localhost:44389, and its browser evaluate surface was read-only. The fallback was deterministic CLI output plus source inspection. The design assessment reached Umbraco's unauthenticated login screen in its separate fresh tab, so detailed visual judgments remain provisional.

## Overall Impression

This is a strong, credible Umbraco-native analytics surface. It prioritizes accessibility, recoverability, and progressive depth better than most embedded dashboards. The single biggest opportunity is to turn the report grid into an editorial narrative: help users move from “what happened?” to “where did it happen?” and only then into specialist acquisition, event, and experiment data.

## What's Working

1. **Accessibility is systemic.** Semantic tables, tab roles, arrow-key behavior, focus-visible styling, loading announcements, reduced-motion handling, and non-color comparison descriptions are built into the components rather than patched on later.
2. **It belongs inside Umbraco.** `uui-box`, `uui-button`, `uui-select`, `umb-empty-state`, compact radii, and semantic UUI variables support the product goal of feeling native rather than like a separate analytics application.
3. **Progressive depth is sensible.** Headline metrics lead into history, top-ten summaries stay compact, expanded datasets move into searchable dialogs, and filters remain consolidated and removable.

## Priority Issues

### [P1] Cross-filtering is a hidden primary capability

**Why it matters:** The row-level `.filter-action` begins at `opacity: 0` and becomes visible on hover or focus. A first-time desktop user can successfully read every table while never discovering that a row can filter the entire dashboard. This directly weakens the product principle of delivering value without detours.

**Fix:** Keep a low-emphasis filter affordance visible at rest, strengthen it on hover/focus, and give the first interaction a concise label such as “Filter dashboard by this value.” Preserve the current active-filter strip and pressed state.

**Suggested command:** `$impeccable clarify`

### [P1] The report grid lacks an editorial hierarchy

**Why it matters:** Pages, acquisition, audience, Events, and Flags use nearly identical boxed table/footer treatments. The page risks becoming a long wall of equally important reports, forcing editors to repeatedly scan rather than follow a clear analytical path.

**Fix:** Group reports under explicit questions or sections: Content, Acquisition, Audience, and Events & Experiments. Keep the highest-value editor reports above the fold and progressively disclose specialist groups. Use spacing and section headings before introducing more visual decoration.

**Suggested command:** `$impeccable layout`

### [P2] Specialist concepts are not explained at the point of use

**Why it matters:** “UTM Parameters,” Flags, comparison percentages, and plan-limited reporting presume domain knowledge. The target audience includes content editors who should not need a marketing analytics glossary to interpret the page.

**Fix:** Add concise contextual framing: expand UTM on first use, state the comparison baseline visibly, explain why UTM data may be absent, and distinguish feature-flag exposure from ordinary events. Prefer one-line helper copy or focused tooltips over a documentation panel.

**Suggested command:** `$impeccable onboard`

### [P2] Comparison context is visually under-specified

**Why it matters:** Assistive text describes the comparison well, but sighted users largely get a percentage badge and tooltip/title. A percentage without a visible baseline invites misinterpretation.

**Fix:** Add persistent microcopy near the summary such as “vs previous 30 days,” updating with the chosen range. Keep it subordinate to the metric but visible without hover.

**Suggested command:** `$impeccable clarify`

### [P3] Narrow-container table behavior needs hardening

**Why it matters:** Tables enforce a 20rem minimum while the host clips inline overflow. Long labels and the fixed metric column could truncate inside narrow backoffice panes without an obvious recovery path.

**Fix:** Test at 320–400px container widths. If clipping occurs, use compact stacked rows below the component breakpoint rather than horizontal scrolling inside every card.

**Suggested command:** `$impeccable adapt`

## Persona Red Flags

**Jordan — first-time content editor:** Jordan can recognize Visitors, Page views, and Pages, but will likely miss row filtering because its control is invisible until hover. UTM and Flags arrive without enough framing, so the journey shifts abruptly from approachable traffic data to unexplained specialist terminology.

**Maya — marketing editor:** Maya can switch ranges and drill into top-ten reports efficiently, but repeated equal-weight cards make returning to a specific acquisition insight slower than necessary. The comparison percentage does not visibly state its baseline, which makes campaign reporting less trustworthy.

**Sam — keyboard and assistive-technology user:** Sam benefits from unusually strong tab semantics, focus states, announcements, and table markup. Remaining risks require live verification: focus location after async filter refresh, responsive table clipping, tooltip behavior, and computed contrast under the active Umbraco theme.

## Minor Observations

- Immediate filter application is visible through the active-filter strip, but a polite announcement such as “Filtered by Denmark” would make the causal link clearer.
- “View all” is an appropriate progressive-disclosure mechanism, but repeated identical footers add to the dashboard's visual rhythm; section grouping should be fixed before restyling these actions.
- External page links opening outside the backoffice are reasonable, but the external destination should remain explicit in the accessible name.
- The date preset list has more than four choices, but they are familiar and logically grouped; this is not meaningful decision overload.

## Questions to Consider

- What are the first three questions a content editor should be able to answer in under 20 seconds?
- Should Events and Flags be peers of Pages and Referrers, or an advanced section for a different user intent?
- If every report card disappeared except three, which three would preserve most of the product's value?
- Can comparison context be understood without hovering anywhere on the page?
