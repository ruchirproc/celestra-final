import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send, Upload, FileSpreadsheet, X, CheckCircle2, Sparkles, Loader2, ArrowRight, AlertTriangle,
} from "lucide-react";

function extractContextDrug(ctxJson: string | null): string {
  if (!ctxJson) return "";
  try {
    const parsed = JSON.parse(ctxJson);
    const drug = parsed?.project_context?.drug_and_indication;
    return drug?.brand_name || drug?.generic_name || "";
  } catch {
    return "";
  }
}

function drugsMatch(a: string, b: string): boolean {
  if (!a || !b) return true;
  const norm = (s: string) => s.toLowerCase().trim();
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a));
}
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { API_BASE, startSession, streamMessage, type OutputFile } from "@/lib/api/chat";
import { Download } from "lucide-react";
import { MarkdownMessage } from "@/components/MarkdownMessage";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline · Celestra" },
      { name: "description", content: "Project context gathering and HCP targeting pipeline." },
    ],
  }),
  component: PipelinePage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type PipelineStep = "context" | "targeting";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  outputFiles?: OutputFile[];
}

// ── Step config ───────────────────────────────────────────────────────────────

const STEPS: { key: PipelineStep; label: string; description: string }[] = [
  {
    key: "context",
    label: "Project Context",
    description: "Drug, indication, competitive landscape, commercial goals",
  },
  {
    key: "targeting",
    label: "HCP Targeting",
    description: "Upload HCP universe · score · tier · export target list",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

function PipelinePage() {
  const [step, setStep] = useState<PipelineStep>("context");
  const [completedSteps, setCompletedSteps] = useState<Set<PipelineStep>>(new Set());
  const [savedContextId, setSavedContextId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [contextDrug, setContextDrug] = useState<string>("");
  const [sessionDrugInput, setSessionDrugInput] = useState<string>("");
  const [drugMismatch, setDrugMismatch] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // ── Session init ────────────────────────────────────────────────────────────

  const initSession = useCallback(async (agent: PipelineStep, pid: string | null, ctxJson?: string | null) => {
    setIsLoading(true);
    setMessages([]);
    try {
      const { session_id, first_message } = await startSession(agent, pid, ctxJson);
      setSessionId(session_id);
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: first_message }]);
    } catch (err) {
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Failed to connect to backend: ${(err as Error).message}\n\nMake sure the backend server is reachable and try refreshing.`,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount: if the /context page already ran an analysis, pick up that project ID
  // and jump straight to targeting. Otherwise start a fresh context conversation.
  useEffect(() => {
    const savedProjectId = localStorage.getItem("celestra_project_id");
    if (savedProjectId) {
      const savedContextJson = localStorage.getItem("celestra_context_json");
      setSavedContextId(savedProjectId);
      setProjectId(savedProjectId);
      setCompletedSteps(new Set<PipelineStep>(["context"]));
      setStep("targeting");
      const drug = extractContextDrug(savedContextJson ?? null);
      if (drug) {
        setContextDrug(drug);
        setSessionDrugInput(drug);
      }
      initSession("targeting", savedProjectId, savedContextJson);
    } else {
      initSession("context", null);
    }
  }, [initSession]);

  const handleStartFresh = () => {
    localStorage.removeItem("celestra_project_id");
    setSavedContextId(null);
    setProjectId(null);
    setDrugMismatch(false);
    setContextDrug("");
    setSessionDrugInput("");
    setFiles([]);
    // Stay on targeting step — just drop the context and restart targeting without it
    initSession("targeting", null, null);
  };

  const handleDrugCommit = () => {
    const drug = sessionDrugInput.trim();
    const isMismatch = !!contextDrug && !!drug && !drugsMatch(drug, contextDrug);
    if (isMismatch === drugMismatch) return;
    setDrugMismatch(isMismatch);
    if (isMismatch) {
      setSavedContextId(null);
      initSession("targeting", null, null);
    } else {
      const pid = localStorage.getItem("celestra_project_id");
      const ctxJson = localStorage.getItem("celestra_context_json");
      setSavedContextId(pid);
      initSession("targeting", pid, ctxJson);
    }
  };

  const handleRestoreContextDrug = () => {
    setSessionDrugInput(contextDrug);
    setDrugMismatch(false);
    const pid = localStorage.getItem("celestra_project_id");
    const ctxJson = localStorage.getItem("celestra_context_json");
    setSavedContextId(pid);
    initSession("targeting", pid, ctxJson);
  };

  // ── Send message ────────────────────────────────────────────────────────────

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && files.length === 0) || !sessionId || isLoading) return;

    setInput("");

    const fileLabel = files.length === 1
      ? `[Uploaded: ${files[0].name}]`
      : `[Uploaded ${files.length} files: ${files.map((f) => f.name).join(", ")}]`;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: files.length > 0 ? (text ? `${text}\n\n${fileLabel}` : fileLabel) : text,
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    const uploadedFiles = files;
    setFiles([]);

    try {
      const result = await streamMessage(
        sessionId,
        text,
        uploadedFiles,
        (delta) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m))
          );
        },
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, outputFiles: result.output_files ?? [] }
            : m
        )
      );

      if (result.is_complete && step === "context") {
        setCompletedSteps((s) => new Set(s).add("context"));
        setProjectId(result.project_id);
        setTransitioning(true);

        // Give the user a moment to read the final context message, then switch
        setTimeout(async () => {
          setStep("targeting");
          setTransitioning(false);
          // Context from the pipeline's own chat session lives server-side; no localStorage JSON needed here
          await initSession("targeting", result.project_id);
        }, 2000);
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `Error: ${(err as Error).message}`, streaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Top: progress stepper ─────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => {
            const isDone = completedSteps.has(s.key);
            const isActive = step === s.key && !transitioning;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                {/* Step pill */}
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isDone
                      ? "bg-green-100 text-green-800"
                      : isActive
                        ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                  ) : (
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        isActive ? "bg-primary text-white" : "bg-muted-foreground/30 text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span>{s.label}</span>
                  {isActive && !isDone && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                  )}
                </div>

                {i < STEPS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step description */}
        <p className="mt-1.5 text-xs text-muted-foreground">
          {STEPS.find((s) => s.key === step)?.description}
        </p>
      </div>

      {/* ── Transition banner ─────────────────────────────────────────────── */}
      {transitioning && (
        <div className="shrink-0 bg-green-50 px-6 py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Project context saved — starting HCP Targeting…
          </div>
        </div>
      )}

      {/* ── Drug mismatch warning ──────────────────────────────────────────── */}
      {drugMismatch && !transitioning && (
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-6 py-2.5">
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>
              Project context is <span className="font-semibold">not being used</span> — context drug{" "}
              <span className="font-semibold">"{contextDrug}"</span> doesn't match{" "}
              <input
                className="inline-block w-28 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
                value={sessionDrugInput}
                onChange={(e) => setSessionDrugInput(e.target.value)}
                onBlur={handleDrugCommit}
                onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
                aria-label="Session drug name"
              />
            </span>
          </div>
          <button
            onClick={handleRestoreContextDrug}
            className="shrink-0 text-[10px] text-amber-600 underline underline-offset-2 hover:text-amber-800"
          >
            Restore context drug
          </button>
        </div>
      )}

      {/* ── Saved context banner ───────────────────────────────────────────── */}
      {savedContextId && !drugMismatch && !transitioning && (
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-6 py-2.5">
          <div className="flex items-center gap-2 text-xs text-blue-800">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />
            <span>Using project context</span>
            {contextDrug && (
              <>
                <span className="text-blue-300">·</span>
                <span className="text-blue-600">Asset:</span>
                <input
                  className="w-28 rounded border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={sessionDrugInput}
                  onChange={(e) => setSessionDrugInput(e.target.value)}
                  onBlur={handleDrugCommit}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
                  aria-label="Session drug name"
                />
              </>
            )}
          </div>
          <button
            onClick={handleStartFresh}
            className="shrink-0 text-[10px] text-blue-600 underline underline-offset-2 hover:text-blue-800"
          >
            Start fresh
          </button>
        </div>
      )}

      {/* ── Chat messages ─────────────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">

          {/* Step label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {step === "context" ? "Project Context" : "HCP Targeting"}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Thinking indicator — shown when loading but no streaming message yet */}
          {isLoading && !messages.some((m) => m.streaming) && (
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-2">

          {/* File upload — always visible */}
          <div className="space-y-1.5">
            {/* Pending files list */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {files.map((f, i) => (
                  <div
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    <span className="max-w-[160px] truncate text-xs font-medium">{f.name}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {(f.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Add files button */}
            <button
              onClick={() => { if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); } }}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              {files.length > 0 ? "Add another file (.xlsx)" : "Attach HCP universe (.xlsx)"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              multiple
              className="hidden"
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);
                if (!picked.length) return;
                setFiles((prev) => [...prev, ...picked]);
                // If user attaches a file while still in context step, skip straight to targeting
                if (step === "context") {
                  setStep("targeting");
                  setCompletedSteps((s) => new Set(s).add("context"));
                  const pid = projectId ?? localStorage.getItem("celestra_project_id");
                  const ctxJson = localStorage.getItem("celestra_context_json");
                  initSession("targeting", pid, ctxJson);
                }
              }}
            />
          </div>

          {/* Text input + send */}
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                step === "context"
                  ? "Type your answer… (Enter to send, Shift+Enter for new line)"
                  : "Ask a question or give instructions… (Enter to send)"
              }
              disabled={isLoading || transitioning}
              rows={2}
              className="min-h-[52px] flex-1 resize-none py-2.5 text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && files.length === 0) || isLoading || transitioning}
              size="sm"
              className="h-10 w-10 shrink-0 p-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground">
            {step === "context"
              ? "Answer context questions, or attach an HCP file above to skip straight to targeting."
              : "You can attach multiple Excel files before sending. Use 'Add another file' to queue more."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          <span className="whitespace-pre-wrap">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-5 py-4 ring-1 ring-border/50">
          <MarkdownMessage content={message.content} streaming={message.streaming} />
        </div>

        {message.outputFiles && message.outputFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-1">
            {message.outputFiles.map((f) => (
              <a
                key={f.file_id}
                href={`${API_BASE}/api/file/${f.file_id}?filename=${encodeURIComponent(f.filename)}${f.container_id ? `&container_id=${encodeURIComponent(f.container_id)}` : ""}`}
                download={f.filename}
                className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-100"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                {f.filename}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
