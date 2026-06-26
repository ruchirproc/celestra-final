import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-CtByUnye.mjs";
import { T as Textarea, M as MarkdownMessage } from "./MarkdownMessage-DASimymS.mjs";
import { s as startSession, a as streamMessage } from "./chat-D-u_0V2G.mjs";
import "../_libs/sonner.mjs";
import { a as ChartColumn, c as TriangleAlert, d as CircleCheck, S as Sparkles, L as LoaderCircle, F as FileSpreadsheet, X, U as Upload, e as Send } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./router-BF2ZJpgr.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/react-markdown.mjs";
import "../_libs/devlop.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
import "../_libs/remark-gfm.mjs";
import "../_libs/micromark-extension-gfm.mjs";
import "../_libs/micromark-extension-gfm-autolink-literal+[...].mjs";
import "../_libs/micromark-extension-gfm-footnote+[...].mjs";
import "../_libs/micromark-extension-gfm-strikethrough+[...].mjs";
import "../_libs/micromark-extension-gfm-table.mjs";
import "../_libs/micromark-extension-gfm-task-list-item+[...].mjs";
import "../_libs/mdast-util-gfm.mjs";
import "../_libs/mdast-util-gfm-autolink-literal+[...].mjs";
import "../_libs/ccount.mjs";
import "../_libs/mdast-util-find-and-replace.mjs";
import "../_libs/escape-string-regexp.mjs";
import "../_libs/mdast-util-gfm-footnote.mjs";
import "../_libs/mdast-util-gfm-strikethrough.mjs";
import "../_libs/mdast-util-gfm-table.mjs";
import "../_libs/markdown-table.mjs";
import "../_libs/mdast-util-to-markdown.mjs";
import "../_libs/longest-streak.mjs";
import "../_libs/mdast-util-phrasing.mjs";
import "../_libs/mdast-util-gfm-task-list-item.mjs";
function extractContextDrug(ctxJson) {
  if (!ctxJson) return "";
  try {
    const parsed = JSON.parse(ctxJson);
    const drug = parsed?.project_context?.drug_and_indication;
    return drug?.brand_name || drug?.generic_name || "";
  } catch {
    return "";
  }
}
function drugsMatch(a, b) {
  if (!a || !b) return true;
  const norm = (s) => s.toLowerCase().trim();
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a));
}
function SizingPage() {
  const [messages, setMessages] = reactExports.useState([]);
  const [sessionId, setSessionId] = reactExports.useState(null);
  const [input, setInput] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [file, setFile] = reactExports.useState(null);
  const [savedContextId, setSavedContextId] = reactExports.useState(null);
  const [contextDrug, setContextDrug] = reactExports.useState("");
  const [sessionDrugInput, setSessionDrugInput] = reactExports.useState("");
  const [drugMismatch, setDrugMismatch] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);
  const initSession = reactExports.useCallback(async (pid, ctxJson) => {
    setIsLoading(true);
    setMessages([]);
    try {
      const {
        session_id,
        first_message
      } = await startSession("sizing", pid, ctxJson);
      setSessionId(session_id);
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: first_message
      }]);
    } catch (err) {
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Failed to connect to backend: ${err.message}

Make sure the Flask server is running at http://https://celestra-full-stack-production.up.railway.app`
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
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
    if (!text && !file || !sessionId || isLoading) return;
    setInput("");
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: file ? text ? `${text}

[Uploaded: ${file.name}]` : `[Uploaded: ${file.name}]` : text
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg = {
      id: assistantId,
      role: "assistant",
      content: "",
      streaming: true
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);
    const uploadedFile = file;
    setFile(null);
    try {
      const result = await streamMessage(sessionId, text, uploadedFile, (delta) => {
        setMessages((prev) => prev.map((m) => m.id === assistantId ? {
          ...m,
          content: m.content + delta
        } : m));
      });
      setMessages((prev) => prev.map((m) => m.id === assistantId ? {
        ...m,
        streaming: false,
        outputFiles: result.output_files ?? []
      } : m));
    } catch (err) {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? {
        ...m,
        content: `Error: ${err.message}`,
        streaming: false
      } : m));
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-b border-border bg-white px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-semibold text-foreground", children: "Field Force Sizing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Upload your tiered HCP universe · EDA · 10 rep-count scenarios · Best-Fit recommendation" })
      ] })
    ] }) }),
    drugMismatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-6 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Project context is ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "not being used" }),
          " — context drug",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            '"',
            contextDrug,
            '"'
          ] }),
          " doesn't match",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "inline-block w-28 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-400", value: sessionDrugInput, onChange: (e) => setSessionDrugInput(e.target.value), onBlur: handleDrugCommit, onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }, "aria-label": "Session drug name" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRestoreContextDrug, className: "shrink-0 text-[10px] text-amber-600 underline underline-offset-2 hover:text-amber-800", children: "Restore context drug" })
    ] }),
    savedContextId && !drugMismatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-6 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-blue-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0 text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Using project context" }),
        contextDrug && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600", children: "Asset:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-28 rounded border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-400", value: sessionDrugInput, onChange: (e) => setSessionDrugInput(e.target.value), onBlur: handleDrugCommit, onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }, "aria-label": "Session drug name" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleStartFresh, className: "shrink-0 text-[10px] text-blue-600 underline underline-offset-2 hover:text-blue-800", children: "Start fresh (no context)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto px-4 py-5 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-5xl flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Field Force Sizing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { message: msg }, msg.id)),
      isLoading && !messages.some((m) => m.streaming) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Thinking…" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-t border-border bg-white px-4 py-3 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        file ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 shrink-0 text-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-xs font-medium", children: file.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-[10px] text-muted-foreground", children: [
            (file.size / 1024).toFixed(0),
            " KB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }, className: "shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileInputRef.current?.click(), className: "flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
          "Attach HCP universe (.xlsx)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: ".xlsx,.xls", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) setFile(f);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Upload your HCP universe or ask a question… (Enter to send)", disabled: isLoading, rows: 1, className: "min-h-[40px] flex-1 resize-none py-2.5 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSend, disabled: !input.trim() && !file || isLoading, size: "sm", className: "h-10 w-10 shrink-0 p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Upload a tiered HCP file to begin EDA and scenario analysis. The consultant delivers a Best-Fit rep-count recommendation with full rationale." })
    ] }) })
  ] });
}
function MessageBubble({
  message
}) {
  const isUser = message.role === "user";
  if (isUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: message.content }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-w-0 flex-1 flex-col gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-tl-sm bg-muted/60 px-5 py-4 ring-1 ring-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkdownMessage, { content: message.content, streaming: message.streaming }) }) })
  ] });
}
export {
  SizingPage as component
};
