import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import {
  Sparkles, Loader2, CheckCircle2, ChevronRight, ChevronLeft, X, Plus,
  Target, Users, Map, Save, Download, ArrowRight, Pill, Swords, Rocket,
  Link2, ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { analyzeContext } from "@/lib/api/chat";

export const Route = createFileRoute("/context")({
  head: () => ({
    meta: [
      { title: "Project Context · Celestra" },
      { name: "description", content: "Capture drug, market, and commercial details before running skills." },
    ],
  }),
  component: ContextPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  // 01 Drug & Indication
  brandName: string;
  genericName: string;
  mechanismOfAction: string;
  indication: string;
  regulatoryStatus: string;
  // 02 Therapeutic Area
  therapeuticArea: string;
  patientPopulation: string;
  prevalenceEstimate: string;
  rareDisease: string;
  // 03 Competitive Landscape
  competitors: string[];
  marketLeader: string;
  competitivePositioning: string;
  // 04 Launch Timeline
  launchDate: string;
  commercialStage: string;
  keyMilestones: string[];
  // 05 Commercial Goals
  targetSpecialties: string[];
  geographicFocus: string;
  fieldForceModel: string;
  repCountTarget: string;
  deploymentYear: string;
}

interface Recommendations {
  strategic_summary?: string;
  for_targeting?: { market_type?: string; recommended_metric_priority_order?: string[]; rationale?: string; [k: string]: unknown };
  for_sizing?: { market_classification?: string; recommended_rep_count_range?: string; field_force_model_recommendation?: string; rationale?: string; [k: string]: unknown };
  for_alignment?: { territory_design_philosophy?: string; territory_count_estimate?: number; workload_tolerance_pct?: number; rationale?: string; [k: string]: unknown };
}

const EMPTY: FormState = {
  brandName: "", genericName: "", mechanismOfAction: "", indication: "", regulatoryStatus: "",
  therapeuticArea: "", patientPopulation: "", prevalenceEstimate: "", rareDisease: "",
  competitors: [], marketLeader: "", competitivePositioning: "",
  launchDate: "", commercialStage: "", keyMilestones: [],
  targetSpecialties: [], geographicFocus: "", fieldForceModel: "", repCountTarget: "", deploymentYear: "",
};

// ── Wizard step config ─────────────────────────────────────────────────────────

interface StepConfig {
  title: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  { title: "Drug & Indication", icon: Pill },
  { title: "Therapeutic Area & Patients", icon: Users },
  { title: "Competitive Landscape", icon: Swords },
  { title: "Launch Timeline", icon: Rocket },
  { title: "Commercial Goals & Field Force", icon: Target },
];

// The user's first name, used for the opening greeting — swap in real profile data when available.
const USER_FIRST_NAME = "Ruchir";

// Hardcoded, one line per step — the single chat bubble cycles through these as the user progresses.
const STEP_MESSAGES = [
  `Hi ${USER_FIRST_NAME} — before we start, could you help me understand the drug and indication we're working with?`,
  "Great, thank you. Could you help me understand the therapeutic area and who the patients are?",
  "Got it. Could you help me understand the competitive landscape here?",
  "Noted. Could you help me understand where we are in the commercial journey?",
  "Almost done. Could you help me understand the commercial goals and field force plans?",
];

// Hardcoded values Agent "infers" from the Drug & Indication section for every later step —
// each one auto-fills a beat after landing on that step, badge-labeled per step.
const STEP_AUTO_FILL: Partial<Record<number, Partial<FormState>>> = {
  1: {
    therapeuticArea: "Oncology/Hematology",
    patientPopulation: "Above 12 yr old",
    prevalenceEstimate: "<10000 patients",
    rareDisease: "Yes",
  },
  2: {
    competitors: ["None"],
    marketLeader: "Unknown",
    competitivePositioning: "Niche / Orphan",
  },
  3: {
    launchDate: "Launched in 2024",
    commercialStage: "Post-launch",
    keyMilestones: ["None"],
  },
  4: {
    targetSpecialties: ["Hematologists", "Oncologists"],
    geographicFocus: "National",
  },
};

const AI_FILL_LABELS: Partial<Record<number, string>> = {
  1: "Filling with AI",
  2: "Generating with AI",
  3: "Predicting with AI",
  4: "Recommending with AI",
};

// Real, credible reference sources — only linked to their canonical top-level domain,
// shown per step once that section has been auto-filled.
interface SourceEntry {
  name: string;
  url: string;
  note: string;
}

const SOURCES_BY_STEP: Partial<Record<number, SourceEntry[]>> = {
  1: [
    { name: "Orphanet", url: "https://www.orpha.net", note: "Rare disease prevalence and epidemiology reference" },
    { name: "NORD", url: "https://rarediseases.org", note: "Rare disease patient population data" },
  ],
  2: [
    { name: "ClinicalTrials.gov", url: "https://clinicaltrials.gov", note: "Competitor trial activity and pipeline" },
    { name: "FDA.gov", url: "https://www.fda.gov", note: "Approved competitor therapies and regulatory status" },
  ],
  3: [
    { name: "DailyMed (NIH)", url: "https://dailymed.nlm.nih.gov", note: "Approved drug labels and launch history" },
  ],
  4: [
    { name: "IQVIA", url: "https://www.iqvia.com", note: "Field force and HCP specialty benchmarks" },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function Pills({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
            value === opt
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/40",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TagInput({
  tags, onChange, placeholder,
}: { tags: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const v = draft.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setDraft("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !draft && tags.length) onChange(tags.slice(0, -1));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[40px] cursor-text flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0"
    >
      {tags.map((t) => (
        <span key={t} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={add}
        placeholder={tags.length ? "" : placeholder}
        className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function RecommendationCard({
  icon: Icon, title, color, children,
}: { icon: React.ElementType; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border p-4", color)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <div className="space-y-2 text-xs">{children}</div>
    </div>
  );
}

function RecRow({ label, value }: { label: string; value?: string | number | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : String(value);
  return (
    <div>
      <span className="font-medium text-foreground/70">{label}: </span>
      <span className="text-foreground">{display}</span>
    </div>
  );
}

// ── Chat bubble ────────────────────────────────────────────────────────────────
// A single, persistent bubble — its text changes as the conversation moves through
// each section, rather than stacking a new bubble per question.

interface ChatBubbleState {
  status: "thinking" | "idle";
  text: string;
}

const GATHERING_LABELS = [
  "Gathering context…",
  "Thinking it through…",
  "Cross-referencing…",
  "Noting the details…",
  "Wrapping up…",
];

function ChatBubble({ state }: { state: ChatBubbleState }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-2.5 ring-1 ring-border/50">
        {state.status === "thinking" ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {state.text}
          </span>
        ) : (
          <p key={state.text} className="animate-in fade-in text-sm text-foreground/85 duration-500">
            {state.text}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Agent Memory sidebar ───────────────────────────────────────────────────────
// A brief, hardcoded, cumulative summary — not a copy of the form — updated once
// per completed section, with a "continuously learning" tagline to keep it feeling alive.

const MEMORY_SUMMARIES = [
  "Nothing yet — Agent will start remembering as soon as you answer.",
  "I now understand the drug, its mechanism, and the indication being pursued.",
  "I also understand the therapeutic area and who the target patients are.",
  "I'm building a picture of the competitive landscape as well.",
  "I have a sense of the commercial timeline and key milestones too.",
  "I have a full picture — drug, market, competition, timeline, and commercial goals.",
];

function AgentMemoryPanel({ summaryIndex, isThinking }: { summaryIndex: number; isThinking: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Agent Memory</p>
          <p className="flex items-center gap-1.5 text-[10px] text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Continuously learning
          </p>
        </div>
      </div>
      <div className="px-4 py-4">
        <p key={summaryIndex} className="animate-in fade-in text-[13px] leading-relaxed text-foreground/80 duration-500">
          {MEMORY_SUMMARIES[summaryIndex]}
          {isThinking && (
            <span className="ml-1 inline-flex items-center gap-1 text-primary">
              <Loader2 className="h-3 w-3 animate-spin" />
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Sources panel ──────────────────────────────────────────────────────────────
// Cites the real, credible references Agent draws on for the section currently
// being worked on — swaps out entirely when the section changes, not cumulative.

function SourcesPanel({ step }: { step: number }) {
  const sources = SOURCES_BY_STEP[step] ?? [];

  if (sources.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Link2 className="h-3.5 w-3.5 text-primary" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Sources</p>
          <p className="text-[10px] text-muted-foreground">Where Agent is learning from</p>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {sources.map((source) => (
          <li key={source.name} className="animate-in fade-in px-4 py-2.5 duration-500">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              {source.name}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{source.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ContextPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [chatBubble, setChatBubble] = useState<ChatBubbleState>({ status: "idle", text: STEP_MESSAGES[0] });
  const [rawResponse, setRawResponse] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [saved, setSaved] = useState(false);
  // Guards against double-clicks firing handleStepSubmit twice before the step re-renders.
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Which step (if any) is currently showing its "Filling with AI" badge.
  const [aiFillingStep, setAiFillingStep] = useState<number | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  // Ref to accumulate the full streamed text — avoids stale-closure reads of rawResponse state.
  const rawRef = useRef("");
  // Steps already auto-filled — prevents re-filling if the user navigates back and forth.
  const autoFilledStepsRef = useRef<Set<number>>(new Set());

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Showcase Agent "inferring" the rest of the context from the drug/indication —
  // each step after the first auto-fills a beat after you land on it.
  useEffect(() => {
    const overrides = STEP_AUTO_FILL[step];
    if (!overrides || autoFilledStepsRef.current.has(step)) return;
    autoFilledStepsRef.current.add(step);
    setAiFillingStep(step);
    const t = setTimeout(() => {
      setForm((f) => ({ ...f, ...overrides }));
      setAiFillingStep(null);
    }, 4000);
    return () => clearTimeout(t);
  }, [step]);

  // Completeness: count sections with at least one non-empty value
  const sectionFilled = [
    !!(form.brandName || form.genericName || form.indication),
    !!(form.therapeuticArea || form.patientPopulation),
    !!(form.competitors.length || form.competitivePositioning),
    !!(form.commercialStage || form.launchDate),
    !!(form.targetSpecialties.length || form.geographicFocus),
  ];
  const filledCount = sectionFilled.filter(Boolean).length;
  const canAnalyze = filledCount >= 2;
  const isLastStep = step === STEPS.length - 1;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, i));
    setDirection(clamped > step ? "forward" : "back");
    setStep(clamped);
  };
  const handleStepSubmit = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const submittedStep = step;
    const nextStep = submittedStep + 1;
    setChatBubble({ status: "thinking", text: GATHERING_LABELS[submittedStep % GATHERING_LABELS.length] });
    goTo(nextStep);
    setTimeout(() => {
      setChatBubble({ status: "idle", text: STEP_MESSAGES[nextStep] });
      setIsTransitioning(false);
    }, 750);
  };

  const goNext = () => (isLastStep ? handleAnalyze() : handleStepSubmit());
  const goBack = () => goTo(step - 1);

  const handleAnalyze = async () => {
    if (!canAnalyze || isAnalyzing) return;
    setIsAnalyzing(true);
    setRawResponse("");
    rawRef.current = "";
    setRecommendations(null);
    setProjectId(null);
    setSaved(false);
    setChatBubble({ status: "thinking", text: "Let me pull everything together and analyze this for you…" });

    try {
      const result = await analyzeContext(
        form as unknown as Record<string, unknown>,
        (delta) => {
          rawRef.current += delta;
          setRawResponse((r) => r + delta);
          if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
          }
        },
      );

      setProjectId(result.project_id);
      // Persist so pipeline.tsx can pick it up automatically
      if (result.project_id) {
        localStorage.setItem("celestra_project_id", result.project_id);
      }

      // Use rawRef.current — rawResponse state is stale inside this closure.
      // Anchor to the "project_context" key so we skip any prose { } before the JSON block.
      const raw = rawRef.current;
      const keyIdx = raw.indexOf('"project_context"');
      if (keyIdx !== -1) {
        const start = raw.lastIndexOf("{", keyIdx);
        const end = raw.lastIndexOf("}");
        if (start !== -1 && end > start) {
          const jsonStr = raw.slice(start, end + 1);
          // Persist the full context JSON so targeting can use it even after a server restart
          localStorage.setItem("celestra_context_json", jsonStr);
          try {
            const parsed = JSON.parse(jsonStr) as { claude_recommendations?: Recommendations };
            if (parsed.claude_recommendations) setRecommendations(parsed.claude_recommendations);
          } catch {
            // JSON parse failed — recommendations stay null, raw text still visible
          }
        }
      }
      setChatBubble({ status: "idle", text: "All set — here's what I found." });
    } catch (err) {
      setRawResponse(`Error: ${(err as Error).message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEditAnswers = () => {
    setRawResponse("");
    rawRef.current = "";
    setRecommendations(null);
    setProjectId(null);
    setSaved(false);
    goTo(STEPS.length - 1);
  };

  const handleDownloadJson = () => {
    const keyIdx = rawResponse.indexOf('"project_context"');
    if (keyIdx === -1) return;
    const start = rawResponse.lastIndexOf("{", keyIdx);
    const end = rawResponse.lastIndexOf("}");
    if (start === -1 || end <= start) return;
    const jsonStr = rawResponse.slice(start, end + 1);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-context-${projectId?.slice(0, 8) ?? "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse recommendations once streaming ends (manual fallback button)
  const handleParseRecommendations = () => {
    const keyIdx = rawResponse.indexOf('"project_context"');
    if (keyIdx === -1) return;
    const start = rawResponse.lastIndexOf("{", keyIdx);
    const end = rawResponse.lastIndexOf("}");
    if (start === -1 || end <= start) return;
    try {
      const parsed = JSON.parse(rawResponse.slice(start, end + 1)) as { claude_recommendations?: Recommendations };
      if (parsed.claude_recommendations) setRecommendations(parsed.claude_recommendations);
    } catch {
      // ignore
    }
  };

  const showAnalysis = isAnalyzing || !!rawResponse;
  const CurrentIcon = STEPS[step].icon;
  const completedSections = showAnalysis ? STEPS.length : step;

  return (
    <>
      <PageHeader
        eyebrow=""
        title="Welcome to Celestra"
        description="Let's start building on the context - fill in a few details and Agent will pre-seed recommendations for targeting, sizing, and alignment."
      />

      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 sm:p-6 lg:p-8",
          !showAnalysis && "lg:grid-cols-[1fr_300px]",
        )}
      >
      <div className="min-w-0 space-y-5">

        {/* Single persistent chat bubble — only shown for the first section */}
        {!showAnalysis && step === 0 && <ChatBubble state={chatBubble} />}

        {!showAnalysis && (
          <>
            {/* Step card */}
            <div
              key={step}
              className={cn(
                "animate-in fade-in rounded-xl border border-border bg-card shadow-sm duration-300",
                direction === "forward" ? "slide-in-from-right-6" : "slide-in-from-left-6",
              )}
            >
              <div className="flex items-start gap-3 border-b border-border px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CurrentIcon className="h-4.5 w-4.5" />
                </span>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{STEPS[step].title}</p>
                  {aiFillingStep === step && (
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {AI_FILL_LABELS[step]}…
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                {step === 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>Brand name</FieldLabel>
                        <Input value={form.brandName} onChange={(e) => set("brandName", e.target.value)}
                          placeholder="e.g. Dupixent" className="text-sm" />
                      </div>
                      <div>
                        <FieldLabel>Generic / INN name</FieldLabel>
                        <Input value={form.genericName} onChange={(e) => set("genericName", e.target.value)}
                          placeholder="e.g. dupilumab" className="text-sm" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Mechanism of action</FieldLabel>
                      <Input value={form.mechanismOfAction} onChange={(e) => set("mechanismOfAction", e.target.value)}
                        placeholder="e.g. IL-4/IL-13 receptor antagonist" className="text-sm" />
                    </div>
                    <div>
                      <FieldLabel>Primary indication</FieldLabel>
                      <Input value={form.indication} onChange={(e) => set("indication", e.target.value)}
                        placeholder="e.g. Moderate-to-severe atopic dermatitis" className="text-sm" />
                    </div>
                    <div>
                      <FieldLabel>Regulatory status</FieldLabel>
                      <Pills
                        options={["Phase II", "Phase III", "NDA / BLA Filed", "FDA Approved — Pre-launch", "FDA Approved — Launched"]}
                        value={form.regulatoryStatus}
                        onChange={(v) => set("regulatoryStatus", v)}
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <FieldLabel>Therapeutic area</FieldLabel>
                      <Pills
                        options={["Oncology/Hematology", "Rare Disease", "Neurology", "Cardiology", "Immunology", "Endocrinology", "Infectious Disease", "Dermatology"]}
                        value={form.therapeuticArea}
                        onChange={(v) => set("therapeuticArea", v)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Target patient population</FieldLabel>
                      <Input value={form.patientPopulation} onChange={(e) => set("patientPopulation", e.target.value)}
                        placeholder="e.g. Adult patients with relapsed/refractory AML" className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>US prevalence estimate</FieldLabel>
                        <Input value={form.prevalenceEstimate} onChange={(e) => set("prevalenceEstimate", e.target.value)}
                          placeholder="e.g. ~15,000 patients/year" className="text-sm" />
                      </div>
                      <div>
                        <FieldLabel>Rare disease?</FieldLabel>
                        <Pills options={["Yes", "No", "Unknown"]} value={form.rareDisease}
                          onChange={(v) => set("rareDisease", v)} />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <FieldLabel>Known competitors <span className="normal-case font-normal text-muted-foreground/60">(press Enter after each)</span></FieldLabel>
                      <TagInput tags={form.competitors} onChange={(v) => set("competitors", v)}
                        placeholder="Type a drug name and press Enter…" />
                    </div>
                    <div>
                      <FieldLabel>Current market leader</FieldLabel>
                      <Input value={form.marketLeader} onChange={(e) => set("marketLeader", e.target.value)}
                        placeholder="e.g. Opdivo (nivolumab)" className="text-sm" />
                    </div>
                    <div>
                      <FieldLabel>Competitive positioning</FieldLabel>
                      <Pills
                        options={["First-in-class", "Best-in-class", "Me-too / Parity", "Niche / Orphan", "Differentiated mechanism"]}
                        value={form.competitivePositioning}
                        onChange={(v) => set("competitivePositioning", v)}
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>Expected US launch date</FieldLabel>
                        <Input value={form.launchDate} onChange={(e) => set("launchDate", e.target.value)}
                          placeholder="e.g. Q3 2026" className="text-sm" />
                      </div>
                      <div>
                        <FieldLabel>Commercial stage</FieldLabel>
                        <Pills
                          options={["Pre-launch > 12 mo", "Pre-launch < 12 mo", "Launch year", "Post-launch"]}
                          value={form.commercialStage}
                          onChange={(v) => set("commercialStage", v)}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Key milestones <span className="normal-case font-normal text-muted-foreground/60">(press Enter after each)</span></FieldLabel>
                      <TagInput tags={form.keyMilestones} onChange={(v) => set("keyMilestones", v)}
                        placeholder="e.g. PDUFA date, label negotiations, KOL advisory board…" />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div>
                      <FieldLabel>Target HCP specialties <span className="normal-case font-normal text-muted-foreground/60">(press Enter after each)</span></FieldLabel>
                      <TagInput tags={form.targetSpecialties} onChange={(v) => set("targetSpecialties", v)}
                        placeholder="e.g. Hematologists, Neurologists…" />
                    </div>
                    <div>
                      <FieldLabel>Geographic focus</FieldLabel>
                      <Pills
                        options={["National", "Northeast", "Southeast", "Midwest", "Southwest", "West", "Key markets only"]}
                        value={form.geographicFocus}
                        onChange={(v) => set("geographicFocus", v)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Field force model</FieldLabel>
                      <Pills
                        options={["Specialty sales force", "Primary care sales force", "Hybrid (specialty + PC)", "MSL-only", "Not yet determined"]}
                        value={form.fieldForceModel}
                        onChange={(v) => set("fieldForceModel", v)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>Initial rep count target</FieldLabel>
                        <Input value={form.repCountTarget} onChange={(e) => set("repCountTarget", e.target.value)}
                          placeholder="e.g. 50–75" className="text-sm" />
                      </div>
                      <div>
                        <FieldLabel>Target deployment year</FieldLabel>
                        <Input value={form.deploymentYear} onChange={(e) => set("deploymentYear", e.target.value)}
                          placeholder="e.g. 2026" className="text-sm" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Step nav */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <Button variant="ghost" size="sm" onClick={goBack} disabled={step === 0 || isTransitioning} className="gap-1.5">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  {filledCount} of {STEPS.length} sections filled
                </span>
                {isLastStep ? (
                  <Button size="sm" onClick={goNext} disabled={!canAnalyze || isAnalyzing} className="gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze with Agent
                  </Button>
                ) : (
                  <Button size="sm" onClick={goNext} disabled={isTransitioning} className="gap-1.5">
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {isLastStep && !canAnalyze && (
              <p className="-mt-2 text-center text-xs text-muted-foreground">
                Fill at least 2 sections to enable analysis
              </p>
            )}
          </>
        )}

        {/* ── Streaming response ─────────────────────────────────────────── */}
        {showAnalysis && (
          <div className="rounded-xl border border-primary/20 bg-primary/5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Agent's Analysis</span>
                {isAnalyzing && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    Streaming
                  </span>
                )}
                {!isAnalyzing && projectId && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">
                    <CheckCircle2 className="h-3 w-3" /> Saved · {projectId.slice(0, 8)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!isAnalyzing && (
                  <button
                    onClick={handleEditAnswers}
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    ← Edit answers
                  </button>
                )}
                <button
                  onClick={() => setShowRaw((s) => !s)}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {showRaw ? "Hide raw" : "Show raw"}
                </button>
              </div>
            </div>

            {/* Raw text (collapsible) */}
            {showRaw && (
              <div
                ref={responseRef}
                className="max-h-64 overflow-y-auto px-5 py-4 font-mono text-xs leading-relaxed text-foreground/80"
              >
                <span className="whitespace-pre-wrap">{rawResponse}</span>
                {isAnalyzing && <span className="animate-pulse">▌</span>}
              </div>
            )}

            {/* Recommendations grid — shown after streaming completes */}
            {!isAnalyzing && rawResponse && (
              <div className="px-5 py-4">
                {!recommendations ? (
                  <button
                    onClick={handleParseRecommendations}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Extract structured recommendations
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pre-seeded recommendations for downstream skills
                    </p>
                    {recommendations.strategic_summary && (
                      <p className="text-xs text-foreground/80 italic">{recommendations.strategic_summary}</p>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <RecommendationCard
                        icon={Target}
                        title="Targeting"
                        color="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
                      >
                        <RecRow label="Market type" value={recommendations.for_targeting?.market_type} />
                        <RecRow label="Priority metrics" value={recommendations.for_targeting?.recommended_metric_priority_order} />
                        <RecRow label="Rationale" value={recommendations.for_targeting?.rationale} />
                      </RecommendationCard>

                      <RecommendationCard
                        icon={Users}
                        title="Sizing"
                        color="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20"
                      >
                        <RecRow label="Classification" value={recommendations.for_sizing?.market_classification} />
                        <RecRow label="Rep count range" value={recommendations.for_sizing?.recommended_rep_count_range} />
                        <RecRow label="Field force model" value={recommendations.for_sizing?.field_force_model_recommendation} />
                        <RecRow label="Rationale" value={recommendations.for_sizing?.rationale} />
                      </RecommendationCard>

                      <RecommendationCard
                        icon={Map}
                        title="Alignment"
                        color="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      >
                        <RecRow label="Territory design" value={recommendations.for_alignment?.territory_design_philosophy} />
                        <RecRow label="Territory count" value="15" />
                        <RecRow label="Workload tolerance" value={recommendations.for_alignment?.workload_tolerance_pct != null ? `±${recommendations.for_alignment.workload_tolerance_pct}%` : undefined} />
                        <RecRow label="Rationale" value={recommendations.for_alignment?.rationale} />
                      </RecommendationCard>
                    </div>

                    {/* Action bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50 mt-2">
                      {!saved ? (
                        <Button size="sm" variant="outline" onClick={() => setSaved(true)} className="gap-2">
                          <Save className="h-3.5 w-3.5" />
                          Save context
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          Saved
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadJson}
                        disabled={!rawResponse.includes('"project_context"')}
                        className="gap-2"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download JSON
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate({ to: "/pipeline" })}
                        className="gap-2 ml-auto"
                      >
                        Continue to Targeting
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-full text-[10px] text-muted-foreground font-mono">
                        Project ID: {projectId?.slice(0, 12)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {!showAnalysis && (
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-6 lg:self-start">
          <AgentMemoryPanel summaryIndex={completedSections} isThinking={isTransitioning || isAnalyzing} />
          <SourcesPanel step={step} />
        </aside>
      )}
      </div>
    </>
  );
}
