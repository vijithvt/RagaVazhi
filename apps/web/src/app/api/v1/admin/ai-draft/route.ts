import OpenAI from "openai";
import { z } from "zod";
import { requireEditor } from "@/lib/editor-auth";

const inputSchema = z.object({ ragaName: z.string().min(2).max(100), approvedSources: z.array(z.object({ label: z.string(), excerpt: z.string().max(5000), url: z.string().url() })).min(1).max(8) });
const outputSchema = { type: "object", additionalProperties: false, required: ["summaryEn", "summaryMl", "listeningGuideEn", "listeningGuideMl", "sourceUrls"], properties: { summaryEn: { type: "string" }, summaryMl: { type: "string" }, listeningGuideEn: { type: "string" }, listeningGuideMl: { type: "string" }, sourceUrls: { type: "array", items: { type: "string" } } } } as const;

export async function POST(request: Request) {
  const auth = await requireEditor(request); if (!auth.ok) return Response.json({ error: auth.message }, { status: auth.status });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: "AI drafting is not configured" }, { status: 503 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid draft request", details: parsed.error.flatten() }, { status: 400 });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sourceBlock = parsed.data.approvedSources.map((source, index) => `[${index + 1}] ${source.label}\nURL: ${source.url}\n${source.excerpt}`).join("\n\n");
  const response = await client.responses.create({
    model: process.env.OPENAI_DRAFT_MODEL || "gpt-5-mini", store: false,
    instructions: "Draft concise bilingual editorial copy using only the supplied approved sources. Do not infer raga assignments, tonic, credits, copyright, or facts absent from the sources. Malayalam must be natural and faithful. Return only the requested schema.",
    input: `Raga: ${parsed.data.ragaName}\n\nApproved sources:\n${sourceBlock}`,
    text: { format: { type: "json_schema", name: "raga_editorial_draft", strict: true, schema: outputSchema } }
  });
  const draft = JSON.parse(response.output_text);
  return Response.json({ state: "draft", promptVersion: "raga-guide-v1", model: response.model, createdBy: auth.userId, sourceIds: parsed.data.approvedSources.map((source) => source.url), draft });
}
