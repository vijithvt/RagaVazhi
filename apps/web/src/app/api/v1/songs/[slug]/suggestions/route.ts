import { compositionBySlug, ragaBySlug } from "@/lib/catalog";
import { createGroqSuggestions, enrichSong } from "@/lib/enrichment";
import { rateLimit } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const limited = rateLimit(request, 8, 60_000); if (limited) return limited;
  const song = compositionBySlug((await params).slug); if (!song) return Response.json({ error: "Composition not found" }, { status: 404 });
  if (!process.env.GROQ_API_KEY) return Response.json({ error: "AI suggestions are not configured" }, { status: 503 });
  try {
    const composer = song.credits.find((credit) => credit.role === "composer")?.person || "";
    const enrichment = process.env.TAVILY_API_KEY ? await enrichSong(song.title.en, composer, song.language) : { media: [], lyricSources: [], references: [] };
    const suggestion = await createGroqSuggestions({ title: song.title.en, raga: ragaBySlug(song.raga)?.name.en || song.raga, summary: song.summary.en, sources: [...enrichment.media, ...enrichment.references].map(({ title, url, kind }) => ({ title, url, kind })) });
    return Response.json({ ...suggestion, generated: true, reviewed: false, provider: "Groq" }, { headers: { "cache-control": "private, max-age=3600" } });
  } catch (cause) {
    return Response.json({ error: cause instanceof Error ? cause.message : "Suggestion generation failed" }, { status: 502 });
  }
}
