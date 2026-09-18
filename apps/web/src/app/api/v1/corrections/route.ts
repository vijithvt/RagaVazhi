import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { rateLimit } from "@/lib/http";

const schema = z.object({ entity: z.string().min(1).max(200), message: z.string().min(10).max(4000), sourceUrl: z.string().url().or(z.literal("")).optional(), email: z.string().email().or(z.literal("")).optional(), website: z.literal("").optional() });
export async function POST(request: Request) {
  const limited = rateLimit(request, 5, 60_000); if (limited) return limited;
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid correction report", details: parsed.error.flatten() }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({ error: "Correction intake requires Supabase configuration" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false } }); const { error } = await supabase.from("correction_reports").insert({ entity_ref: parsed.data.entity, message: parsed.data.message, source_url: parsed.data.sourceUrl || null, reporter_email: parsed.data.email || null });
  if (error) return Response.json({ error: "Could not queue report" }, { status: 500 });
  return Response.json({ accepted: true, persisted: true }, { status: 202 });
}
