import { rateLimit, publicJson } from "@/lib/http";
import { search } from "@/lib/search-provider";

export async function GET(request: Request) {
  const limited = rateLimit(request); if (limited) return limited;
  const url = new URL(request.url); const get = (key: string) => url.searchParams.get(key) || undefined;
  const page = Math.max(1, Number(get("page") || 1)); const pageSize = Math.min(50, Math.max(1, Number(get("pageSize") || 20)));
  const result = await search({ q: get("q"), type: get("type"), raga: get("raga"), language: get("language"), media: get("media"), instrument: get("instrument"), level: get("level"), yearFrom: Number(get("yearFrom")) || undefined, yearTo: Number(get("yearTo")) || undefined });
  const items = result.items.slice((page - 1) * pageSize, page * pageSize);
  return publicJson({ items, facets: result.facets, pagination: { page, pageSize, total: result.items.length, pages: Math.ceil(result.items.length / pageSize) }, suggestion: null });
}
