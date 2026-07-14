---
name: targeting-combined-skill
description: Build formula-driven HCP targeting, scoring, normalization, deciling, tiering, and finsal target-list Excel workbooks for branded, rare disease, or combined pharma markets. Use when the user asks for HCP-level metric mapping, normalization, weighting, composite scoring, cumulative-score deciling, tiering, target-list creation, CRM/call-plan deployment, Excel scoring workbooks, DQ comparison, consultant-style pharma targeting methodology, rare disease patient opportunity scoring, influence scoring using clinical trials/publications/online presence/KOL, continuous-band min-max normalization, or any combined branded and rare-disease targeting flow.
---
 
# HCP Targeting and Formula-Driven Scoring — Branded, Rare Disease, and Combined Markets
 
Use this skill to build a defendable, auditable, and fully formula-driven HCP targeting methodology. The skill supports all pharma commercial targeting use cases including branded growth, generic defense, launch targeting, switch opportunity, competitive conversion, whitespace identification, retention, account prioritization, access prioritization, rare disease patient opportunity, KOL/influence prioritization, and field-force deployment.
 
The skill must remain generic. Do not hardcode scoring metrics, fixed weights, fixed Excel column letters, fixed row numbers, fixed brand assumptions, or fixed market definitions unless the user explicitly provides them.
 
The primary output must be a strictly formula-driven Excel workbook unless the user explicitly asks only for methodology text.
 
---
 
## Market Type
 
Before scoring, confirm the market type. This determines which scoring components, normalization rules, and deciling logic apply.
 
| Market Type | Description |
|---|---|
| `branded` | Commercial claims, sales, prescriptions, access, market share, engagement |
| `rare disease` | Patient opportunity, influence, KOL, clinical trials, publications, recency |
| `combined` | Both branded commercial value and rare disease strategic relevance |
 
If the market type is missing, ask the user before proceeding. If the user wants speed, default to `branded` and document the assumption.
 
---
 
## Core Principles
 
- Preserve the user's raw data exactly as provided.
- Build scoring logic from the user's selected metrics, available dataset fields, or explicitly approved assumptions.
- Treat every scoring metric as configurable.
- Do not force any metric into the framework as mandatory unless the user explicitly provides that requirement.
- Do not convert absolute metrics into share metrics unless the user explicitly asks for share-based scoring.
- Keep metric mapping, directionality, weights, thresholds, decile settings, tier settings, and exclusions in editable helper tables.
- Use visible Excel formulas for all derived fields.
- Make every score, rank, cumulative score, decile, tier, and target-list field traceable from raw input to final output.
- Use cumulative-score stepwise deciling by default and as the only allowed deciling method unless the user explicitly selects cumulative-percentage deciling.
- Assign the highest decile (Decile 10 / D10) to the highest-priority HCPs and the lowest decile (Decile 1 / D1) to the lowest-priority HCPs.
- Do not use equal-count deciling unless the user explicitly requests it.
- Do not use percentile/rank deciling unless the user explicitly requests it.
- Do not use fixed Excel references such as specific column letters or fixed row numbers in reusable formulas.
- Use structured references, named ranges, helper tables, or dynamically generated references in Excel.
---
 
## Required Inputs to Collect
 
Before scoring or building the final output, ask the user for any missing inputs that materially affect the analysis.
 
1. **Market type**: `branded`, `rare disease`, or `combined`
2. **HCP-level data** with at least one unique identifier and available metrics such as:
   - HCP ID, HCP name, NPI or other identifier
   - Specialty, institution name, institution setting
   - Geography or territory
   - Diagnosed patient count, treatment patient count, total claims count
   - Latest claim date, recency proxy
   - Clinical trials count or score, publications count or score
   - Online presence score, KOL flag or KOL score
   - Sales, claims, prescriptions, market share, or engagement proxy
3. **Weighting method**:
   - User-defined metric weights, or
   - Priority order to be converted into rank-decay weights, or
   - Confirm equal-weight assumption if no weights are provided
4. **Decile and tiering requirements**:
   - Decile cutoffs and tiering thresholds
   - Field capacity or business rules
   - Inclusion and exclusion overrides
5. **Outlier handling parameter** (for rare disease or combined markets):
   - `max_allowed_gap` for continuous-band min-max normalization
   - If not provided, create a visible configurable helper cell with a reasonable default
If weights are not provided and the user wants speed, assign equal weights across all included metrics and document the assumption.
 
---
 
## Mandatory Workbook Output
 
When creating an Excel workbook, include these worksheets in this order.
 
### 1. `summary`
 
Include:
 
- Objective
- Market type (`branded`, `rare disease`, or `combined`)
- Input files or input fields used
- Entity level (HCP, NPI, account, territory, or other user-defined unit)
- Selected scoring metrics
- Scoring approach and market-specific component structure
- Weighting approach
- Normalization method (standard min-max for branded; continuous-band min-max for rare disease or combined)
- Deciling approach
- Tiering approach
- Data-quality summary
- Key assumptions
- Analyst notes
- Deployment interpretation
The `summary` sheet must clearly state:
 
> Deciles were assigned using cumulative-score stepwise deciling. Each decile represents approximately 10% of total final priority score. The highest-priority entities receive Decile 10 (D10), and the lowest-priority entities receive Decile 1 (D1). Equal-count, percentile, rank-based, and direct mathematical deciling formulas were not used.
 
If a single entity's score is large enough to cross multiple score buckets, document this behavior as:
 
> The deciling method is intentionally stepwise and dependent on the previous row's decile. If one entity's score crosses more than one cumulative-score bucket, the workbook still reduces decile by only one level for that row because the mandatory formula uses prior-row stepwise logic.
 
---
 
### 2. `raw_data`
 
Include:
 
- User-provided input data
- No destructive transformations
- Original field names preserved
- Data-quality flags added as separate columns only:
  - Missing ID flag
  - Duplicate ID flag
  - Missing metric flag
  - Invalid numeric value flag
  - Exclusion flag (if applicable)
---
 
### 3. `metric_mapping`
 
Create one row per candidate metric.
 
| Field | Purpose |
|---|---|
| Source Column | Original dataset column |
| Standard Metric Label | Business-friendly label |
| Metric Role | Volume, value, adoption, opportunity, risk, recency, access, engagement, influence, strategic fit, or other |
| Market Scope | Branded, rare disease, combined, or all |
| Include in Score | Yes/No |
| Directionality | Higher is better / Lower is better |
| Normalization Method | Standard min-max, continuous-band min-max, capped min-max, max scaling, binary, categorical, recency, custom, or none |
| Default Weight | Editable value |
| User Weight | Editable value |
| Effective Weight | Formula-driven weight used in score |
| Mapping Status | Direct, inferred, manual, missing, excluded |
| Notes | Assumptions or business rationale |
 
Rules:
 
- Do not require any specific metric.
- Do not assign fixed weights unless the user provides them or approves defaults.
- If the user has not selected metrics, infer likely candidate metrics from the data and ask for confirmation.
- If the user asks to proceed without confirmation, use all suitable numeric metrics marked as relevant and document the assumption.
- If directionality is unclear, infer directionality only when commercially obvious and document the assumption.
- If directionality is not commercially obvious, ask the user before finalizing the workbook.
---
 
### 4. `normalization_helper`
 
Include helper tables for:
 
- Included scoring metrics
- Metric type (numeric or categorical)
- Directionality (positive or negative)
- Normalization method
- Raw minimum and raw maximum
- Band minimum (`band_min`) and band maximum (`band_max`) for continuous-band metrics
- `max_allowed_gap` configurable cell for continuous-band metrics
- Sorted unique values, gap from previous value, continuous group ID, group count, group minimum, group maximum, selected dominant group flag — for each continuous-band metric
- Floor values and cap values for capped metrics
- Default weights, user weights, and effective weights
- Weight check (must sum to 100%)
- Decile settings
- Tier thresholds
- Exclusion rules
- Named range definitions or equivalent helper labels
- Categorical mapping tables
- Recency window (configurable cell)
- Notes and assumptions
The `normalization_helper` sheet must include these deciling settings:
 
| Setting | Value |
|---|---|
| Deciling Method | Cumulative-score stepwise deciling |
| Total Priority Score | Formula-driven sum of final priority scores |
| Decile Score Bucket | Total Priority Score / 10 |
| First Decile Seed | 10 |
| Highest Priority Decile | 10 (D10) |
| Lowest Priority Decile | 1 (D1) |
| Alternate Deciling Allowed | No (unless user explicitly requests) |
 
Use editable cells for all assumptions and thresholds.
 
---
 
### 5. `scoring_calculator`
 
Include one row per targetable entity.
 
Include:
 
- Entity ID
- Available descriptive fields (HCP name, NPI, specialty, institution, geography, territory)
- Raw mapped scoring metrics
- Capped metric values (for continuous-band or capped metrics)
- Normalized metric columns (0–1 scale for branded; 0–1000 scale for rare disease or combined)
- Weighted metric contribution columns
- Component scores when applicable (e.g., patient opportunity score, influence score, branded opportunity score)
- Composite score
- Final priority score (rounded to 5 decimal places)
- Rank
- Sort order helper
- Cumulative score
- Cumulative final priority score percentage
- Prior decile helper
- Decile
- Tier
- Inclusion override
- Exclusion override
- Final targeting status
- Recommended action
- Primary score driver
- Secondary score driver
- Data-quality warning
Every derived field must use Excel formulas.
 
The scoring table must be sorted or formula-calculated in descending order of `Final Priority Score`, where the highest-priority entity appears first and deciling is applied after sorting.
 
---
 
### 6. `final_target_list`
 
Create a CRM-ready output linked from `scoring_calculator`.
 
Include available fields such as:
 
- Entity ID, entity name, NPI or other identifier
- Specialty, institution name, institution setting
- Geography, territory, account or affiliation
- Diagnosed patient count, treatment patient count, total claims count (if available)
- Latest claim date, days since latest claim (if available)
- Clinical trials count or score (if available)
- Publications count or score (if available)
- Online presence score (if available)
- KOL flag or score (if available)
- Selected raw metrics
- Normalized metric scores
- Component scores (if applicable)
- Composite score
- Final priority score
- Cumulative final priority score percentage
- Rank
- Decile
- Tier
- Inclusion override
- Exclusion override
- Final targeting status
- Recommended action
- Primary score driver
- Secondary score driver
- Data-quality warnings
Do not invent fields that are not in the input unless the user asks for a template. Do not hardcode final values in this sheet. Use formulas or references from `scoring_calculator`.
 
---
 
### 7. `final_summary_dashboard`
 
Include formula-driven summaries for:
 
- Count by decile
- Count by tier
- Count by final targeting status
- Included vs excluded entity count
- Average score by decile
- Total score by decile
- Score distribution
- Metric contribution summary
- Data-quality flag counts
- Recommended action summary
- Deployment summary
---
 
## Market-Specific Scoring Logic
 
### Branded Market
 
For branded market targeting, prioritize market activity, commercial opportunity, and sales or claims proxies.
 
Recommended scoring approach:
 
1. Apply business strategy filters.
2. Score market volume, value, or adjusted opportunity.
3. Score access, engagement, recency, and adoption where available.
4. Normalize and weight relevant metrics using standard min-max normalization (0–1 scale).
5. Calculate the final priority score (scaled to 0–100).
6. Sort by final priority score in descending order.
7. Assign cumulative-score stepwise deciles.
8. Apply field capacity or business rules.
---
 
### Rare Disease Market
 
For rare disease targeting, prioritize both patient opportunity and influence.
 
Recommended scoring approach:
 
1. Score patient opportunity:
   - Diagnosed patient count
   - Treatment patient count
   - Total claims count
   - Recency of activity
2. Score strategic fit:
   - Specialty
   - Institution setting
   - KOL flag or score
3. Score influence:
   - Clinical trials
   - Publications
   - Online presence
4. Normalize numeric metrics using continuous-band min-max normalization (0–1000 scale).
5. Map categorical metrics into numeric scores using editable mapping tables.
6. Apply effective weights.
7. Calculate the final priority score (on 0–1000 scale, or divide by 10 for 0–100 scale if user requests).
8. Sort in descending order before deciling.
9. Assign cumulative-score stepwise deciles.
10. Apply tiers using decile cutoffs.
Default rare disease priority order (if user provides no weights):
 
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
---
 
### Combined Market
 
For combined targeting, preserve both branded market value and rare disease strategic relevance.
 
Recommended scoring approach:
 
1. Score branded opportunity component.
2. Score rare disease opportunity and influence component.
3. Create a combined final priority score from both components.
4. Preserve component scores in the workbook so the user can explain why each HCP is prioritized.
5. Assign deciles and tiers using the combined score unless the user requests separate branded and rare disease deciles.
---
 
## Normalization
 
### Standard Min-Max Normalization (Branded Market)
 
Use standard min-max normalization when outliers are not a primary concern.
 
Normalized scale: 0 to 1 (final priority score scaled to 0–100).
 
**Higher-is-better metrics:**
```excel
=IF(metric_max=metric_min,0,(raw_value-metric_min)/(metric_max-metric_min))
```
 
**Lower-is-better metrics:**
```excel
=IF(metric_max=metric_min,0,(metric_max-raw_value)/(metric_max-metric_min))
```
 
- For **capped min-max metrics**: apply the floor and cap before normalization.
- For **binary metrics**: convert user-approved positive values to `1` and negative values to `0`.
- For **categorical metrics**: use an editable mapping table.
- For **date or recency metrics**: convert dates to a numeric recency measure before normalization.
All normalized scores must be between `0` and `1`.
 
---
 
### Continuous-Band Min-Max Normalization (Rare Disease and Combined Markets)
 
Use continuous-band min-max normalization when outliers are present. Do not use percentiles, quantiles, P90, P95, P99, or winsorization unless the user explicitly requests it.
 
Normalized scale: 0 to 1000.
 
Calculation steps:
 
1. Sort the unique non-blank numeric values in ascending order.
2. Calculate the gap between each value and the previous value.
3. Identify continuous groups where the gap between adjacent values is less than or equal to a configurable `max_allowed_gap`.
4. Select the dominant continuous group as the normalization band:
   - Prefer the group with the highest number of data points.
   - If tied, prefer the group with the wider range.
   - If still tied, prefer the group with the higher total HCP count or row count.
5. Set:
   - `band_min = minimum value of the selected continuous group`
   - `band_max = maximum value of the selected continuous group`
6. Before normalization, cap the raw value into the selected band:
   - Values below `band_min` are treated as `band_min`.
   - Values above `band_max` are treated as `band_max`.
7. Normalize the capped value:
   `normalized_score = ((capped_value - band_min) / (band_max - band_min)) * 1000`
8. Clip the final normalized score between 0 and 1000:
   `final_normalized_score = MIN(1000, MAX(0, normalized_score))`
9. If `band_max = band_min`, assign a safe default normalized score of `0`.
For negative-priority metrics, either transform the metric so higher values mean higher priority, or reverse the normalized score:
`reversed_normalized_score = 1000 - normalized_score`
 
Expose all continuous-band normalization helper values (sorted unique values, gaps, continuous group IDs, group counts, group min, group max, selected band, `max_allowed_gap`) in the `normalization_helper` sheet.
 
---
 
### Recency Scoring
 
Recency must use actual dates, not text strings.
 
Calculate days since latest claim:
`days_since_latest_claim = today_date - latest_claim_date`
 
Preferred recency score formula (more recent HCPs receive higher scores):
`recency_score = MAX(0, 1000 * (1 - days_since_latest_claim / recency_window_days))`
 
Store `recency_window_days` in a visible helper cell.
 
---
 
### Categorical Scoring
 
Map categorical metrics to numeric priority scores before weighting using visible editable mapping tables.
 
**Specialty mapping example:**
 
| Specialty | Specialty Score |
|---|---:|
| Relevant specialist | 1000 |
| Adjacent specialist | 500 |
| Non-relevant specialty | 0 |
 
**Institution setting mapping example:**
 
| Institution Setting | Institution Score |
|---|---:|
| Academic community | 1000 |
| Non-academic community | 500 |
| Unknown | 0 |
 
**KOL flag mapping example:**
 
| KOL Flag | KOL Score |
|---|---:|
| Yes | 1000 |
| No | 0 |
 
Use explicit assumptions when the user has not supplied categorical mappings.
 
---
 
## Weights
 
Use user-defined weights when provided.
 
If the user provides only priority order, convert ranks into rank-decay weights:
`rank_weight_i = (n + 1 - priority_rank_i) / sum(n + 1 - priority_rank_all_metrics)`
 
Normalize effective weights so they always sum to 100%:
`effective_weight_i = user_weight_i / sum(user_weight_all_metrics_included)`
 
If no weights are provided and the user wants speed, assign equal weights across all included metrics and document the assumption.
 
Do not hardcode final weights unless the user explicitly provides them.
 
The weight table in `normalization_helper` must include:
 
- Metric name
- User-provided weight or priority rank
- Normalized effective weight
- Directionality
- Normalization method
- Selected `band_min` and `band_max` (if numeric, continuous-band)
- Notes or assumptions
---
 
## Composite Score Calculation
 
### Step 6 — Calculate Effective Weights
 
```excel
=IF(include_in_score="Yes",selected_weight/SUM(all_selected_weights),0)
```
 
### Step 7 — Calculate Composite Score
 
Calculate one weighted contribution per included metric:
```excel
=normalized_metric_score * effective_weight
```
 
Calculate composite score as the sum of weighted metric contributions:
```excel
=SUM(weighted_metric_contribution_columns)
```
 
**For branded market (0–1 normalized scale):**
Scale final priority score to 0–100:
```excel
=ROUND(composite_score * 100, 5)
```
 
**For rare disease and combined markets (0–1000 normalized scale):**
The final priority score is the composite score on the 0–1000 scale. If the user requests 0–100 output:
```excel
=ROUND(composite_score / 10, 5)
```
 
The final priority score must always be stored and displayed to exactly **5 decimal places**. All downstream references to the final priority score must consume the full 5-decimal-place value to preserve precision.
 
---
 
## Mandatory Cumulative-Score Stepwise Deciling
 
### Step 8 — Apply Deciling
 
Use cumulative-score stepwise deciling **only** unless the user explicitly requests a different method.
 
**Sorting before deciling:**
 
Before deciling, the final scored entity list must be sorted by `Final Priority Score` in descending order. The highest-priority entities appear first. Cumulative score and deciles are calculated after sorting.
 
**Do not use any other deciling method. Do not use:**
 
- Equal-count deciling
- Percentile deciling
- Rank-based deciling
- `ROUNDUP` deciling
- `ROUNDDOWN` deciling
- `PERCENTRANK` deciling
- `NTILE` deciling
- `QUARTILE` deciling
- Direct mathematical decile assignment
- Any formula that assigns decile without using prior-row decile logic
**The only allowed deciling logic:**
 
```excel
=IF(current_cumulative_score<=((11-prior_decile)*(total_priority_score/10)),prior_decile,prior_decile-1)
```
 
This logic must be implemented using structured references, named ranges, helper columns, or dynamically generated references.
 
**Original cell-reference example:**
```excel
=IF(AI15<=((11-AJ14)*($AO$3)),AJ14,AJ14-1)
```
 
Where:
- `AI15` = current row's cumulative score
- `AJ14` = previous row's decile
- `$AO$3` = total priority score divided by 10
For reusable workbook generation, do not hardcode the exact column letters or row numbers.
 
**Required deciling helper fields:**
 
| Helper Field | Purpose |
|---|---|
| Final Priority Score | Final score used for prioritization |
| Sort Order Helper | Ensures entities are sorted from highest to lowest priority score |
| Cumulative Score | Running cumulative sum of final priority score after sorting |
| Cumulative Final Priority Score % | Cumulative score divided by total priority score |
| Total Priority Score | Sum of all included entities' final priority scores |
| Decile Score Bucket | Total Priority Score / 10 |
| Prior Decile Helper | Previous row's assigned decile |
| Decile | Final assigned decile using the mandatory stepwise formula |
 
The **first scored row** must be seeded as **Decile 10**.
 
For every subsequent scored row:
```excel
=IF([@[Cumulative Score]]<=((11-[@[Prior Decile Helper]])*Decile_Score_Bucket),[@[Prior Decile Helper]],[@[Prior Decile Helper]]-1)
```
 
**Decile assignment table:**
 
| Cumulative Score Range | Decile |
|---|---|
| 0% to 10% of total priority score | 10 (D10) |
| 10% to 20% of total priority score | 9 (D9) |
| 20% to 30% of total priority score | 8 (D8) |
| 30% to 40% of total priority score | 7 (D7) |
| 40% to 50% of total priority score | 6 (D6) |
| 50% to 60% of total priority score | 5 (D5) |
| 60% to 70% of total priority score | 4 (D4) |
| 70% to 80% of total priority score | 3 (D3) |
| 80% to 90% of total priority score | 2 (D2) |
| 90% to 100% of total priority score | 1 (D1) |
 
Each decile represents approximately 10% of **total priority score**, not 10% of entity count.
 
The decile formula must remain stepwise and dependent on the previous row's decile.
 
---
 
## Tiering Logic
 
### Step 9 — Create Tiers
 
Create tiers from decile values or user-defined thresholds.
 
**Default tiering for branded market:**
 
| Tier | Deciles |
|---|---|
| Tier 1 | Decile 10 and Decile 9 |
| Tier 2 | Decile 8 and Decile 7 |
| Tier 3 | Decile 6, Decile 5, and Decile 4 |
| Monitor | Decile 3, Decile 2, and Decile 1 |
 
**Default tiering for rare disease market (small universe):**
 
| Tier | Deciles |
|---|---|
| Tier 1 | D8, D9, D10 |
| Tier 2 | D5, D6, D7 |
| Tier 3 | D1, D2, D3, D4 |
 
Tier thresholds must be stored in editable helper tables and must be formula-driven. Do not hardcode tier labels in a way that prevents user edits.
 
If the user provides custom tier cutoffs, use the custom cutoffs and document them.
 
---
 
## Inclusion and Exclusion Overrides
 
### Step 10 — Apply Inclusion and Exclusion Rules
 
Apply user-provided inclusion and exclusion rules after scoring unless the user explicitly requests exclusions before scoring.
 
Examples of possible exclusion rules:
 
- Missing entity ID
- Inactive HCP
- Non-target specialty
- Non-promotable account
- Restricted access
- Do-not-call flag
- Missing required metric
- Invalid specialty
- Duplicate record
- Compliance restriction
- User-defined suppression flag
Examples of possible inclusion overrides:
 
- Include strategic KOL regardless of score
- Include due to field input
- Include due to leadership priority
- Include due to known referral network influence
Exclusion logic must be visible and traceable. Excluded entities should remain visible in the workbook unless the user asks to remove them.
 
**Recommended final targeting status formula:**
```excel
=IF([@[Exclusion Override]]<>"","Exclude",IF([@[Inclusion Override]]<>"","Include",IF([@Tier]="Tier 1","Include",IF([@Tier]="Tier 2","Consider","Lower Priority"))))
```
 
---
 
## Recommended Action
 
### Step 11 — Generate Recommended Action
 
Generate recommended action using decile, tier, inclusion status, and available strategic fields.
 
| Condition | Recommended Action |
|---|---|
| Included and Tier 1 | High-priority field engagement |
| Included and Tier 2 | Maintain active engagement |
| Included and Tier 3 | Selective engagement |
| Included and Monitor | Monitor or low-touch engagement |
| Excluded | Do not deploy |
 
Recommended action logic must be formula-driven and configurable through helper tables where possible.
 
---
 
## Final Target List
 
### Step 12 — Build Final Target List
 
Create a CRM-ready final target list linked from `scoring_calculator`.
 
The final target list should include only fields available in the input or fields created transparently by the workbook.
 
Do not invent HCP names, specialties, geographies, accounts, affiliations, or CRM fields.
 
---
 
## Final Summary Dashboard
 
### Step 13 — Build Final Summary Dashboard
 
Create formula-driven summaries. At minimum include:
 
- Count by decile
- Count by tier
- Included vs excluded count
- Average score by decile
- Total score by decile
- Data-quality flag counts
- Metric contribution summary
- Recommended action summary
---
 
## Generic Workflow
 
### Step 1 — Confirm or Infer the Objective
 
Identify the targeting objective from the user's request.
 
Examples of possible objectives:
 
- Growth targeting
- Retention targeting
- Launch targeting
- Defense targeting
- Conversion targeting
- Whitespace targeting
- Access prioritization
- Account prioritization
- Rare disease patient opportunity
- KOL/influence prioritization
- Field deployment
- General prioritization
If the objective is missing, proceed with a generic field-prioritization objective and clearly document the assumption.
 
---
 
### Step 2 — Identify the Entity Level and Market Type
 
Determine the level of scoring (HCP, NPI, Account, Facility, Territory) and confirm the market type (branded, rare disease, or combined).
 
The entity ID must be present or created from available fields. If no reliable ID exists, flag the issue and create a temporary row-level ID only for workbook processing.
 
---
 
### Step 3 — Identify Candidate Metrics
 
Review available numeric, categorical, binary, and date fields.
 
Classify fields into roles such as:
 
- Volume, value, opportunity, adoption, recency, access, engagement, risk, influence, strategic fit, exclusion, or descriptive only
For rare disease and combined markets, additionally classify:
 
- Patient opportunity metrics (diagnosed patient count, treatment patient count, claims count)
- Influence metrics (clinical trials, publications, online presence, KOL)
- Strategic fit metrics (specialty, institution setting)
Do not assume a metric should be used only because it exists. Include a metric in scoring only when it is selected by the user, clearly relevant to the stated objective, or approved through documented assumptions.
 
---
 
### Step 4 — Build the Metric Mapping
 
Create the `metric_mapping` table before scoring.
 
For every candidate scoring metric, define all fields listed in the `metric_mapping` worksheet section above.
 
If directionality is unclear, ask the user. If the user wants speed, infer directionality based on objective and document the assumption.
 
---
 
### Step 5 — Normalize Metrics
 
Select the appropriate normalization method based on market type:
 
- **Branded market**: Standard min-max normalization (0–1 scale)
- **Rare disease or combined market**: Continuous-band min-max normalization (0–1000 scale)
Follow the normalization formulas and rules described in the Normalization section above.
 
All normalization settings must be visible and editable in `normalization_helper`.
 
---
 
## Formula Discipline
 
When producing formulas or workbook logic:
 
- Make every derived field formula-driven where possible.
- Avoid hardcoded scores except for user-approved mapping tables.
- Keep weights in a separate editable table.
- Make weights sum to 100%; if not, normalize effective weights.
- Keep directionality explicit: higher value must always mean higher priority after normalization.
- Provide both raw metric and normalized metric columns.
- Preserve separate components for patient opportunity, influence, branded opportunity, market size, brand behavior, recency, strategic fit, engagement, access, and override logic when those components exist in the data.
- Do not use fixed Excel column letters or fixed row numbers in reusable formulas.
- Use Excel tables, structured references, named ranges, helper tables, dynamic arrays, or generated references.
- Deciling must use the mandatory cumulative-score stepwise formula and no other formula unless explicitly requested by the user.
---
 
## Quality Checks Before Final Answer
 
Before finalizing any output, verify:
 
- [ ] Raw data has been preserved.
- [ ] Market type has been confirmed or documented as an assumption.
- [ ] Entity ID is present or a temporary row-level ID has been created and flagged.
- [ ] Duplicate IDs are flagged.
- [ ] Missing metrics are flagged.
- [ ] Invalid numeric values are flagged.
- [ ] Candidate metrics are mapped.
- [ ] Included scoring metrics are clearly identified.
- [ ] Metric directionality is explicit.
- [ ] Normalization method is appropriate for the market type.
- [ ] For rare disease and combined markets: continuous-band `band_min` and `band_max` are visible for every normalized numeric metric.
- [ ] For rare disease and combined markets: normalized scores are between 0 and 1000.
- [ ] For rare disease and combined markets: percentile, quantile, P90, P95, P99, or winsorization logic is not used unless explicitly requested.
- [ ] Weights are editable and effective weights sum to 100%.
- [ ] Composite score is formula-driven.
- [ ] Final priority score is formula-driven and rounded to 5 decimal places.
- [ ] Records are sorted from highest score to lowest score before cumulative deciling.
- [ ] Cumulative score is formula-driven.
- [ ] Cumulative final priority score percentage is formula-driven.
- [ ] Total priority score is formula-driven.
- [ ] Decile score bucket equals total priority score divided by 10.
- [ ] First scored row is seeded as Decile 10.
- [ ] Decile is assigned only using cumulative-score stepwise deciling.
- [ ] Equal-count, percentile, rank-based, and direct mathematical deciling formulas are not used.
- [ ] Tiering aligns to decile or user-defined thresholds.
- [ ] Inclusion and exclusion overrides are visible and traceable.
- [ ] Final targeting status is formula-driven.
- [ ] Primary and secondary score drivers are identified.
- [ ] Output is suitable for CRM or call-plan deployment.
- [ ] DQ comparison is included when a comparison file is provided.
- [ ] The workbook contains the 7 mandatory sheets.
---
 
## Response Style
 
When responding to the user:
 
- Think like a pharma commercial analytics consultant.
- Be practical, direct, and implementation-oriented.
- Prefer workbook-ready formulas and table structures over abstract methodology.
- Clearly state assumptions.
- Clearly distinguish user-provided inputs from inferred assumptions.
- Clearly identify the market type and apply the appropriate normalization and weighting logic.
- Do not overcomplicate unless the user requests advanced methodology.
- If the user asks for an Excel workbook, create the workbook rather than only explaining the method.
- If the user asks for methodology text only, provide a clean consultant-style methodology.
- If required information is missing but the user wants speed, proceed with documented assumptions.
- If required information is missing and affects correctness, ask the minimum necessary clarification.