export const API_BASE = "https://celestra-final-production.up.railway.app/";

export interface SessionStartResult {
  session_id: string;
  first_message: string;
}

export interface OutputFile {
  file_id: string;
  filename: string;
  container_id?: string | null;
}

export interface StreamDoneResult {
  is_complete: boolean;
  project_id: string | null;
  output_files: OutputFile[];
}

export async function startSession(
  agent: "context" | "targeting" | "sizing" | "alignment",
  project_id?: string | null,
  context_json?: string | null,
): Promise<SessionStartResult> {
  const res = await fetch(`${API_BASE}/api/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent, project_id: project_id ?? null, context_json: context_json ?? null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<SessionStartResult>;
}

export async function analyzeContext(
  formData: Record<string, unknown>,
  onDelta: (delta: string) => void,
): Promise<{ project_id: string | null }> {
  const res = await fetch(`${API_BASE}/api/context/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_data: formData }),
  });

  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      let data: { delta?: string; done?: boolean; project_id?: string | null; error?: string };
      try {
        data = JSON.parse(line.slice(6));
      } catch {
        continue; // skip malformed JSON only
      }
      if (data.error) { console.error("[analyzeContext] error:", data.error); throw new Error(data.error); }
      if (data.delta) { onDelta(data.delta); }
      if (data.done) { return { project_id: data.project_id ?? null }; }
    }
  }
  console.warn("[analyzeContext] stream ended without done event");
  return { project_id: null };
}

export async function streamMessage(
  sessionId: string,
  message: string,
  files: File | File[] | null,
  onDelta: (delta: string) => void,
): Promise<StreamDoneResult> {
  const body = new FormData();
  body.append("session_id", sessionId);
  if (message) body.append("message", message);
  const fileList = files === null ? [] : Array.isArray(files) ? files : [files];
  for (const f of fileList) body.append("file", f);

  const res = await fetch(`${API_BASE}/api/session/message`, {
    method: "POST",
    body,
  });

  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      let data: { delta?: string; done?: boolean; is_complete?: boolean; project_id?: string | null; error?: string; output_files?: OutputFile[] };
      try {
        data = JSON.parse(line.slice(6));
      } catch {
        continue; // skip malformed JSON only
      }
      if (data.error) { console.error("[streamMessage] error:", data.error); throw new Error(data.error); }
      if (data.delta) { onDelta(data.delta); }
      if (data.done) { return { is_complete: data.is_complete ?? false, project_id: data.project_id ?? null, output_files: data.output_files ?? [] }; }
    }
  }

  console.warn("[streamMessage] stream ended without done event");
  return { is_complete: false, project_id: null, output_files: [] };
}
