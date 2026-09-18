import { z } from "zod";
import { requireEditor } from "@/lib/editor-auth";
import { listApprovals, saveApproval } from "@/lib/approval-store";

const approvalSchema = z.object({ compositionSlug: z.string().regex(/^[a-z0-9-]+$/), title: z.string().min(1).max(500), url: z.string().url(), domain: z.string().min(1).max(200), kind: z.string().min(1).max(50), embedUrl: z.string().url().optional(), status: z.enum(["approved", "rejected"]) });
export async function GET(request: Request) { const auth = await requireEditor(request); if (!auth.ok) return Response.json({ error: auth.message }, { status: auth.status }); return Response.json({ items: await listApprovals() }); }
export async function POST(request: Request) { const auth = await requireEditor(request); if (!auth.ok) return Response.json({ error: auth.message }, { status: auth.status }); const parsed = approvalSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid approval", details: parsed.error.flatten() }, { status: 400 }); try { return Response.json({ item: await saveApproval({ ...parsed.data, approvedBy: auth.userId }) }); } catch (cause) { return Response.json({ error: cause instanceof Error ? cause.message : "Could not save approval" }, { status: 500 }); } }
