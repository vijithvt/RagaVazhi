import { publicJson } from "@/lib/http";
import { compositions } from "@/lib/catalog";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const slug = decodeURIComponent((await params).slug); const works = compositions.filter((c) => c.release?.toLowerCase().replaceAll(" ", "-") === slug); if (!works.length) return publicJson({ error: "Release not found" }, { status: 404 }); return publicJson({ id: `release-${slug}`, slug, title: works[0].release, works }); }
