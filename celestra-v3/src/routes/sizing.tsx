import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Upload, FileSpreadsheet, X, CheckCircle2, Sparkles, Loader2, BarChart3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { startSession, streamMessage, type OutputFile } from "@/lib/api/chat";
import { MarkdownMessage } from "@/components/MarkdownMessage";

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

export const Route = createFileRoute("/sizing")({
  head: () => ({
    meta: [
      { title: "Sizing · Celestra" },
      { name: "description", content: "Field force sizing — EDA, scenario analysis, and rep-count recommendation." },
    ],
  }),
  component: SizingPage,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  outputFiles?: OutputFile[];
}

function SizingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [savedContextId, setSavedContextId] = useState<string | null>(null);
  const [contextDrug, setContextDrug] = useState<string>("");
  const [sessionDrugInput, setSessionDrugInput] = useState<string>("");
  const [drugMismatch, setDrugMismatch] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const initSession = useCallback(async (pid: string | null, ctxJson?: string | null) => {
    setIsLoading(true);
    setMessages([]);
    try {
      const { session_id, first_message } = await startSession("sizing", pid, ctxJson);
      setSessionId(session_id);
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: first_message }]);
    } catch (err) {
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Failed to connect to backend: ${(err as Error).message}\n\nMake sure the Flask server is running at http://https://celestra-full-stack-production.up.railway.app`,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const pid = localStorage.getItem("celestra_project_id");
    const ctxJson = localStorage.getItem("celestra_context_json");
    if (pid) setSavedContextId(pid);
    const drug = extractContextDrug(ctxJson ?? null);
    if (drug) {
      setContextDrug(drug);
      setSessionDrugInput(drug);
    }
    initSession(pid, ctxJson);
  }, [initSession]);

  const handleStartFresh = () => {
    setSavedContextId(null);
    setDrugMismatch(false);
    setContextDrug("");
    setSessionDrugInput("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    initSession(null, null);
  };

  const handleDrugCommit = () => {
    const drug = sessionDrugInput.trim();
    const isMismatch = !!contextDrug && !!drug && !drugsMatch(drug, contextDrug);
    if (isMismatch === drugMismatch) return;
    setDrugMismatch(isMismatch);
    if (isMismatch) {
      setSavedContextId(null);
      initSession(null, null);
    } else {
      const pid = localStorage.getItem("celestra_project_id");
      const ctxJson = localStorage.getItem("celestra_context_json");
      setSavedContextId(pid);
      initSession(pid, ctxJson);
    }
  };

  const handleRestoreContextDrug = () => {
    setSessionDrugInput(contextDrug);
    setDrugMismatch(false);
    const pid = localStorage.getItem("celestra_project_id");
    const ctxJson = localStorage.getItem("celestra_context_json");
    setSavedContextId(pid);
    initSession(pid, ctxJson);
  };

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !file) || !sessionId || isLoading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: file ? (text ? `${text}\n\n[Uploaded: ${file.name}]` : `[Uploaded: ${file.name}]`) : text,
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    const uploadedFile = file;
    setFile(null);

    try {
      const result = await streamMessage(sessionId, text, uploadedFile, (delta) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m))
        );
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, outputFiles: result.output_files ?? [] }
            : m
        )
      );
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

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Header */}
      <div className="shrink-0 border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Field Force Sizing</h1>
            <p className="text-xs text-muted-foreground">
              Upload your tiered HCP universe · EDA · 10 rep-count scenarios · Best-Fit recommendation
            </p>
          </div>
        </div>
      </div>

      {/* Drug mismatch warning — shown when session drug doesn't match context drug */}
      {drugMismatch && (
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

      {/* Saved context banner */}
      {savedContextId && !drugMismatch && (
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
            Start fresh (no context)
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Field Force Sizing
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

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

      {/* Input area */}
      <div className="shrink-0 border-t border-border bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-2">

          {/* File upload — always visible */}
          <div>
            {file ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-green-600" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium">{file.name}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 hover:text-foreground"
              >
                <Upload className="h-3.5 w-3.5" />
                Attach HCP universe (.xlsx)
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
            />
          </div>

          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Upload your HCP universe or ask a question… (Enter to send)"
              disabled={isLoading}
              rows={1}
              className="min-h-[40px] flex-1 resize-none py-2.5 text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && !file) || isLoading}
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
            Upload a tiered HCP file to begin EDA and scenario analysis. The consultant delivers a Best-Fit rep-count recommendation with full rationale.
          </p>
        </div>
      </div>
    </div>
  );
}

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
      </div>
    </div>
  );
}
