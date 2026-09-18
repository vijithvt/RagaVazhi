import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ragavazhi_admin";

function secret() { return process.env.ADMIN_PREVIEW_TOKEN || ""; }
export function adminCookieValue() { const value = secret(); return value ? createHmac("sha256", value).update("ragavazhi-editor-session-v1").digest("hex") : ""; }
export function validAdminToken(candidate: string) {
  const expected = secret();
  if (!expected || candidate.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}
export function validAdminCookie(candidate?: string) {
  const expected = adminCookieValue();
  if (!expected || !candidate || candidate.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}
export async function hasAdminSession() { return validAdminCookie((await cookies()).get(ADMIN_COOKIE)?.value); }
