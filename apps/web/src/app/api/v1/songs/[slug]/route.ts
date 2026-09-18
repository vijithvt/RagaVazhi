import { publicJson } from "@/lib/http";
import { compositionBySlug, ragaBySlug } from "@/lib/catalog";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const song = compositionBySlug(slug); if (!song) return publicJson({ error: "Composition not found" }, { status: 404 }); const safeLyrics = song.lyrics?.publishable ? song.lyrics : song.lyrics ? { publishable: false, sourceUrl: song.lyrics.sourceUrl } : undefined; return publicJson({ ...song, lyrics: safeLyrics, ragaDetails: ragaBySlug(song.raga) }); }
