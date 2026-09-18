import { NextResponse } from "next/server";

const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(request: Request, limit = 60, windowMs = 60_000) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "local"; const now = Date.now(); const current = buckets.get(key);
  if (!current || current.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return null; }
  if (current.count >= limit) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": String(Math.ceil((current.reset - now) / 1000)) } });
  current.count += 1; return null;
}

export const publicJson = (data: unknown, init?: ResponseInit) => NextResponse.json(data, { ...init, headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=3600", ...init?.headers } });
