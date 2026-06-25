# Celestra Full Stack — Project Skills Reference

This project has three custom skills available via `/` slash commands. Use the guide below to know when to invoke each one.

---

## `/zip-based-alignment`

**Skill folder:** `.claude/skills/Alignment/SKILL.md`

**When to use:**
- Designing or reviewing a pharma territory alignment strategy from an HCP universe file.
- Any ask involving territory count validation, geographic coverage design, COE-anchor vs. workload-balance philosophy, workload tolerance selection, or state sequencing strategy.
- Advising on how a territory alignment should be structured before or without executing it.

**What it offers:**
- Geographic EDA on the HCP universe: state-level distribution, workload concentration, regional cluster breakdown.
- Rare disease centers of excellence research: maps top academic treatment centers to states and cross-references against HCP workload.
- Territory design philosophy recommendation: COE-anchor model vs. workload-balance model, with specific data rationale.
- Territory count validation: structural feasibility checks (HCPs/rep ratio, states/rep, workload/territory vs. rep capacity).
- Workload tolerance recommendation: ±10% / ±15% / ±20%, calibrated to the concentration profile of the HCP universe.
- State sequencing plan: northeastern-start zig-zag sweep description, regional cluster allocation, multi-state territory groupings, rep home-base recommendations.
- All output delivered as a structured consultancy briefing in chat. No Excel workbook or map file is generated.

**Key inputs required:** HCP universe file with State and ZIP, territory count, drug/indication context, geographic scope.

---

## `/sizing-skill`

**Skill folder:** `.claude/skills/Sizing/SKILL.md`

**When to use:**
- Sizing a pharma sales force or field team for a tiered HCP target list.
- Any ask involving reach %, calls/HCP/year, working day derivation, rep capacity, scenario modeling, or competitive salesforce benchmarking.
- Delivering a leadership-ready rep-count recommendation for branded, generic, specialty, oncology, rare disease, or launch planning use cases.

**What it offers:**
- EDA on the HCP universe: tier structure, geographic distribution, data quality, Pareto concentration.
- Market type classification: ultra-rare, rare disease specialty, specialty branded, hybrid, or primary care — with specific data signals.
- Sizing parameter derivation: working days, calls/day, calls/HCP/year by tier, max reach cap — each with full arithmetic, benchmark range, and override triggers.
- 10 mutually exclusive rep-count scenarios: Normal Workload baseline, 3 Reach scenarios (Aggressive/Moderate/Conservative), 3 Frequency scenarios (High-touch/Standard/Low-touch), and 3 Segment scenarios (Premium-tilt/Balanced/Cost-aware).
- Best-Fit Recommendation: specific scenario, rep count, commercial rationale, HCP/rep ratio validation, confidence level, and competitive benchmark context.
- All visible output de-identified: drug/brand → `Asset`, client/company → `Client`.
- All output delivered as a structured consultancy briefing in chat. No Excel workbook is generated.

**Key inputs required:** HCP target list with tier column, drug/indication context (used internally for research), geography, and commercial stage.

---

## `/targeting-rare-skill`

**Skill folder:** `.claude/skills/Targeting/SKILL.md`

**When to use:**
- Building an HCP targeting and priority scoring analysis for rare disease, branded, or combined pharma markets.
- Scoring HCPs using commercial metrics (Rx, claims, patient counts) and/or influence metrics (clinical trials, publications, KOL status, online presence).
- Any ask involving metric normalization, user-defined or priority-order weights, composite priority scoring, cumulative-score deciling, tiering, or HCP deployment recommendations.

**What it offers:**
- EDA on the HCP universe: specialty breakdown, geographic distribution, metric inventory, data quality flags, and outlier identification.
- Market type classification: rare disease, branded, or combined — with commercial rationale.
- Scoring framework recommendation: metric priority order, rank-decay or custom weights, tier cutoff analysis with HCP/rep ratio benchmarking.
- Continuous-band min-max normalization — prevents single outlier HCPs from distorting the score distribution; outlier-aware band selection identifies the dominant data pattern.
- Composite priority scoring, cumulative descending deciling (D10 = highest priority), and tier assignment.
- Score distribution analysis: full decile breakdown, tier summary, HCPs/rep ratio per tier.
- Metric contribution analysis: which metrics are most differentiating, which are candidates for weight adjustment.
- Top HCP insights: ranked T1 HCPs with primary and secondary score drivers, override review flags.
- Pareto concentration analysis: what % of HCPs account for the top 50% and 80% of cumulative score.
- Deployment recommendation: which tier combination to deploy, phasing guidance, forced-include and data-quality flags.
- All output delivered as a structured consultancy briefing in chat. No Excel workbook is generated.

**Key inputs required:** HCP-level data file with at least one unique identifier, market type (rare/branded/combined), available commercial and/or influence metrics, weighting method or metric priority order, and rep count target for HCP/rep ratio analysis.