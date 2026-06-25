---
name: targeting-rare-skill
description: hcp targeting, scoring, normalization, deciling, and tiering for rare disease, branded, and combined pharma markets. use when scoring hcps using commercial metrics (rx, claims, patient counts) and/or influence metrics (clinical trials, publications, kol status, online presence), applying continuous-band outlier-aware normalization, computing weighted composite priority scores, assigning cumulative-score-based deciles and tiers, and delivering findings as a structured consultancy briefing in chat — no excel output.
---

# Rare Disease and Branded HCP Targeting

Use this skill to convert HCP-level commercial, activity, influence, and strategic metrics into a transparent priority score, decile, tier, and deployable HCP target list — for rare disease, branded, or combined market targeting. Deliver all findings as a structured consultancy briefing. No Excel files are generated.

The output must be explainable, auditable, and suitable for CRM deployment, call planning, field prioritization, and leadership review.

---

## Required inputs

Before scoring can begin, collect or confirm:

1. **Market type:** `rare disease` / `branded` / `combined`
2. **HCP-level data** with at least one unique identifier and available metrics:
   - HCP ID, HCP name, NPI or other identifier
   - Specialty, institution name, institution setting, geography or territory
   - Diagnosed patient count, total claims count, treatment patient count, latest claim date
   - Clinical trials count or score, publications count or score, online presence score, KOL flag or score
3. **Weighting method:** user-defined weights, or a metric priority order for rank-decay weights
4. **Tier cutoffs:** decile-based or score-based thresholds
5. **max_allowed_gap:** default 10 (used in continuous-band normalization; document and expose in output)

---

## Market-specific scoring logic

### Rare disease

For rare disease targeting, the core problem is that volume-based scoring alone mis-ranks the most strategically important HCPs. A KOL at a major academic center who has diagnosed 5 rare disease patients is more commercially valuable than a community physician who has coincidentally seen 20 patients. The scoring model must capture this.

**Score patient opportunity:**
- Diagnosed patient count — primary indicator of current diagnosis activity
- Treatment patient count — subset actively managing patients on therapy
- Total claims count — volume proxy across the care continuum
- Recency of activity — recent claims signal active engagement; stale claims signal dormancy

**Score strategic fit:**
- Specialty — target specialists (1000) vs. adjacent specialists (500) vs. non-relevant (0)
- Institution setting — academic community (1000) vs. non-academic (500) vs. unknown (0)
- KOL flag or score — binary or scaled influence indicator

**Score influence:**
- Clinical trials — participation as PI or sub-investigator signals disease expertise and network influence
- Publications — peer-reviewed output signals scientific authority
- Online presence — conferences, webinars, educational platforms; indicator of thought leadership reach

**Combine into composite score.** Use deciles and tiers together: deciles provide distribution ranking; tiers provide commercial actionability.

### Branded

For branded market targeting, prioritize market activity and commercial opportunity.

1. Apply business strategy filters (territory, specialty, geography)
2. Score market value: Rx volume, NRx trends, patient market share
3. Normalize and weight commercial metrics
4. Compute final priority score and sort descending
5. Assign cumulative score-based deciles
6. Apply field capacity or business tier rules

### Combined

For combined targeting, preserve both commercial opportunity and rare disease strategic relevance.

1. Score branded opportunity as a component
2. Score rare disease opportunity and influence as a component
3. Create a blended final priority score
4. Preserve component scores so the user can explain why each HCP is prioritized
5. Assign deciles and tiers from the combined score unless separate component deciles are requested

---

## Normalization

Normalize each numeric metric to a 0–1000 scale before weighting.

### Continuous-band min-max normalization

This method protects against the distortion caused by extreme outliers. If a single HCP has 10× the Rx volume of the next highest, raw min-max normalization would compress all other HCPs to near-zero scores. Continuous-band normalization identifies the dominant data pattern and treats outliers as values at the edge of the normal range.

**Algorithm for each numeric metric:**

1. Sort unique non-blank numeric values ascending
2. Calculate the gap between each value and the previous value
3. Identify continuous groups where gap ≤ `max_allowed_gap` (default: 10)
4. Select the dominant continuous group:
   - Prefer the group with the most data points
   - If tied: prefer the group with the wider range
   - If still tied: prefer the group with the higher total row count
5. Set `band_min` = minimum of the dominant group; `band_max` = maximum
6. Cap raw values into the band: values < band_min → band_min; values > band_max → band_max
7. Normalize the capped value: `score = ((capped_value - band_min) / (band_max - band_min)) × 1000`
8. Clip to [0, 1000]
9. If band_max = band_min, assign default score of 0

**Example:**
For data: `1, 1, 20, 21, 22, 23, 24, 25, 27, 29, 30, 31, 78, 90, 100`
Dominant continuous group: `20–31` (10 values, gaps all ≤10)
band_min = 20, band_max = 31
Values below 20 → score = 0; values above 31 → score = 1000; values between 20–31 → scaled 0–1000

**Directional alignment:**

Positive-direction metrics (higher value = higher priority): diagnosed patient count, treatment patient count, claims count, clinical trials, publications, online presence, KOL score — normalize as above.

Negative-direction metrics (lower value = higher priority): days since latest claim — reverse the score:
`reversed_score = 1000 − normalized_days_since_claim`

**Do not use:** percentile capping (P90, P95, P99), winsorization, quantile-based normalization, or any arbitrary percentile cutoff — unless the user explicitly requests it.

### Recency scoring

Use actual dates, not text strings.

`days_since_latest_claim = reference_date − latest_claim_date`
`recency_score = MAX(0, 1000 × (1 − days_since_latest_claim / recency_window_days))`

Default recency window: 365 days. Document the reference date and window used.

### Categorical scoring

Map categorical fields to numeric scores using visible mapping tables:

| Specialty | Score |
|---|---:|
| Target specialty | 1000 |
| Adjacent specialty | 500 |
| Non-relevant | 0 |

| Institution setting | Score |
|---|---:|
| Academic community | 1000 |
| Non-academic community | 500 |
| Unknown | 0 |

| KOL flag | Score |
|---|---:|
| Yes | 1000 |
| No | 0 |

Document all categorical mapping assumptions in the output.

---

## Weights

### Rank-decay weights (from priority order)

`weight_i = (n + 1 − rank_i) / Σ(n + 1 − rank_all)`

This produces naturally tapered weights from the most important to least important metric, without requiring the user to specify exact percentages.

Default rare disease priority order:
1. Diagnosed patient count
2. Treatment patient count
3. Recency
4. Total claims count
5. Specialty
6. Institution setting
7. Clinical trials
8. Publications
9. Online presence
10. KOL flag or score

Adjust the order based on which metrics are present in the uploaded data, and based on indication-specific clinical context (e.g., for a disease where diagnosis is driven by genetic testing rather than clinical volume, clinical trials and publications should rank higher than patient counts).

### User-defined weights

If the user provides weights, normalize them to sum to 100%:
`effective_weight_i = user_weight_i / Σ(user_weight_all)`

Show the weight table in the output, including: metric name, rank or user weight, effective weight %, normalization band, and directional alignment.

---

## Composite score

`final_priority_score = Σ(normalized_metric_score_i × effective_weight_i)`

On a 0–1000 scale if normalized scores are 0–1000. Convert to 0–100 only if the user specifically requests it.

---

## Sorting and cumulative scoring

Before deciling:
1. Sort all HCPs by final priority score descending
2. Compute cumulative priority score: running sum from rank 1 to rank N
3. Compute cumulative %: `cumulative_% = cumulative_sum / total_sum × 100`

This cumulative % is the basis for decile assignment.

---

## Deciling logic

Assign deciles based on cumulative descending priority score contribution. D10 = highest priority.

| Cumulative % range | Decile |
|---|---|
| 0–10% | D10 |
| 10–20% | D9 |
| 20–30% | D8 |
| 30–40% | D7 |
| 40–50% | D6 |
| 50–60% | D5 |
| 60–70% | D4 |
| 70–80% | D3 |
| 80–90% | D2 |
| 90–100% | D1 |

D10 = the first 10% of cumulative score — this decile contains the smallest number of HCPs but the highest-priority ones.
D1 = the last 10% of cumulative score — this decile contains the largest number of HCPs (many HCPs with low individual scores).

If the user requests equal-count deciles instead, use rank-based deciling and state clearly that the logic has changed.

---

## Tiering

Default rare disease tiering (adjust if the user specifies custom cutoffs):
- Tier 1: D8–D10
- Tier 2: D5–D7
- Tier 3: D1–D4

Document the tier cutoffs and validate that the resulting HCP/rep ratio falls within the optimal range for the market type (rare disease specialty: 50–100 HCPs/rep; branded specialty: 100–200 HCPs/rep).

---

## Inclusion and exclusion overrides

Apply override logic to the final tier/targeting status:

1. If an exclusion override exists → final status = `Exclude` (takes priority over score)
2. If an inclusion override exists → final status = `Include` (overrides score-based exclusion)
3. Otherwise → apply score, decile, tier, and field capacity rules

Override examples:
- Forced inclusion: strategic KOL below T1 cutoff; field-validated priority; known referral network leader
- Forced exclusion: inactive HCP; compliance restriction; invalid specialty; duplicate record

---

## Quality checks

Before delivering the briefing, confirm:

1. All scoring metrics are directionally aligned (higher normalized score = higher priority)
2. Weights sum to 100% after normalization
3. No missing HCP identifiers in the scored output
4. Duplicate HCP identifiers flagged
5. Recency scoring used actual dates, not text strings
6. Continuous-band band_min and band_max documented for every numeric metric
7. Normalized scores are all between 0 and 1000
8. Low outliers capped to band_min; high outliers capped to band_max
9. Percentile or winsorization logic NOT used (unless explicitly requested)
10. Inclusion and exclusion overrides applied in correct priority order
11. Final priority score sort is descending before deciling
12. Cumulative score % computed after sorting
13. D10 = highest priority decile; D1 = lowest
14. Tier counts produce defensible HCP/rep ratios for the market type
15. All categorical mappings are documented

---

## Required consultancy output sections

The final briefing must include all of the following:

**A. Scoring Framework Summary**
Market type, total HCPs scored, normalization method, score scale, deciling method, tier cutoffs, final weight table with normalization bands, and any adjustments made during computation.

**B. Score Distribution Analysis**
Full decile breakdown table (count, % of universe, score range, tier per decile). Tier summary table with HCP counts and HCPs/rep. Narrative interpretation of what the distribution reveals about the HCP universe.

**C. Metric Contribution Analysis**
For each metric: normalization band, outlier capping impact, % of HCPs above 500 score, differentiation power. Highlight the top 2–3 most differentiating metrics with commercial rationale. Flag low-differentiation metrics as weight reduction candidates.

**D. Top HCP Insights**
Table of top 20 T1 HCPs with specialty, state, institution, final score, primary and secondary score drivers. Narrative commentary on the top 5–10. Override review flags (forced-include candidates, data quality concerns).

**E. Pareto Concentration Analysis**
% of HCPs accounting for top 50% and 80% of cumulative score. Commercial interpretation: what does the concentration profile mean for deployment scope?

**F. Deployment Recommendation**
Tier coverage options table (HCPs, HCPs/rep, % score captured). Clear recommendation on which tier combination to deploy with commercial rationale. Phasing guidance if launch context is active.

---

## Output rules

1. All output is delivered as structured markdown in chat. No Excel files are created.
2. Show all scoring methodology transparently — band_min, band_max, weights, score examples.
3. Reference actual HCP counts and metric values from the data. Never use generic placeholders.
4. Make recommendations directly. Present the data, explain the commercial implication, state the action.
