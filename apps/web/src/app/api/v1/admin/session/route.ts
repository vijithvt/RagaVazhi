import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminCookieValue, validAdminToken } from "@/lib/admin-session";
import { rateLimit } from "@/lib/http";

export async function POST(request: Request) {
  const limited = rateLimit(request, 5, 60_000); if (limited) return limited;
  if (!process.env.ADMIN_PREVIEW_TOKEN) return NextResponse.json({ error: "Set ADMIN_PREVIEW_TOKEN in .env and restart the server" }, { status: 503 });
  const parsed = z.object({ token: z.string().min(1).max(500) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validAdminToken(parsed.data.token)) return NextResponse.json({ error: "Incorrect admin token" }, { status: 401 });
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, adminCookieValue(), { httpOnly: true, sameSite: "strict", secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://"), path: "/", maxAge: 60 * 60 * 8 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false }); response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 }); return response;
}
