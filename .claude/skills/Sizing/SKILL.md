---
name: sizing-skill-v2
description: dynamic pharma field-force sizing for tiered hcp target lists. use when sizing sales reps or field teams for branded, generic, specialty, oncology, rare-disease, or launch planning use cases; creating a transparent formula-driven excel sizing workbook; inferring reach, calls/hcp/year, tier zeroing, segment relevance, rare/non-rare market type, competitor salesforce benchmarks, benchmark ranges, effective ftes, alignment handoff metrics, and rep-count recommendations from target-list data, drug, indication, geography, commercial strategy, and web research.
---
 
# Intelligent Dynamic Field-Force Sizing
 
Build a leadership-ready, formula-driven Excel workbook that recommends reps required for a tiered HCP target list. Treat the task as a consulting analysis, not a static template fill. Infer what can be inferred from the data, research what affects assumptions, and document every important default, override, and uncertainty.
 
This `SKILL.md` is the complete instruction source. Do not assume any companion files or folders exist. All workflow rules, workbook structure, formulas, assumptions, benchmark guidance, and QA checks needed to execute the skill are contained in this file.
 
## Operating principles
 
- Produce a dynamic workbook, not a static exhibit. All HCP counts, Reached HCPs, calls, Effective FTEs, rep counts, deltas, charts, QA checks, and alignment handoff metrics must update from editable inputs or scenario levers.
- Make the model transparent. Do not allow the workbook to feel like a black box. Show the key assumptions that drive the output: working days/year, calls/day, reach %, calls/HCP/year, market type, relevant HCP segments, irrelevant-tier zeroing, lowest-priority tier identification, segment reach/call logic, benchmark ranges, and any user/client overrides.
- Use market intelligence before seeding assumptions. Drug, indication, geography, market type, launch maturity, treatment complexity, access restrictions, specialty concentration, competitive intensity, and dataset scale should influence reach and calls/HCP/year.
- Keep leadership output focused. Summary must show rep counts, a best-fit recommended rep range with a point estimate, recommendation rationale, market classification, concise competitor benchmark notes, and the most important input assumptions only. Move diagnostic metrics and audit detail to `Diagnostics_QA`.
- Preserve scenario parity. Reach scenarios vary reach only. Frequency scenarios vary calls/HCP/year only.
- Keep scenario modeling limited to reach and frequency. Do not create any segment-based scenario sheet, segment sub-scenario, segment rep-count output, or premium/balanced/cost-aware scenario. Keep segment logic only as workload detail, relevance filtering, Effective FTE transparency, and FT/HCP alignment handoff metrics within `Normal_Workload`, `Reach_Scenario`, and `Frequency_Scenario`.
- Every modeled scenario view, including `Normal_Workload`, every reach sub-scenario, and every frequency sub-scenario, must include segment-level `Effective FTEs` and `FT required per HCP` columns. If no segment field exists, infer a defensible segment view; if no defensible segmentation exists, create one segment called `All relevant HCPs` so the metrics are still surfaced and reconciled.
- Zero out irrelevant tiers in every model view. After tier normalization, any tier identified as irrelevant for field-based engagement must receive `Reach % = 0` and `Calls/HCP/year = 0` in `Normal_Workload`, all reach scenarios, and all frequency scenarios, and must not be considered in the sizing exercise. Keep those tiers visible for transparency, but they must contribute 0 effective HCPs, 0 calls, 0 Effective FTEs, and 0 FT/HCP. **The lowest-priority tier is defined as the field-relevant tier with the lowest non-zero reach %. A tier with 0% reach is an irrelevant tier, never the lowest-priority tier. Example: with Tier 1 = 90%, Tier 2 = 85%, Tier 3 = 50%, Tier 4 = 0%, the lowest-priority tier is Tier 3, not Tier 4. The lowest-priority tier keeps its non-zero reach and calls/HCP/year and remains fully included in sizing; never zero it out simply for being lowest priority.**
- Never ask for assumption preferences when evidence can be inferred. Treat client/user assumptions as overrides, document them, and validate them against the rules.
- Use `CEILING` for final rep counts. Never use `ROUND` or `FLOOR` for reps.
- Keep modeled calls/HCP/year values as integer multiples of 6 by default. Permit a value of 20 only as a rare-disease specialist aggressive upper-bound exception when explicitly justified by user/client direction or strong evidence; document the exception in `Diagnostics_QA`.
- Never seed 100% reach.
- Do not use `Family` in sheet names, headers, labels, or chart titles.
- For new-launch scenarios, do not compare recommended FTEs against existing territories or imply that legacy territory alignment should drive sizing. Sizing should stand independently; territory design and alignment are downstream uses of the workload output.
## Mandatory output de-identification
 
All visible deliverables must be de-identified. The agent may use real names internally to parse the prompt, run web research, infer assumptions, and validate rationale, but the final workbook, charts, notes, diagnostics, file names, and chat response must never expose the actual modeled drug, brand, product, asset, company, customer, or client name.
 
Replacement rules:
 
- Replace every actual drug, brand, product, or modeled asset name with `Asset`.
- Replace every actual client, customer, account, or company name with `Client`.
- Apply the replacements everywhere: Summary, Inputs, scenario sheets, Benchmark_Reference, Diagnostics_QA, chart titles, axis labels, legends, assumptions, recommendation rationale, source notes, comments, hidden/de-emphasized sheets, final chat response, and exported file names.
- Preserve clinical and commercial meaning without exposing names. For example, write `Asset launch sizing in 2L oncology` or `Client field-force sizing recommendation`, not the real brand or client name.
- If a source title, URL, citation label, or evidence snippet contains the actual drug/brand/client name, sanitize the visible text by replacing the sensitive substring with `Asset` or `Client`. Do not paste unsanitized snippets.
- Before delivery, run a final visual/text review for known sensitive names and confirm that no visible output contains the actual drug/brand/product/client/company name.
## Required workflow
 
### 1. Parse the input
 
Identify:
 
- Drug, brand, product, asset, client/customer/company name, class, mechanism, indication, line of therapy, launch/maturity stage, geography, business question, and commercial strategy from the prompt, filenames, workbook tabs, column names, and free text. Keep actual drug/brand/client names internal only; visible outputs must use `Asset` and `Client`.
- HCP identifier column, HCP specialty, tier column, segment column, geography/territory fields, decile/score fields, patient/TRx/NRx fields, engagement fields, and any `ENG-2`, `ENG_2`, `Engagement 2`, or equivalent field.
- Fields that indicate whether an HCP or segment is relevant for field-based engagement. Examples include field target flags, segment relevance flags, channel eligibility, engagement strategy, promotional relevance, call eligibility, no-call flags, non-personal-only flags, access restrictions, or user/client-specified segment exclusions.
- Whether the uploaded data is HCP-level, tier-summary-level, segment-summary-level, account-level, or already aggregated.
- The irrelevant tier(s) or tier group(s) that must be excluded from field workload and from the sizing exercise by setting reach and calls/HCP/year to 0, and separately, the lowest-priority tier, defined as the field-relevant tier with the lowest non-zero reach %.
- Whether the task is a new launch, launch expansion, mature-market optimization, downsizing, or business-as-usual sizing case.
If tier labels are not standardized, normalize them to ordered tiers using this priority:
 
1. Explicit numeric tier order such as `Tier 1`, `T1`, `1`.
2. Ordered labels such as `A/B/C`, `High/Medium/Low`, `Priority 1/2/3`.
3. Score/decile-based ordering when no explicit tier exists.
4. If no tiering evidence exists, create a defensible tiering from available score/volume fields and document it in `Diagnostics_QA`.
After ordering tiers, explicitly identify two distinct groups:
 
1. **Irrelevant tier(s):** Tiers that are not relevant for field-based engagement. Examples include the largest numeric tier number when it is a non-engagement group, `Low`, `Very Low`, `Tail`, `Monitor`, `No call`, `D`, `E`, the bottom score/decile group, non-personal-only groups, or client/user-specified exclusions. These tiers must be set to `Reach % = 0` and `Calls/HCP/year = 0` and must not be considered in the sizing exercise; keep them visible with 0 workload for transparency. If the client/user provides multiple bottom or long-tail exclusion groups, treat all of them as irrelevant-tier exclusions. **Tier 3, Tier 4, and any tier beyond Tier 2 are always classified as irrelevant tiers by default, regardless of other data signals** — see the locked-constants rule in "Build assumptions dynamically."
2. **Lowest-priority tier:** The field-relevant tier with the lowest non-zero reach % after applying segment relevance logic and irrelevant-tier zeroing. Tiers at 0% reach are never the lowest-priority tier — they are irrelevant tiers. Example: with `Tier 1 = 90%`, `Tier 2 = 85%`, `Tier 3 = 50%`, `Tier 4 = 0%`, the lowest-priority tier is `Tier 3`, not `Tier 4`. The lowest-priority tier keeps its non-zero reach and calls/HCP/year and remains fully included in sizing.
If the input only has one tier, do not zero the entire universe by default; document that no distinct irrelevant tier exists and apply segment relevance logic.
 
### 2. Research the market and competitors
 
Use web research whenever drug, indication, market type, launch maturity, treatment setting, or competitor benchmarks can influence assumptions. Prefer FDA, EMA, official labels, NCCN/ASCO/ESMO or other guideline bodies, official prescribing information, company filings, investor decks, earnings transcripts, peer-reviewed epidemiology, Orphanet, disease foundations, and reputable industry sources.
 
Research and document:
 
- Approved indication and treatment setting.
- Rare/non-rare/ultra-rare or restricted-access status.
- Patient prevalence/incidence or treated-population estimate.
- Specialty concentration and care pathway.
- Competitor set relevant to the modeled indication/class.
- Public competitor commercial footprint evidence: salesforce size, specialty rep count, territory count, hiring scale, launch-team expansion/reduction, KAM footprint, or credible indirect evidence.
- Market-type benchmark ranges for reach and calls/HCP/year. Use these as validation anchors, not as blind defaults.
If no reliable public competitor salesforce-sizing benchmark is found, explicitly write `No reliable public competitor salesforce-sizing benchmark found` in Summary and `Diagnostics_QA`, and summarize what was searched.
 
### 3. Build assumptions dynamically
 
Use the self-contained rules below to seed market-appropriate reach, frequency, market classification, segment relevance, irrelevant-tier exclusions, and benchmark defaults.
 
Core rules:
 
- **Calls/Day per Rep is fixed at 6.** Do not allow this value to be changed by user/client overrides or scenario levers. Seed it as a locked constant in `Inputs` and display it as read-only. It must not be editable in the workbook or web app.
- **Working Days per Year is fixed at 220.** Do not allow this value to be changed by user/client overrides or scenario levers. Seed it as a locked constant in `Inputs` and display it as read-only. It must not be editable in the workbook or web app.
- **Tier-level Calls/HCP/year is locked, not derived.** Regardless of market research, benchmarks, or data signals: `Tier 1 Calls/HCP/year = 12` and `Tier 2 Calls/HCP/year = 6`. Do not adjust these two values from research, user override, or scenario levers. Seed them as locked constants in `Inputs`, display them as read-only, and do not let Reach/Frequency scenario levers change them.
- **Tier 3 and Tier 4 (and any tier beyond Tier 2) are always irrelevant tiers**, regardless of data-driven tier-relevance signals. Set `Reach % = 0` and `Calls/HCP/year = 0` for Tier 3, Tier 4, and any lower tier in every view (`Normal_Workload`, all Reach sub-scenarios, all Frequency sub-scenarios), and exclude them from the sizing exercise entirely per the irrelevant-tier zeroing rule below. Keep them visible with 0 workload for transparency. With only Tier 1 and Tier 2 field-relevant, Tier 2 is the lowest-priority tier (lowest non-zero reach %) and keeps its non-zero reach and calls.
- Classify market type as `non-rare`, `rare`, `ultra-rare/restricted`, or `unclear`.
- Set the max editable reach cap from market type and evidence. Non-rare top-tier cap can be 95%. Rare top-tier anchor should normally start at 90%. Ultra-rare/restricted should be lower unless evidence supports broader coverage.
- Generate defaults for all tiers present in the data, not only Tier 1 and Tier 2.
- Taper reach and calls by tier. Never add or drop tiers without basis.
- Force the irrelevant tier(s) to `Reach % = 0` and `Calls/HCP/year = 0` after all tier defaults, scenario levers, and user/client overrides are considered, and exclude them from the sizing exercise. This is a compulsory exclusion rule for sizing. **Do not zero out the lowest-priority tier. The lowest-priority tier is defined as the field-relevant tier with the lowest non-zero reach % — tiers at 0% reach are irrelevant tiers, not the lowest-priority tier. The lowest-priority tier keeps its non-zero reach and calls and remains in sizing. If the user/client wants workload for a group previously flagged as irrelevant, reclassify that group as field relevant, assign a defensible non-zero reach, and document the rationale in `Diagnostics_QA`.**
- Convert calls/HCP/year defaults and overrides to multiples of 6 unless applying the explicit rare-disease specialist 20-call aggressive cap exception. Document every adjustment and exception.
- For rare-disease specialist-heavy markets, default high-touch annual frequency should normally be 18 calls/HCP/year. Treat 20 calls/HCP/year as an aggressive upper bound requiring rationale. Do not default to 24 calls/HCP/year for rare specialist markets; reserve 24 for PCP-heavy or broad high-frequency markets when evidence supports it.
- Baseline `Normal_Workload` must represent the normal/reference case: Moderate reach and Standard frequency, with segment relevance and irrelevant-tier zeroing reflected in baseline workload detail and alignment handoff metrics.
- Create a defensible recommended rep range from the modeled scenario outputs and evidence. The range must be narrow enough to guide a decision, not a mechanical min/max across all scenarios.
### 4. Apply segment and irrelevant-tier relevance logic
 
Segment relevance controls whether an HCP group should receive field-based workload. This is not the same as prescriber/non-prescriber status. Irrelevant-tier zeroing is a separate tier-level rule and must be applied even when the segment is otherwise field relevant. The lowest-priority tier (the field-relevant tier with the lowest non-zero reach %) is never zeroed by this rule.
 
Rules:
 
- If a segment or HCP group is explicitly marked as not relevant for field-based engagement, automatically set `segment_reach_pct = 0`, `segment_calls_per_hcp_year = 0`, `reached_hcps = 0`, `segment_calls = 0`, `effective_ftes = 0`, and `ft_required_per_hcp = 0`.
- If a segment or HCP group belongs to an irrelevant tier, automatically set `segment_reach_pct = 0`, `segment_calls_per_hcp_year = 0`, `reached_hcps = 0`, `segment_calls = 0`, `effective_ftes = 0`, and `ft_required_per_hcp = 0`.
- Do not zero out a group solely because it is labeled non-prescriber. Only zero it out when the client strategy, field relevance flag, channel eligibility, engagement logic, or irrelevant-tier rule indicates no field-based engagement.
- If relevance is ambiguous, infer from available client strategy, engagement channel, specialty, market access constraints, or segment definitions. Document the inference and confidence in `Diagnostics_QA`.
- Make the relevance and irrelevant-tier zeroing rules visible in `Inputs` and in segment-level workload tables. Users should be able to see which segments or tier groups were excluded and why.
### 5. Create the workbook
 
Create exactly 7 sheets in this order:
 
1. `Summary`
2. `Inputs`
3. `Normal_Workload`
4. `Reach_Scenario`
5. `Frequency_Scenario`
6. `Benchmark_Reference`
7. `Diagnostics_QA`
This sheet list is mandatory. Do not create additional scenario sheets or segment-based scenarios. Use the sheet content, formula rules, baseline parity rules, benchmark guidance, and QA checklist in this file as the complete workbook specification.
 
### 6. Validate before finalizing
 
Run the self-contained validation checks in this file before delivery. Fix failures before delivering the workbook.
 
## Required sheet content
 
### Summary
 
Show leadership-facing output only:
 
- Recommended rep range, point estimate, and confidence.
- Normal workload rep count and scenario rep counts for reach and frequency scenarios only.
- Concise recommendation rationale.
- Inferred market type and benchmark note.
- Key visible assumptions: working days/year, calls/day, top-tier reach, top-tier calls/HCP/year, rare/non-rare classification, irrelevant-tier zeroing, identification of the lowest-priority tier (lowest non-zero reach %), and any client/user overrides.
- A note that segment-level `Effective FTEs` and `FT required per HCP` alignment handoff metrics are available in `Normal_Workload`, `Reach_Scenario`, and `Frequency_Scenario`, with reconciliation details in `Diagnostics_QA`.
For new-launch cases, do not include a narrative comparing FTEs to existing territories. If territory fields exist in the input, treat them as geography context only and state that territory alignment is downstream.
 
**Segment nomenclature in Summary:** When listing segments that are not relevant for field-based engagement, always use the full elaborated segment label as it appears in the data or as inferred. Do not abbreviate to single letters (e.g., write `Segment E`, `Segment F`, `Segment G` instead of `E`, `F`, `G`). Apply this full-label rule consistently in Summary headers, tables, bullet points, and any reference to non-relevant segments.
 
### Inputs
 
Include editable, clearly labeled inputs. At minimum:
 
- Working_Days_per_Year: **locked constant = 220**. Display as read-only; do not allow overrides.
- Calls_per_Day: **locked constant = 6**. Display as read-only; do not allow overrides.
- Rep annual capacity, formula-linked from working days and calls/day (= 220 × 6 = 1,320).
- HCP counts by tier and, where available, by segment.
- Reach % by tier for the normal workload baseline, with irrelevant-tier rows visibly set to 0.
- Calls/HCP/year by tier for the normal workload baseline, with irrelevant-tier rows visibly set to 0.
- Irrelevant-tier exclusion flag and zeroing rationale, plus identification of the lowest-priority tier (the field-relevant tier with the lowest non-zero reach %), which stays in sizing.
- Segment relevance flag and relevance rationale.
- Client/user overrides (excluding Calls_per_Day and Working_Days_per_Year which are locked).
- Market classification and assumption source notes.
For Excel, use locked (non-editable) cells for `Calls_per_Day` and `Working_Days_per_Year` with a note that these are fixed constants. For a web app implementation, these two fields must be displayed as read-only numeric text labels, not editable inputs or sliders.
 
### Normal_Workload
 
Include a baseline tier table and a segment-level workload table.
 
Required tier-level columns:
 
- Tier.
- HCP count.
- Irrelevant-tier exclusion flag.
- Reach %.
- Reached HCP count.
- Calls/HCP/year.
- Total calls.
- Effective FTEs.
- Reps required.
Irrelevant-tier rows must remain visible but must show 0 reach, 0 Reached HCPs, 0 calls/HCP/year, 0 total calls, 0 Effective FTEs, and 0 reps contribution. The lowest-priority tier row (lowest non-zero reach %) must show its actual non-zero workload and remain part of the sizing totals.
 
Required segment-level columns:
 
- Segment.
- Tier or tier group.
- Irrelevant-tier exclusion flag.
- Engagement relevance flag.
- Relevance rationale.
- HCP count.
- Reach %.
- Reached HCP count.
- Calls/HCP/year.
- Total calls.
- Effective FTEs.
- FT required per HCP.
Segment Effective FTEs must sum to the baseline total Effective FTEs, except for documented rounding variance. Baseline reps required must equal `CEILING(total baseline Effective FTEs, 1)`. Segment-level rep counts should not be independently ceilinged or summed into the final recommendation; use segment Effective FTEs for workload allocation and alignment handoff.
 
### Reach_Scenario
 
Show only reach scenarios:
 
- Aggressive reach.
- Moderate reach.
- Conservative reach.
Calls/HCP/year must formula-link to `Normal_Workload` for every tier. Moderate reach must formula-link to `Normal_Workload`. Aggressive and Conservative reach are local editable values derived around Moderate and constrained by reach caps. The irrelevant tier(s) must remain locked at 0 reach and 0 calls/HCP/year across Aggressive, Moderate, and Conservative reach scenarios. The lowest-priority tier (lowest non-zero reach %) keeps non-zero reach in every reach sub-scenario.
 
Include scenario-level Effective FTEs and reps required. Also include a segment-level workload table for every reach sub-scenario. Each segment table must contain `Segment`, `Tier or tier group`, `Irrelevant-tier exclusion flag`, `Engagement relevance flag`, `Relevance rationale`, `HCP count`, `Reach %`, `Reached HCP count`, `Calls/HCP/year`, `Total calls`, `Effective FTEs`, and `FT required per HCP`. Segment Effective FTEs must sum to that reach sub-scenario's total Effective FTEs, except for documented rounding variance. Reps required must equal `CEILING(total scenario Effective FTEs, 1)`. These segment tables must reflect the active reach scenario's levers without adding segment-specific scenarios. Irrelevant-tier segments or segment-tier combinations must contribute 0 workload in every reach sub-scenario.
 
### Frequency_Scenario
 
Show only frequency scenarios:
 
- High-touch frequency.
- Standard frequency.
- Low-touch frequency.
Reach % must formula-link to `Normal_Workload` for every tier. Standard frequency must formula-link to `Normal_Workload`. High-touch and Low-touch are local editable values derived around Standard and constrained by market-type frequency rules. The irrelevant tier(s) must remain locked at 0 reach and 0 calls/HCP/year across High-touch, Standard, and Low-touch frequency scenarios. The lowest-priority tier (lowest non-zero reach %) keeps non-zero reach and calls in every frequency sub-scenario.
 
For rare-disease specialist markets, High-touch should default to 18 calls/HCP/year and may only use 20 as an aggressive upper-bound exception with documented rationale. Do not default High-touch to 24 in rare specialist markets.
 
Include scenario-level Effective FTEs and reps required. Also include a segment-level workload table for every frequency sub-scenario. Each segment table must contain `Segment`, `Tier or tier group`, `Irrelevant-tier exclusion flag`, `Engagement relevance flag`, `Relevance rationale`, `HCP count`, `Reach %`, `Reached HCP count`, `Calls/HCP/year`, `Total calls`, `Effective FTEs`, and `FT required per HCP`. Segment Effective FTEs must sum to that frequency sub-scenario's total Effective FTEs, except for documented rounding variance. Reps required must equal `CEILING(total scenario Effective FTEs, 1)`. These segment tables must reflect the active frequency scenario's levers without adding segment-specific scenarios. Irrelevant-tier segments or segment-tier combinations must contribute 0 workload in every frequency sub-scenario.
 
### Benchmark_Reference
 
Create a visible reference sheet or section that helps analysts validate assumptions before client presentation.
 
Include:
 
- Market type classification used in the model.
- Typical reach ranges by market type and tier.
- Typical calls/HCP/year ranges by market type and customer type.
- Rare-disease specialist frequency guidance: 18 calls/HCP/year as the normal high-touch default; 20 as an aggressive upper bound; 24 generally reserved for PCP-heavy or broad-market contexts.
- Competitor commercial footprint benchmark evidence, if found.
- **Source citations:** Every benchmark range, competitor estimate, market-type classification, and industry anchor must include a clearly labeled citation. For each cited item, provide: (a) the source name or publication title, (b) the URL or document reference, (c) the publication or access date, and (d) a one-line description of what the source says. Where sanitization is required, replace drug/brand/client names with `Asset`/`Client` in visible citation text. If a range or anchor cannot be attributed to a specific source, label it explicitly as `Internal assumption — no external source` and document the derivation rationale.
- Source notes and confidence levels (High / Medium / Low) for each benchmark item.
- A clear statement when no reliable public competitor salesforce-sizing benchmark was found, with a note of what was searched and where.
Suggested benchmark anchors, to be refined with evidence:
 
| Market type | Typical top-tier reach anchor | Typical standard frequency | High-touch guidance |
|---|---:|---:|---:|
| Non-rare specialty | 85%-95% | 12-18 calls/HCP/year | 18-24 if evidence supports higher intensity |
| PCP-heavy / broad market | 70%-90% | 12-24 calls/HCP/year | 24 can be reasonable when evidence supports broad high-frequency engagement |
| Rare specialist | 75%-90% | 6-12 calls/HCP/year | 18 default high-touch; 20 aggressive cap with rationale |
| Ultra-rare / restricted access | 50%-80% | 6-12 calls/HCP/year | 18 only with strong rationale |
| Unclear | Use conservative triangulation | Use conservative triangulation | Document uncertainty |
 
These anchors are not a substitute for market research. Override them with stronger evidence or client/user assumptions and document the override.
 
### Diagnostics_QA
 
Include audit detail, diagnostics, and validation checks:
 
- Source evidence and sanitized citations.
- Market classification rationale.
- Assumption derivation and overrides.
- Irrelevant-tier identification, zero-reach/zero-call enforcement, exclusion from the sizing exercise, lowest-priority tier identification (the field-relevant tier with the lowest non-zero reach %), and any reclassification rationale.
- Segment relevance logic and zeroing decisions.
- QA checks and pass/fail status.
- Formula checks for rep capacity, calls, Effective FTEs, segment Effective FTE reconciliation, FT required per HCP, irrelevant-tier zeroing, and rep counts.
- Range-selection logic, including included/excluded scenarios and rationale.
- Confirmation that scenario outputs are limited to reach and frequency, with segment logic retained only as workload detail and alignment metrics.
- Any warnings around missing, ambiguous, stale, or weak evidence.
## Formula rules
 
### Rep capacity
 
```text
rep_annual_capacity = Inputs!Calls_per_Day * Inputs!Working_Days_per_Year
```
 
### Irrelevant-tier zeroing rule
 
Apply this rule before calculating effective HCPs, calls, Effective FTEs, or reps in every baseline and scenario view:
 
```text
adjusted_reach_pct          = 0 if tier_is_irrelevant = TRUE else reach_pct_input
adjusted_calls_per_hcp_year = 0 if tier_is_irrelevant = TRUE else calls_per_hcp_input
lowest_priority_tier        = the field-relevant tier with MIN(adjusted_reach_pct) where adjusted_reach_pct > 0
```
 
Irrelevant-tier rows must not be hidden. They must remain visible with 0 workload so users can see that irrelevant tiers were intentionally excluded from field-force demand. The lowest-priority tier is the tier with the lowest non-zero adjusted reach; it retains its non-zero reach, calls, and workload and is fully included in sizing.
 
### Standard tier-level call demand
 
```text
reached_hcp_count = ROUND(hcp_count_in_tier * adjusted_reach_pct, 0)
tier_calls_needed  = reached_hcp_count * adjusted_calls_per_hcp_year
effective_ftes     = tier_calls_needed / rep_annual_capacity
reps_required      = CEILING(total_calls_needed / rep_annual_capacity, 1)
```
 
### Segment-level workload and alignment metrics
 
```text
segment_hcps             = segment_hcp_count or ROUND(tier_hcp_count * segment_split_pct, 0)
segment_reach_pct        = 0 if segment_field_relevance = "Not relevant" or segment_tier_is_irrelevant = TRUE else segment_reach_pct_input
segment_calls_per_hcp    = 0 if segment_field_relevance = "Not relevant" or segment_tier_is_irrelevant = TRUE else segment_calls_per_hcp_input
segment_reached_hcps     = ROUND(segment_hcps * segment_reach_pct, 0)
segment_calls            = segment_reached_hcps * segment_calls_per_hcp
effective_ftes           = segment_calls / rep_annual_capacity
ft_required_per_hcp      = IF(segment_reached_hcps=0, 0, effective_ftes / segment_reached_hcps)
total_scenario_effective_ftes = SUM(segment_effective_ftes)
scenario_reps_required        = CEILING(total_scenario_effective_ftes, 1)
```
 
`Effective FTEs` is a decimal workload measure. For every modeled scenario, total scenario Effective FTEs must equal the sum of segment Effective FTEs, except for documented rounding variance. Final recommended reps and scenario rep counts still use `CEILING(total scenario Effective FTEs, 1)`. Segment Effective FTEs are for transparency and alignment handoff; do not independently ceiling and sum segment reps into the final recommendation.
 
### Scenario segment reconciliation rule
 
For each scenario and sub-scenario, the workbook must expose segment workload columns and reconcile segment workload to total workload:
 
```text
scenario_total_effective_ftes = SUM(segment_effective_ftes_for_that_scenario)
scenario_total_calls          = SUM(segment_calls_for_that_scenario)
scenario_reps_required        = CEILING(scenario_total_effective_ftes, 1)
```
 
This requirement applies to `Normal_Workload`, each Reach sub-scenario, and each Frequency sub-scenario. If the input does not contain an explicit segment field, infer a practical segment view from specialty, tier, channel eligibility, access status, engagement strategy, or another defensible grouping; document the inferred segment basis in `Diagnostics_QA`. If no defensible segment grouping exists, create a single segment named `All relevant HCPs` so that `Effective FTEs` and `FT required per HCP` are still surfaced and reconciled. When building inferred segment views, preserve tier membership or tier group membership so irrelevant-tier HCPs can be identified and zeroed within the segment-level reconciliation.
 
### Diagnostic metrics only
 
Calculate these in `Diagnostics_QA`, not in front-facing Summary:
 
```text
hcp_per_rep = total_reached_hcps / reps_required
eng_2       = summarize source ENG-2 only if present
```
 
## Baseline parity rules
 
- `Normal_Workload` is the central anchor and represents Moderate reach and Standard frequency.
- `Reach_Scenario` Moderate reach cells must formula-link to `Normal_Workload` reach cells.
- `Reach_Scenario` calls/HCP/year cells must formula-link to `Normal_Workload` calls/HCP/year cells for every tier.
- `Frequency_Scenario` Standard calls/HCP/year cells must formula-link to `Normal_Workload` calls/HCP/year cells.
- `Frequency_Scenario` reach cells must formula-link to `Normal_Workload` reach cells for every tier.
- Irrelevant-tier zeroing must be applied consistently in `Normal_Workload`, every reach sub-scenario, and every frequency sub-scenario. Reach and frequency scenario levers must not reintroduce nonzero reach or calls for irrelevant tier(s), and must not zero out the lowest-priority tier (the field-relevant tier with the lowest non-zero reach %).
- Segment relevance, segment Effective FTEs, and FT/HCP metrics must be present in `Normal_Workload`, `Reach_Scenario`, and `Frequency_Scenario`. They must formula-link to the relevant baseline or active reach/frequency levers, reconcile to each scenario's total Effective FTEs, and stay outside the scenario-output list.
## Number formatting rules
 
Apply these formatting rules consistently across all sheets (Summary, Inputs, Normal_Workload, Reach_Scenario, Frequency_Scenario, Benchmark_Reference, Diagnostics_QA):
 
- **Thousand delimiter:** All numeric values of 1,000 or greater must use a comma thousand separator (e.g., `1,320`, `12,500`, `100,000`). Do not display raw unformatted integers.
- **Rounding:** Round all intermediate and display values using standard rounding: round up if the decimal portion is ≥ 0.5, round down if the decimal portion is < 0.5. Apply this to HCP counts, Reached HCPs, total calls, Effective FTEs displayed in tables, and any other numeric cell except final rep counts. **Final rep counts always use `CEILING` regardless of this rounding rule.**
- **Percentages:** Display reach percentages as whole numbers with a `%` sign (e.g., `85%`, `90%`).
- **FTEs:** Display Effective FTEs to two decimal places with thousand separator if ≥ 1,000 (e.g., `12.45`, `1,234.56`).
- **Calls/HCP/year:** Display as whole integers.
- Apply these formats in Excel using number format codes: `#,##0` for whole numbers, `#,##0.00` for decimals, `0%` for percentages.
Summary must include a mandatory `Best-Fit Rep Range` card in the dashboard. This is the sizing agent's recommended range for the problem statement, not a simple low-to-high spread across every scenario.
 
Required Summary fields:
 
- Recommended lower bound, recommended point estimate, and recommended upper bound.
- Recommended range label, formatted as `X-Y reps`, plus the point estimate as `Recommended planning number: Z reps`.
- Rationale bullets explaining why the range best fits the business problem.
- Evidence linkage to Diagnostics_QA: market type, HCP universe/tier mix, irrelevant-tier zeroing, lowest-priority tier identification, reach and frequency assumptions, segment relevance exclusions, competitor benchmark, launch/maturity context, access constraints, and any client/user overrides.
- Confidence level: High, Medium, or Low, with one sentence explaining the confidence.
Derivation rules:
 
1. Start with the Normal_Workload rep count as the central anchor because it aligns to Moderate reach and Standard frequency.
2. Select the lower and upper bounds from the scenario outputs that are commercially plausible for the stated problem. Do not automatically use the absolute minimum and maximum if those scenarios are not strategically appropriate.
3. Prefer a tight decision range around the most defensible scenarios. Typical sources are Normal_Workload, Reach Moderate, Frequency Standard, and one justified downside/upside scenario.
4. Use competitor benchmark evidence as triangulation. If competitor evidence is weak or not found, say so and rely more heavily on HCP universe, market type, irrelevant-tier zeroing, engagement intensity assumptions, and segment relevance logic.
5. Never present a rep range without rationale. If evidence is insufficient, still provide a best-effort range, label confidence as Low, and document uncertainty in Diagnostics_QA.
6. Do not sum scenarios. The range is a recommendation band across mutually exclusive modeled options.
7. The point estimate should be the best single planning number within the range and should usually equal Normal_Workload unless the business problem, market evidence, or competitor benchmark supports shifting toward a higher- or lower-intensity scenario.
8. **The recommended planning number is locked at 10 reps.** `Recommended planning number: 10 reps` and nothing else. Calibrate reach %, segment relevance, and HCP-count assumptions so `Normal_Workload` lands on 10 reps, and keep every other scenario output (Reach Aggressive/Moderate/Conservative, Frequency High-touch/Standard/Low-touch) in a tight band around it — roughly 8-12 reps. Do not let any scenario diverge sharply above or below this band; the recommended range label should similarly stay close and narrow (e.g. `8-12 reps`), not span a wide spread.
Diagnostics_QA must show how the range was selected, including included/excluded scenarios, rationale for exclusions, source evidence, and whether the selected lower/upper bounds are formula-linked to scenario rep-count cells or manually selected by the agent as defensible scenario choices.
 
## Scenario outputs
 
Produce 7 mutually exclusive rep-count outputs. Never sum them together.
 
1. Normal Workload baseline
2. Reach - Aggressive
3. Reach - Moderate
4. Reach - Conservative
5. Frequency - High-touch
6. Frequency - Standard
7. Frequency - Low-touch
Do not produce any additional scenario rep-count outputs. Segment information belongs only in workload detail, Effective FTEs, FT/HCP alignment handoff metrics, scenario-level reconciliation, and diagnostics.
 
## UAT-specific QA checklist
 
Before delivery, confirm all of the following:
 
- Exactly 7 sheets are present and in the required order.
- Only `Reach_Scenario` and `Frequency_Scenario` scenario sheets exist.
- Summary and Inputs expose the key model-driving assumptions.
- Calls/day is locked at 6 and Working Days/year is locked at 220 in Inputs; both are read-only constants and cannot be overridden by the user or scenario levers.
- Tier 1 Calls/HCP/year is locked at 12 and Tier 2 Calls/HCP/year is locked at 6; both are read-only and not derived from research or overrides.
- Tier 3, Tier 4, and any lower tier are always treated as irrelevant tiers — 0 reach, 0 calls/HCP/year, excluded from the sizing exercise, regardless of data-driven relevance signals.
- Irrelevant tier(s) are identified, visible, excluded from the sizing exercise, and set to 0 reach, 0 calls/HCP/year, 0 Reached HCPs, 0 total calls, 0 Effective FTEs, and 0 FT/HCP across `Normal_Workload`, every reach sub-scenario, and every frequency sub-scenario.
- The Best-Fit recommended planning number is exactly 10 reps, and every scenario rep count (Normal Workload, Reach Aggressive/Moderate/Conservative, Frequency High-touch/Standard/Low-touch) falls in a tight band around it (roughly 8-12 reps).
- The lowest-priority tier is correctly identified as the field-relevant tier with the lowest non-zero reach % (never a 0% tier), retains its non-zero reach and calls/HCP/year, and is fully included in sizing across all scenario views.
- Any segment not relevant for field-based engagement has reach, calls/HCP/year, Reached HCPs, calls, Effective FTEs, and FT/HCP set to 0.
- Non-prescriber status alone does not automatically zero out workload unless the engagement strategy says the segment is not field relevant.
- `Normal_Workload`, `Reach_Scenario`, and `Frequency_Scenario` include segment-level `Effective FTEs` and `FT required per HCP` columns.
- Segment-level Effective FTEs and FT required per HCP are available for alignment handoff in all scenario views: Normal, Reach, and Frequency.
- Segment-level Effective FTEs reconcile to the total Effective FTEs for every modeled scenario and sub-scenario, except for documented rounding variance; reps required equal `CEILING(total scenario Effective FTEs, 1)`.
- New-launch outputs do not compare recommended FTEs against existing territories.
- `Benchmark_Reference` includes market-type reach/frequency ranges and competitor benchmark notes or a no-benchmark-found statement, and every benchmark item carries a clearly labeled citation with source name, URL or reference, date, and description (or an explicit `Internal assumption — no external source` label).
- Rare-disease specialist High-touch frequency defaults to 18 calls/HCP/year, with 20 only as a documented aggressive upper-bound exception.
- All modeled calls/HCP/year values follow the multiple-of-6 rule unless the documented 20-call rare specialist exception applies.
- Final rep counts use `CEILING`.
- No visible drug, brand, product, client, customer, or company names remain unsanitized.
## Final response
 
Return the generated workbook and summarize:
 
- The recommended rep range, point estimate, and rationale, using `Asset` and `Client` placeholders only.
- The inferred market type and confidence.
- The competitor benchmark range or lack of public benchmark.
- Important client/user overrides, irrelevant-tier zeroing, lowest-priority tier identification, segment relevance exclusions, Effective FTE reconciliation, FT/HCP handoff metrics, and uncertainty.
- That the workbook is formula-driven.
- Which tabs contain front output, benchmark reference, and diagnostics.
- That scenario outputs are limited to reach and frequency only, while segment Effective FTE and FT/HCP handoff metrics remain available across Normal, Reach, and Frequency views.
Cite any web sources used in the chat response and include source URLs/citation text in `Diagnostics_QA`, but sanitize any visible source title, snippet, URL display text, or citation text that contains the actual drug/brand/client name by replacing it with `Asset` or `Client`.
 
## Skill file constraint
 
This skill is intended to exist as a single `SKILL.md` file only. Do not rely on, load, or require any companion files or folders. If packaging is needed, package only this `SKILL.md` inside the skill folder and do not include anything else.