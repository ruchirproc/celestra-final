import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Loader2, Map, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALIGNMENT_DASHBOARD_URL = "https://terrisense.auxo.tech/dashboard";

export const Route = createFileRoute("/alignment")({
  head: () => ({
    meta: [
      { title: "Alignment · Celestra" },
      { name: "description", content: "Territory alignment strategy — geographic EDA, COE mapping, and territory design recommendation." },
    ],
  }),
  component: AlignmentPage,
});

// ── Hardcoded config, shown once "gathered" from the Sizing module ─────────────

const TARGET_TERRITORIES = 15;
const TERRITORY_RANGE = { min: 20, max: 100, step: 5 };

const WEIGHTED_COLUMNS = [
  { name: "ZIP_Population", weight: 60 },
  { name: "Patient_Prevalence", weight: 40 }
];

const GATHERING_LABELS = [
  "Gathering input from Sizing module…",
  "Reading territory configuration…",
  "Loading weighted scoring columns…",
];

type Status = "idle" | "gathering" | "done";

function AlignmentPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [labelIndex, setLabelIndex] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  const handleGather = () => {
    setStatus("gathering");
    setLabelIndex(0);
    timeoutsRef.current.push(setTimeout(() => setLabelIndex(1), 600));
    timeoutsRef.current.push(setTimeout(() => setLabelIndex(2), 1200));
    timeoutsRef.current.push(setTimeout(() => setStatus("done"), 1900));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <Map className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Territory Alignment</h1>
            <p className="text-xs text-muted-foreground">
              Geographic EDA · COE mapping · Territory design strategy
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        {status === "idle" && (
          <div className="flex h-full items-center justify-center">
            <button
              onClick={handleGather}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-14 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Download className="h-6 w-6" />
              </span>
              <span className="text-base font-semibold text-foreground">Gather Input from Sizing Module</span>
              <span className="max-w-xs text-xs text-muted-foreground">
                Pull the territory count and weighted scoring columns already configured in Sizing.
              </span>
            </button>
          </div>
        )}

        {status === "gathering" && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">{GATHERING_LABELS[labelIndex]}</p>
          </div>
        )}

        {status === "done" && (
          <div className="mx-auto w-full max-w-2xl">
            <div className="animate-in fade-in rounded-2xl border border-border bg-card p-6 shadow-sm duration-300">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </span>
                <h2 className="text-base font-semibold text-foreground">Configuration</h2>
              </div>

              {/* Target territories */}
              <div className="mt-6">
                <p className="text-xs font-medium text-muted-foreground">Target Number of Territories (K)</p>
                <div className="mt-2.5 flex items-center gap-4">
                  <input
                    type="range"
                    min={TERRITORY_RANGE.min}
                    max={TERRITORY_RANGE.max}
                    step={TERRITORY_RANGE.step}
                    value={TARGET_TERRITORIES}
                    onChange={() => {}}
                    className="h-1.5 flex-1 accent-primary pointer-events-none"
                  />
                  <div className="w-16 shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-center text-sm font-bold text-primary">
                    {TARGET_TERRITORIES}
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Additional scenarios will be created for {TARGET_TERRITORIES - TERRITORY_RANGE.step} and {TARGET_TERRITORIES + TERRITORY_RANGE.step} territories.
                </p>
              </div>

              {/* Weighted columns */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">Optimization Logic (Weighted Columns)</p>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Plus className="h-3 w-3" />
                    Add Column
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {WEIGHTED_COLUMNS.map((col) => (
                    <div key={col.name} className="flex items-center gap-2">
                      <input
                        value={col.name}
                        readOnly
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                      />
                      <div className="flex w-20 shrink-0 items-center justify-center gap-1 rounded-lg border border-input bg-background px-2 py-2">
                        <span className="text-sm font-medium text-foreground">{col.weight}</span>
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      <Trash2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] italic text-muted-foreground">
                  * Ensure column names match your Excel file header exactly.
                </p>
              </div>

              <div className="mt-7 flex justify-end border-t border-border/50 pt-4">
                <Button asChild className="gap-2">
                  <a href={ALIGNMENT_DASHBOARD_URL}>
                    Proceed to Alignment
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
