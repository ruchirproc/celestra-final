import { toast } from 'sonner';
import type { SheetPreview } from './workbook-store';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://celestra-final-production.up.railway.app/';

export type SendPromptResult =
  | { ok: true; blob: Blob; filename: string }
  | { ok: false; error: string };

export async function sendPrompt(opts: {
  skill: string;
  prompt: string;
  artifact?: string;
  sheetData?: SheetPreview[];
  params?: Record<string, unknown>;
}): Promise<SendPromptResult> {
  const toastId = toast.loading(`Running ${opts.skill}…`, {
    description: opts.artifact ? `Generating ${opts.artifact}` : opts.prompt.slice(0, 80),
  });

  try {
    const res = await fetch(`${API_BASE}/api/run-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill: opts.skill,
        sheetData: opts.sheetData ?? [],
        params: opts.params ?? {},
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const disposition = res.headers.get('Content-Disposition') ?? '';
    const filenameMatch = disposition.match(/filename="([^"]+)"/);
    const filename = filenameMatch?.[1] ?? opts.artifact ?? 'download.xlsx';

    toast.success(`${opts.skill} complete`, {
      id: toastId,
      description: `Downloaded ${filename}`,
    });

    return { ok: true, blob, filename };
  } catch (err) {
    const message = (err as Error).message ?? 'Unknown error';
    toast.error('Skill failed', { id: toastId, description: message });
    return { ok: false, error: message };
  }
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
