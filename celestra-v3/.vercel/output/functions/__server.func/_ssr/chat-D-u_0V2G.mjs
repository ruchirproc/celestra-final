const API_BASE = "http://https://celestra-full-stack-production.up.railway.app";
async function startSession(agent, project_id, context_json) {
  const res = await fetch(`${API_BASE}/api/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent, project_id: project_id ?? null, context_json: context_json ?? null })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}
async function analyzeContext(formData, onDelta) {
  const res = await fetch(`${API_BASE}/api/context/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_data: formData })
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
      let data;
      try {
        data = JSON.parse(line.slice(6));
      } catch {
        continue;
      }
      if (data.error) {
        console.error("[analyzeContext] error:", data.error);
        throw new Error(data.error);
      }
      if (data.delta) {
        onDelta(data.delta);
      }
      if (data.done) {
        return { project_id: data.project_id ?? null };
      }
    }
  }
  console.warn("[analyzeContext] stream ended without done event");
  return { project_id: null };
}
async function streamMessage(sessionId, message, files, onDelta) {
  const body = new FormData();
  body.append("session_id", sessionId);
  if (message) body.append("message", message);
  const fileList = files === null ? [] : Array.isArray(files) ? files : [files];
  for (const f of fileList) body.append("file", f);
  const res = await fetch(`${API_BASE}/api/session/message`, {
    method: "POST",
    body
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
      let data;
      try {
        data = JSON.parse(line.slice(6));
      } catch {
        continue;
      }
      if (data.error) {
        console.error("[streamMessage] error:", data.error);
        throw new Error(data.error);
      }
      if (data.delta) {
        onDelta(data.delta);
      }
      if (data.done) {
        return { is_complete: data.is_complete ?? false, project_id: data.project_id ?? null, output_files: data.output_files ?? [] };
      }
    }
  }
  console.warn("[streamMessage] stream ended without done event");
  return { is_complete: false, project_id: null, output_files: [] };
}
export {
  API_BASE as A,
  streamMessage as a,
  analyzeContext as b,
  startSession as s
};
