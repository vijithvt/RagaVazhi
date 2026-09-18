import { publicJson } from "@/lib/http";
import { compositions, ragaBySlug, tutorials } from "@/lib/catalog";
export async function GET() { const slugs = ["mohanam", "hamsadhwani", "madhyamavati"]; return publicJson({ title: { en: "First three ragas", ml: "ആദ്യത്തെ മൂന്ന് രാഗങ്ങൾ" }, steps: slugs.map((slug, index) => ({ order: index + 1, raga: ragaBySlug(slug), compositions: compositions.filter((c) => c.raga === slug), tutorials: tutorials.filter((t) => t.raga === slug) })) }); }
