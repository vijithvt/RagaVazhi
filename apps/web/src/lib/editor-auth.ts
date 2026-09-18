import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, validAdminCookie } from "./admin-session";

export async function requireEditor(request: Request): Promise<{ ok: true; userId: string } | { ok: false; status: number; message: string }> {
  const previewToken = process.env.ADMIN_PREVIEW_TOKEN;
  const providedPreview = request.headers.get("x-admin-token");
  if (previewToken && providedPreview === previewToken) return { ok: true, userId: "preview-admin" };
  const cookieValue = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.split("=")[1];
  if (validAdminCookie(cookieValue)) return { ok: true, userId: "local-admin" };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!url || !anon || !bearer) return { ok: false, status: 401, message: "Editor authentication required" };
  const supabase = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${bearer}` } }, auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(bearer);
  if (error || !data.user) return { ok: false, status: 401, message: "Invalid editor session" };
  const role = data.user.app_metadata?.role;
  if (!["editor", "reviewer", "admin"].includes(role)) return { ok: false, status: 403, message: "Editor role required" };
  return { ok: true, userId: data.user.id };
}
