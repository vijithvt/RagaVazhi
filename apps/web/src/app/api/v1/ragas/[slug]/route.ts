import { publicJson } from "@/lib/http";
import { compositions, ragaBySlug, tutorials } from "@/lib/catalog";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const raga = ragaBySlug(slug); if (!raga) return publicJson({ error: "Raga not found" }, { status: 404 }); return publicJson({ ...raga, compositions: compositions.filter((c) => c.raga === slug), tutorials: tutorials.filter((t) => t.raga === slug) }); }
