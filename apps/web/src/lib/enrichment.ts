import { unstable_cache } from "next/cache";
import { z } from "zod";

export interface WebCandidate {
  title: string;
  url: string;
  description: string;
  domain: string;
  kind: "youtube" | "spotify" | "jiosaavn" | "youtube_music" | "lyrics" | "reference";
  videoId?: string;
  embedUrl?: string;
  score: number;
}

interface TavilyResult { title?: string; url?: string; content?: string; score?: number }

const domains = [
  "youtube.com", "youtu.be", "open.spotify.com", "music.youtube.com", "jiosaavn.com",
  "musixmatch.com", "genius.com", "sahityam.net", "karnatik.com", "wikipedia.org"
];

function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0];
    if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || undefined;
      const match = parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/);
      return match?.[1];
    }
  } catch { return undefined; }
}

function classify(url: string): WebCandidate["kind"] {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "youtu.be" || host.endsWith("youtube.com")) return host === "music.youtube.com" ? "youtube_music" : "youtube";
  if (host.endsWith("spotify.com")) return "spotify";
  if (host.endsWith("jiosaavn.com")) return "jiosaavn";
  if (["musixmatch.com", "genius.com", "sahityam.net", "karnatik.com"].some((domain) => host.endsWith(domain))) return "lyrics";
  return "reference";
}

async function searchTavily(query: string, maxResults = 10): Promise<TavilyResult[]> {
  if (!process.env.TAVILY_API_KEY) return [];
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, search_depth: "advanced", topic: "general", max_results: maxResults, include_domains: domains, include_answer: false, include_raw_content: false }),
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) throw new Error(`Tavily search failed (${response.status})`);
  const data = await response.json() as { results?: TavilyResult[] };
  return data.results || [];
}

async function searchYouTube(query: string): Promise<WebCandidate[]> {
  if (!process.env.YOUTUBE_API_KEY) return [];
  const params = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY, part: "snippet", type: "video", q: query,
    maxResults: "5", videoEmbeddable: "true", videoSyndicated: "true", safeSearch: "moderate", regionCode: "IN", relevanceLanguage: "en"
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { signal: AbortSignal.timeout(12_000), next: { revalidate: 86_400 } });
  if (!response.ok) throw new Error(`YouTube search failed (${response.status})`);
  const body = await response.json() as { items?: { id?: { videoId?: string }; snippet?: { title?: string; description?: string } }[] };
  return (body.items || []).flatMap((item, index) => {
    const id = item.id?.videoId; if (!id) return [];
    return [{ title: item.snippet?.title || query, url: `https://www.youtube.com/watch?v=${id}`, description: item.snippet?.description || "", domain: "youtube.com", kind: "youtube" as const, videoId: id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, score: 1 - index * 0.05 }];
  });
}

async function enrichUncached(title: string, composer: string, language: string) {
  const searchName = [title, composer, language].filter(Boolean).join(" ");
  const [youtubeResults, mediaResults, lyricResults] = await Promise.all([
    searchYouTube(`${searchName} Carnatic music`),
    searchTavily(`${searchName} official song performance YouTube Spotify`, 12),
    searchTavily(`${searchName} lyrics sahityam`, 6)
  ]);
  const seen = new Set<string>();
  const candidates = [...mediaResults, ...lyricResults].flatMap<WebCandidate>((result) => {
    if (!result.url || !result.title || seen.has(result.url)) return [];
    try {
      const parsed = new URL(result.url); const kind = classify(result.url); const id = kind === "youtube" ? youtubeId(result.url) : undefined;
      seen.add(result.url);
      return [{ title: result.title, url: result.url, description: (result.content || "").slice(0, 280), domain: parsed.hostname.replace(/^www\./, ""), kind, videoId: id, embedUrl: id ? `https://www.youtube-nocookie.com/embed/${id}` : kind === "spotify" ? result.url.replace("open.spotify.com/", "open.spotify.com/embed/") : undefined, score: result.score || 0 }];
    } catch { return []; }
  });
  const tavilyMedia = candidates.filter((item) => ["youtube", "spotify", "jiosaavn", "youtube_music"].includes(item.kind));
  const mergedMedia = [...youtubeResults, ...tavilyMedia.filter((candidate) => !youtubeResults.some((youtube) => youtube.url === candidate.url))];
  return {
    media: mergedMedia.sort((a, b) => Number(b.kind === "youtube") - Number(a.kind === "youtube") || Number(Boolean(b.embedUrl)) - Number(Boolean(a.embedUrl)) || b.score - a.score).slice(0, 8),
    lyricSources: candidates.filter((item) => item.kind === "lyrics").sort((a, b) => b.score - a.score).slice(0, 5),
    references: candidates.filter((item) => item.kind === "reference").sort((a, b) => b.score - a.score).slice(0, 4),
    generatedAt: new Date().toISOString(), provider: youtubeResults.length ? "YouTube Data API + Tavily" : "Tavily"
  };
}

export const enrichSong = unstable_cache(enrichUncached, ["song-web-enrichment-v1"], { revalidate: 86_400, tags: ["song-enrichment"] });

export async function discoverNotationSources(title: string, composer: string, language: string, limit = 6): Promise<WebCandidate[]> {
  const { media } = await enrichSong(title, composer, language);
  const seen = new Set<string>();
  return media.filter((candidate) => {
    if (candidate.kind !== "youtube" || !candidate.videoId || seen.has(candidate.videoId)) return false;
    seen.add(candidate.videoId);
    return true;
  }).slice(0, limit);
}

const suggestionSchema = z.object({
  overview: z.string(),
  listeningCues: z.array(z.string()).max(4),
  nextSteps: z.array(z.object({ title: z.string(), reason: z.string() })).max(4),
  caution: z.string()
});

export async function createGroqSuggestions(input: { title: string; raga: string; summary: string; sources: Pick<WebCandidate, "title" | "url" | "kind">[] }) {
  if (!process.env.GROQ_API_KEY) throw new Error("Groq is not configured");
  const schema = { type: "object", additionalProperties: false, required: ["overview", "listeningCues", "nextSteps", "caution"], properties: { overview: { type: "string" }, listeningCues: { type: "array", maxItems: 4, items: { type: "string" } }, nextSteps: { type: "array", maxItems: 4, items: { type: "object", additionalProperties: false, required: ["title", "reason"], properties: { title: { type: "string" }, reason: { type: "string" } } } }, caution: { type: "string" } } };
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { authorization: `Bearer ${process.env.GROQ_API_KEY}`, "content-type": "application/json" }, signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({ model: process.env.GROQ_MODEL || "openai/gpt-oss-20b", temperature: 0.2, messages: [
      { role: "system", content: "You are a careful Carnatic music study-guide editor. Use only the supplied catalog context and source titles. Give listening suggestions, not new factual claims. Never invent a raga, credit, tonic, lyric, or media URL. State that suggestions require teacher/editor review." },
      { role: "user", content: JSON.stringify(input) }
    ], response_format: { type: "json_schema", json_schema: { name: "listening_suggestions", strict: false, schema } } })
  });
  if (!response.ok) throw new Error(`Groq request failed (${response.status})`);
  const body = await response.json() as { choices?: { message?: { content?: string } }[] };
  const parsed = suggestionSchema.safeParse(JSON.parse(body.choices?.[0]?.message?.content || "{}"));
  if (!parsed.success) throw new Error("Groq returned an invalid suggestion format");
  return parsed.data;
}
