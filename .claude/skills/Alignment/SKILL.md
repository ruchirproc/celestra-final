---
name: Alignment
description: use this skill when designing, validating, reviewing, or explaining a zip-based pharma territory alignment strategy. performs geographic eda on an hcp universe, maps rare disease centers of excellence, recommends territory design philosophy (coe-anchor vs workload-balance), validates territory count, recommends workload tolerance, describes state sequencing using a northeastern-start zig-zag sweep, and delivers findings as a structured consultancy briefing in chat — no excel or map output.
---

# ZIP Territory Alignment — Consultancy Strategy

## Purpose

Use this skill to design and explain a ZIP-based pharma territory alignment strategy. The skill analyzes an HCP universe geographically, evaluates territory design options, and delivers a structured consultancy recommendation — not an Excel workbook or map file.

The core territory design principles below are not negotiable. Every recommendation must be rooted in these principles and every tradeoff must be explained against them.

---

# 1. Core Territory Design Principles

These principles govern every recommendation this skill makes.

**ZIP integrity is absolute:** ZIP code is the atomic assignment unit. In any actual alignment execution, every eligible ZIP must be assigned to exactly one territory — no splits, no duplicates, no dropped ZIPs. Recommendations must not suggest designs that would require splitting ZIPs.

**Continuity is the primary structural goal:** Each territory must form one logically continuous geographic region. Scattered pockets, disconnected islands, and territories whose ZIPs are spread across distant regions are operationally unworkable and must be designed against. A slightly workload-imbalanced but geographically coherent territory is always preferred over a perfectly balanced but scattered one.

**Compactness is a structural requirement:** The ZIPs within one territory must be clustered in the smallest feasible geographic pattern. Territories should not contain avoidably distant ZIPs when a compact, contiguous alternative exists. Workload balance and density cannot justify a vast geographic spread.

**State-first neighboring-state sequencing:** Territory building must start from the northeastern-most eligible state and ZIP, then sweep state-by-state through neighboring states only in a zig-zag pattern. Jumping to non-neighboring states to chase workload or density creates scattered, non-contiguous territories and must be avoided.

**Workload balance is downstream:** Only after geographic continuity, compactness, and neighboring-state sequencing are respected should workload balance be considered. A workload deviation that preserves territory shape is better than workload balance that destroys it.

**Priority hierarchy (in order):**
1. No ZIP overlap across territories
2. No ZIP splitting
3. Complete eligible ZIP assignment
4. Continuous regions — no scattered pockets or disconnected fragments
5. No fragmented territories
6. Practical geographic contiguity
7. No vast internal territory distances
8. Compact clustering in the smallest feasible distance pattern
9. State-first neighboring-state zig-zag sequencing (geographic contiguity → compactness → density)
10. Sample maps as visual continuity references (when available)
11. Workload balance
12. Field usability and visual readability
13. User-defined business rules

---

# 2. Required Inputs for Analysis

To deliver a territory alignment recommendation, the following inputs are needed:

- HCP universe file with at minimum: HCP identifier, State, ZIP code, and either a workload metric or priority score
- Latitude and longitude for ZIPs (used to assess geographic spread and compactness)
- Territory count (from sizing module or user-specified)
- Workload tolerance preference (or to be recommended by this skill)
- Geographic scope (National, Regional, or Key markets)
- Drug/indication context for rare disease COE research

---

# 3. Geographic EDA

Before any design recommendation, perform geographic EDA and present findings under a **"Geographic Profile"** section.

**State-level HCP distribution:**
- Rank all states by HCP count — top 15 in detail, rest summarized
- Rank top 15 states by workload/annual calls if workload data is available
- Flag clinically significant states with unexpectedly low HCP presence

**Workload concentration analysis:**
- % of total HCPs in top 5 states
- % of total workload in top 5 states
- Concentration rating: High (>60% in top 5), Moderate (40–60%), Distributed (<40%)

**Regional cluster breakdown:**
Group states into 5 natural clusters (Northeast, Mid-Atlantic/Southeast, Midwest, South/Southwest, Mountain/West). Present HCP count and workload share per cluster.

**Territory sizing indicator:**
If territory count is known: compute average HCPs/territory and average workload/territory. Flag structural mismatches (< 30 or >150 HCPs/rep, or workload/territory far above or below rep annual call capacity from sizing).

---

# 4. Centers of Excellence Research (Rare Disease)

If rare disease context is confirmed, search for:
1. `"[indication] centers of excellence academic medical centers United States [current year]"`
2. `"[therapeutic area] rare disease specialist treatment centers top hospitals US"`

Present top 10–15 centers in a table: institution, city, state, whether the state is in the top-5 workload states, and coverage priority (anchor / priority / monitor).

State how many COEs fall within vs. outside high-workload states — this asymmetry drives the territory design philosophy.

---

# 5. Territory Design Philosophy Recommendation

Recommend one of two philosophies based on the concentration analysis and COE mapping:

**COE-anchor model:** Territories are structured so every major academic treatment center or specialist hub has dedicated territory coverage. Workload balance is secondary to ensuring each COE has a directly assigned rep. Best for: ultra-rare disease, academic-center-driven patient identification, markets where 5–15 HCPs at a single institution generate the majority of diagnoses.

**Workload-balance model:** Territories are structured for even workload distribution. COE coverage falls naturally from the geographic spread. Best for: broader specialty branded markets, markets with distributed community and academic prescribing, markets where no single center dominates patient identification.

State the recommendation explicitly and cite the specific data signals: concentration ratio, COE clustering pattern, market type.

---

# 6. Territory Count Validation

Validate the proposed territory count structurally:

| Metric | Threshold | Assessment |
|---|---|---|
| States per territory | >3–4 = excessive geographic load | States ÷ territory count |
| HCPs per territory | <30 = under-resourced; >150 = over-stretched | Total HCPs ÷ territory count |
| Workload per territory vs. rep capacity | Compare to rep annual capacity from sizing | Total workload ÷ territory count |
| Dense clusters vs. coverage | Any cluster with >4× average workload under-served | Identify from EDA |

If the count fails a check, recommend a specific adjustment with rationale. Do not simply flag a concern — make the call.

---

# 7. Workload Tolerance Recommendation

Explain the three options and recommend one based on concentration:

**±10% (tight):** Well-balanced but may require unnatural geographic boundaries. Appropriate when HCP density is relatively uniform.

**±15% (industry standard):** Allows enough flexibility to respect state lines and COE concentrations without severe imbalance. Recommended for most specialty deployments.

**±20% (loose):** Allows reps in dense areas to carry more load. Appropriate when HCP distribution is highly uneven and tighter balance would create implausible territory shapes.

**Recommendation rule:**
- High concentration (>60% top 5 states): recommend ±20%
- Moderate concentration (40–60% top 5): recommend ±15%
- Distributed (<40% top 5): ±10% or ±15% depending on travel burden

---

# 8. State Sequencing and Territory Structure Plan

Describe how territories should be structured geographically, following the canonical pharma alignment principles.

**Northeast anchor:** Identify the northeastern-most state with meaningful HCP presence. Selection rule: among states with eligible HCPs, find the state whose northernmost ZIP has the highest latitude (use easternmost longitude as tiebreaker). Name the anchor state and the basis for its selection.

**State sequencing principle:** From the anchor state, territories should be built through neighboring states only, sweeping laterally across the current latitude band and stepping south in a zig-zag pattern. Never jump to a non-neighboring state to chase workload or density. Describe the recommended sweep direction for the specific HCP universe.

**Regional allocation table:** For each geographic cluster, recommend how many territories serve it and the state groupings for multi-state territories:

| Geographic cluster | States | HCP count | % total | Territories | Recommended state groupings |
|---|---|---|---|---|---|
| [Northeast] | [states] | [N] | [%] | [T] | [e.g., NY+NJ+CT as one territory, MA+RI as another] |
| [Southeast] | [states] | [N] | [%] | [T] | [e.g., FL standalone, GA+SC+NC as one] |
| [Midwest] | [states] | [N] | [%] | [T] | [state groupings] |
| [Southwest] | [states] | [N] | [%] | [T] | [state groupings] |
| [West] | [states] | [N] | [%] | [T] | [state groupings] |

**Verify:** sum of territories across clusters must equal the total territory count.

**Multi-state territory guidance:** For lower-density regions, name the specific state combinations that make geographic sense — contiguous neighbors, shared travel corridors, similar HCP density profiles. Flag any combinations that create implausible geographic loads.

**COE anchoring (if COE-anchor model):** For each major COE, identify which territory should anchor it and recommend the rep's home-base city.

**Compactness principle for execution:** When the alignment is actually executed, territories should be built starting from the most HCP-dense area within each state/cluster and expanding outward to neighboring ZIPs using nearest-ZIP logic. The first ZIP assigned in each territory should be the highest-density seed in the area. Subsequent ZIPs should be the nearest unassigned ZIPs to the growing territory edge. ZIPs should never be assigned from a distant location just because they improve workload balance — workload refinement should only happen after the territory shape is structurally sound.

---

# 9. Practical Deployment Considerations

**Travel and logistics:** Assess whether reps in each cluster face manageable travel based on the geographic spread. Flag any state combinations that create excessive geographic load. Give specific examples from the data.

**Rep home-base recommendations:** For each cluster, suggest practical metro areas for rep home locations based on HCP density, proximity to academic centers, and airport access (relevant for rare disease reps covering wide geographies).

**Launch phasing (if applicable):** If launch context is confirmed, state whether simultaneous or phased territory deployment is recommended and the specific tradeoff.

**Boundary flexibility provisions:** Identify which territory boundaries are most likely to need post-deployment adjustment — states with cross-border HCP clusters, workload concentration shifts, or new COE openings.

---

# 10. Final Consultancy Summary

Close with a structured summary table:

| Decision | Recommendation | Rationale |
|---|---|---|
| Territory count | [T] | [Data basis] |
| Design philosophy | COE-anchor / Workload-balance | [Why it fits the market] |
| Workload tolerance | ±[X]% | [Concentration context] |
| Northeast anchor state | [State] | [Selection basis] |
| Highest-priority states | [Top 3–5] | [HCP density / COE rationale] |
| Expected workload range/territory | [Low]–[High] calls/yr | [Basis] |

Follow with a plain-language paragraph: what does this territory design mean for the commercial team, what is the most important structural consideration in execution, and what is the most likely failure mode if the alignment is executed poorly?

---

# 11. Output Rules

1. All output is delivered as structured markdown in chat. No Excel workbooks or map files are created.
2. Reference actual HCP counts, state data, and workload figures from the EDA. Never use generic examples.
3. Cite COE sources from web research.
4. Use `Asset` for drug/brand name, `Client` for company name in all visible output.
5. Use headers, tables, and concise bullets. Avoid walls of prose.
6. Make recommendations directly. Show the data basis. State confidence once.
7. Territory design principles in Section 1 are non-negotiable — no recommendation may contradict them.
