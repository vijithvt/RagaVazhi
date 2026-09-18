import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

export interface MediaApproval {
  id: string; compositionSlug: string; title: string; url: string; domain: string;
  kind: string; embedUrl?: string; status: "approved" | "rejected"; approvedBy: string; approvedAt: string;
}

function localPath() {
  const root = process.env.INIT_CWD || (process.cwd().endsWith(path.join("apps", "web")) ? path.resolve(process.cwd(), "../..") : process.cwd());
  return path.join(root, "data", "media-approvals.json");
}
function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

export async function listApprovals(compositionSlug?: string): Promise<MediaApproval[]> {
  const db = database();
  if (db) {
    let query = db.from("web_media_approvals").select("*").order("approved_at", { ascending: false });
    if (compositionSlug) query = query.eq("composition_slug", compositionSlug);
    const { data, error } = await query; if (error) throw new Error(error.message);
    return (data || []).map((row) => ({ id: row.id, compositionSlug: row.composition_slug, title: row.title, url: row.url, domain: row.domain, kind: row.kind, embedUrl: row.embed_url || undefined, status: row.status, approvedBy: row.approved_by, approvedAt: row.approved_at }));
  }
  try { const content = await fs.readFile(localPath(), "utf8"); const rows = JSON.parse(content) as MediaApproval[]; return compositionSlug ? rows.filter((row) => row.compositionSlug === compositionSlug) : rows; } catch (cause) { if ((cause as NodeJS.ErrnoException).code === "ENOENT") return []; throw cause; }
}

export async function saveApproval(input: Omit<MediaApproval, "id" | "approvedAt">) {
  const row: MediaApproval = { ...input, id: crypto.randomUUID(), approvedAt: new Date().toISOString() };
  const db = database();
  if (db) {
    const { data, error } = await db.from("web_media_approvals").upsert({ composition_slug: row.compositionSlug, title: row.title, url: row.url, domain: row.domain, kind: row.kind, embed_url: row.embedUrl || null, status: row.status, approved_by: row.approvedBy, approved_at: row.approvedAt }, { onConflict: "composition_slug,url" }).select().single();
    if (error) throw new Error(error.message); return { ...row, id: data.id };
  }
  const file = localPath(); await fs.mkdir(path.dirname(file), { recursive: true }); const existing = await listApprovals();
  const next = [row, ...existing.filter((item) => !(item.compositionSlug === row.compositionSlug && item.url === row.url))];
  await fs.writeFile(file, JSON.stringify(next, null, 2), "utf8"); return row;
}
