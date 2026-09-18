import { compositionBySlug } from "@/lib/catalog";
import { enrichSong } from "@/lib/enrichment";
import { rateLimit } from "@/lib/http";
import { listApprovals } from "@/lib/approval-store";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const limited = rateLimit(request, 20, 60_000); if (limited) return limited;
  const song = compositionBySlug((await params).slug); if (!song) return Response.json({ error: "Composition not found" }, { status: 404 });
  if (!process.env.TAVILY_API_KEY) return Response.json({ error: "Internet enrichment is not configured" }, { status: 503 });
  try {
    const composer = song.credits.find((credit) => credit.role === "composer")?.person || "";
    const result = await enrichSong(song.title.en, composer, song.language);
    const approvals = await listApprovals(song.slug); const decisions = new Map(approvals.map((item) => [item.url, item]));
    const decorate = <T extends { url: string }>(items: T[]) => items.map((item) => ({ ...item, approvalStatus: decisions.get(item.url)?.status })).filter((item) => item.approvalStatus !== "rejected").sort((a, b) => Number(b.approvalStatus === "approved") - Number(a.approvalStatus === "approved"));
    return Response.json({ ...result, media: decorate(result.media), lyricSources: decorate(result.lyricSources) }, { headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=86400" } });
  } catch (cause) {
    return Response.json({ error: cause instanceof Error ? cause.message : "Enrichment failed" }, { status: 502 });
  }
}
