---
name: sizing-skill
description: dynamic pharma field-force sizing for tiered hcp target lists. use when sizing sales reps or field teams for branded, generic, specialty, oncology, rare-disease, or launch planning use cases; inferring reach, calls/hcp/year, segment splits, rare/non-rare market type, competitor salesforce benchmarks, and rep-count recommendations from target-list data, drug, indication, geography, commercial strategy, and web research. delivers findings as a structured consultancy briefing in chat — no excel output.
---

# Intelligent Dynamic Field-Force Sizing

Deliver a leadership-ready consultancy briefing that recommends reps required for a tiered HCP target list. Treat the task as a consulting analysis, not a template fill. Infer what can be inferred from the data, research what affects assumptions, and document every important default, override, and uncertainty.

## Operating principles

- Deliver a dynamic, evidence-based analysis — not a static exhibit. Every HCP count, effective reach, call load, and rep count must be derived from visible, auditable arithmetic.
- Use market intelligence before seeding assumptions. Drug, indication, geography, market type, launch maturity, treatment complexity, access restrictions, specialty concentration, competitive intensity, and dataset scale should all influence reach and calls/HCP/year.
- Keep output leadership-focused. Lead with the rep count recommendation, Best-Fit range, recommendation rationale, market classification, and concise competitor benchmark notes. Diagnostics and derivations follow the headline.
- Preserve scenario parity. Reach scenarios vary reach only. Frequency scenarios vary calls/HCP/year only. Segment scenarios vary segment split only.
- Never ask for assumption preferences when evidence can be inferred. Treat user-supplied values as overrides, document them, and validate them against the rules.
- Use CEILING for rep counts. Never use ROUND or FLOOR.
- Keep every calls/HCP/year value as an integer multiple of 6.
- Never assume 100% reach.

## Mandatory output de-identification

All visible outputs must be de-identified. The skill may use real names internally for research and assumption derivation, but every output the user sees must replace sensitive names:

- Replace every drug, brand, product, or asset name with `Asset`
- Replace every client, customer, account, or company name with `Client`
- Apply replacements everywhere: analysis sections, recommendation narrative, benchmark citations, source notes, and the chat response itself
- If a web source title or snippet contains the actual drug or company name, sanitize the visible text before quoting

Before delivery, confirm no visible output contains the actual drug, brand, or company name.

---

## Required workflow

### 1. Parse the input

Identify from the HCP file, prompt, and any available context:

- Drug, brand, indication, line of therapy, launch/maturity stage, geography, and commercial strategy. Keep actual names internal only — use `Asset` and `Client` in outputs.
- HCP identifier column, specialty, tier column, geography/territory fields, decile/score fields, and any Rx/TRx/NRx/patient volume fields.
- Whether the data is HCP-level, tier-summary-level, or already aggregated.

If tier labels are not standardized, normalize to ordered tiers using this priority:
1. Explicit numeric order: Tier 1, T1, 1
2. Ordered labels: A/B/C, High/Medium/Low, Priority 1/2/3
3. Score/decile-based ordering when no explicit tier label exists
4. If no tiering evidence: create a defensible tiering from available score/volume fields and document it

**EDA to present before sizing:**

Present a **Data Overview** covering:
- Tiers present and HCP count per tier; T1:T2 ratio
- Top 10 states by HCP count and combined share of universe
- Data completeness for key fields (% non-null: HCP ID, State, Tier, score/priority)
- Pareto check: what % of HCPs account for the top 50% of activity or score?
- Outlier flag: does any single HCP represent >5% of total volume?

### 2. Research the market and competitors

Use web research whenever drug, indication, market type, launch maturity, treatment setting, or competitor benchmarks can influence assumptions. Prefer FDA labels, company filings, investor/earnings transcripts, disease foundation data, Orphanet, NCCN/ASCO/ESMO guidelines, and reputable industry sources.

Research and document:
- Approved indication and treatment setting
- Rare/non-rare/ultra-rare status and patient prevalence estimate
- Specialty concentration and care pathway
- Competitor commercial footprint: salesforce size, specialty rep count, territory count, launch-team scale, or credible indirect evidence

If no reliable public competitor salesforce benchmark is found, write `No reliable public competitor salesforce-sizing benchmark found` in the output and summarize what was searched.

### 3. Build assumptions dynamically

Classify market type as `non-rare`, `rare`, `ultra-rare/restricted`, or `unclear`.

Seed market-appropriate defaults for:

**Working days per year** — derive from 260 base days minus standard pharma deductions (holidays, PTO, NSM, POA, admin). Show full arithmetic. Benchmark: 220–250 specialty pharma.

**Calls per day** — calibrate to market type and competitive position:

| Market type | Calls/day | Rationale |
|---|---|---|
| Ultra-rare / COE-only | 4–6 | Scientific calls, academic gatekeeping, long call length |
| Rare disease specialty | 6–8 | Mix of academic and community settings |
| Specialty branded, first-in-class | 6–8 | Relationship-heavy call model |
| Specialty branded, competitive | 8–10 | Standard promotional model |
| Hybrid specialty/PC | 8–10 | Shorter calls, higher volume |
| Primary care | 10–12 | High-volume, brief interactions |

**Calls per HCP per year by tier** — calibrate to commercial stage:

| Stage | T1 | T2 | T3 |
|---|---|---|---|
| Pre-launch | 24–36 | 12–18 | 6–9 |
| Launch year | 24–30 | 12–15 | 6–9 |
| Post-launch growth | 18–24 | 9–12 | 4–6 |
| Post-launch mature | 12–18 | 6–9 | 3–4 |

All calls/HCP/year values must be multiples of 6. Document any rounding. T2 tapers to ~40–50% of T1.

**Maximum reach cap** — set from market type:

| Market type | Cap range | Primary limiter |
|---|---|---|
| Ultra-rare | 70–80% | Academic access restrictions, limited specialist pool |
| Rare disease specialty | 80–90% | No-see policies, geographic isolation |
| Specialty branded | 85–95% | Some no-see HCPs, rural gaps |
| Primary care | 90–95% | Effort-driven; geographic saturation feasible |

Never seed 100% reach. Generate defaults for all tiers present — not only T1 and T2.

### 4. Compute and narrate 10 scenarios

Produce 10 mutually exclusive rep-count outputs. Never sum them together.

**Core formula:**
```
rep_annual_capacity = calls_per_day × working_days_per_year
effective_hcp_count = ROUND(hcp_count × reach_pct, 0)
tier_calls = effective_hcp_count × calls_per_hcp_per_year
reps_required = CEILING(total_calls / rep_annual_capacity, 1)
```

**Segment formula:**
```
segment_hcps  = ROUND(tier_hcp_count × segment_split_pct, 0)
effective_hcps = ROUND(segment_hcps × segment_reach_pct, 0)
segment_calls = effective_hcps × segment_calls_per_hcp_year
reps_required = CEILING(total_segment_calls / rep_annual_capacity, 1)
```

**Scenario parameters:**

| # | Scenario | Sub-scenario | T1 Reach | T2 Reach | T1 Calls/yr | T2 Calls/yr |
|---|---|---|---|---|---|---|
| 1 | Normal Workload | — | 100% | 100% | base | base |
| 2 | Reach | Aggressive | 95% | 80% | base | base |
| 3 | Reach | Moderate | 95% | 60% | base | base |
| 4 | Reach | Conservative | 80% | 50% | base | base |
| 5 | Frequency | High-touch | 95% | 60% | 18 | 9 |
| 6 | Frequency | Standard | 95% | 60% | 12 | 6 |
| 7 | Frequency | Low-touch | 95% | 60% | 8 | 4 |
| 8 | Segment | Premium-tilt | weighted | weighted | weighted | weighted |
| 9 | Segment | Balanced | weighted | weighted | weighted | weighted |
| 10 | Segment | Cost-aware | weighted | weighted | weighted | weighted |

Segment sub-scenario parameters (T1: 30% high / 70% standard; T2: 25% high / 75% standard):

| Sub-scenario | T1 High R/F | T1 Std R/F | T2 High R/F | T2 Std R/F |
|---|---|---|---|---|
| Premium-tilt | 95% / 18 | 85% / 10 | 80% / 9 | 50% / 4 |
| Balanced | 95% / 14 | 80% / 8 | 70% / 7 | 45% / 3 |
| Cost-aware | 90% / 12 | 70% / 6 | 60% / 5 | 35% / 2 |

Present a consolidated scenario table, then narrate each scenario cluster with commercial context specific to the drug/market — reference the actual HCP counts and Pareto data from the EDA.

### 5. Deliver Best-Fit recommendation

The Best-Fit recommendation is the sizing output's primary deliverable. It must:

- Name the recommended scenario and sub-scenario
- State the specific rep count
- Explain why this scenario fits the commercial stage, market type, and competitive position — citing actual numbers from the EDA
- State the full scenario range (min–max across all 10 scenarios) and where the recommendation sits within that range
- Validate the HCP/rep ratio against benchmarks for the market type
- Explain why the 2–3 most plausible alternatives are not the best fit
- Name the specific conditions that would change the recommendation
- Compare to any stated management rep count target
- State confidence level (High / Medium / Low) with a one-sentence explanation

**Recommendation logic:**

| Commercial context | Recommended scenario |
|---|---|
| Pre-launch, any market | Reach / Moderate |
| Launch year, rare/specialty | Reach / Aggressive |
| Launch year, competitive | Reach / Aggressive |
| Post-launch growth, first-in-class | Frequency / High-touch |
| Post-launch growth, competitive | Reach / Aggressive or Moderate |
| Post-launch mature, budget pressure | Reach / Conservative or Frequency / Low-touch |
| Strong Pareto (top 30% drive >60% volume) | Segment / Balanced or Premium-tilt |

## Final response format

Return the analysis as a structured chat response with:

1. **Data Overview** — EDA findings (tier structure, geographic spread, data quality, Pareto concentration)
2. **Market Profile** — classification with rationale, competitor benchmark findings
3. **Sizing Parameters** — working days, calls/day, calls/HCP/year by tier, reach caps, rep capacity (each with full derivation and benchmark range)
4. **Scenario Analysis** — consolidated table of all 10 scenarios with narrative by cluster
5. **Best-Fit Recommendation** — structured recommendation block (scenario, reps, rationale, alternatives, confidence)

Use headers, tables, and concise bullets. Show all arithmetic. Cite benchmarks by source or label as "pharma specialty norm." Use `Asset` and `Client` throughout. No files are created.
