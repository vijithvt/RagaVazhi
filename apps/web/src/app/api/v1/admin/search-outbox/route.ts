import { createClient } from "@supabase/supabase-js";
import { MeiliSearch } from "meilisearch";
import { requireEditor } from "@/lib/editor-auth";

export async function POST(request: Request) {
  const auth = await requireEditor(request); if (!auth.ok) return Response.json({ error: auth.message }, { status: auth.status });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; const host = process.env.MEILISEARCH_HOST; const searchKey = process.env.MEILISEARCH_API_KEY;
  if (!url || !serviceKey || !host || !searchKey) return Response.json({ error: "Supabase and Meilisearch must be configured" }, { status: 503 });
  const db = createClient(url, serviceKey, { auth: { persistSession: false } }); const meili = new MeiliSearch({ host, apiKey: searchKey });
  const { data: jobs, error } = await db.from("search_outbox").select("*").is("processed_at", null).lte("available_at", new Date().toISOString()).order("id").limit(50);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  let processed = 0;
  for (const job of jobs || []) {
    try {
      const index = meili.index("catalog");
      if (job.operation === "delete") await index.deleteDocument(`${job.entity_type}:${job.entity_id}`);
      else await index.addDocuments([{ ...job.payload, id: `${job.entity_type}:${job.entity_id}`, type: job.entity_type.replace(/s$/, "") }]);
      await db.from("search_outbox").update({ processed_at: new Date().toISOString(), attempts: job.attempts + 1, last_error: null }).eq("id", job.id); processed++;
    } catch (cause) {
      await db.from("search_outbox").update({ attempts: job.attempts + 1, available_at: new Date(Date.now() + 60_000).toISOString(), last_error: cause instanceof Error ? cause.message : "Unknown indexing error" }).eq("id", job.id);
    }
  }
  return Response.json({ processed, remainingBatch: (jobs?.length || 0) - processed });
}
