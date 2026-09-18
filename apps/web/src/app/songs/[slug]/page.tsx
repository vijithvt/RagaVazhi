import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Music2, ShieldCheck } from "lucide-react";
import { compositionBySlug, compositions, ragaBySlug } from "@/lib/catalog";
import { LiveSongResources } from "@/components/live-song-resources";

export async function generateStaticParams() { return compositions.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const song = compositionBySlug((await params).slug); return { title: song?.title.en || "Composition", description: song?.summary.en }; }

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const song = compositionBySlug((await params).slug); if (!song) notFound(); const raga = ragaBySlug(song.raga);
  const credits = song.credits.reduce<Record<string, string[]>>((acc, credit) => { (acc[credit.role] ||= []).push(credit.person); return acc; }, {});
  return <><section className="detail-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/search?type=composition">Compositions</Link> / {song.title.en}</div><div className="detail-title"><div><span className="pill saffron">{song.kind} · {song.language}</span><h1 className="serif">{song.title.en}</h1><div className="ml-title malayalam">{song.title.ml}</div></div><Link href={`/ragas/${song.raga}`}><span className="small">Raga</span><strong style={{ display: "block", marginTop: 6, fontSize: "1.35rem" }}>{raga?.name.en || song.raga} ↗</strong></Link></div></div></section>
    <div className="container detail-layout"><article>
      <section className="content-section"><span className="eyebrow">Why listen</span><h2>{song.summary.en}</h2><p className="malayalam">{song.summary.ml}</p><div className="phrase-row"><span className="pill green"><ShieldCheck size={13} /> Raga confidence: {song.ragaConfidence}</span>{song.tala && <span className="pill">{song.tala} tala</span>}</div></section>
      <LiveSongResources slug={song.slug} catalogMedia={song.recordings.flatMap((recording) => recording.media)} lyrics={song.lyrics} />
      <section className="content-section"><h2>Sources & provenance</h2><ul className="source-list">{song.citations.map((citation) => <li key={citation.id}><a href={citation.url}>{citation.label}</a> · {citation.license || "source link"} · retrieved {citation.retrievedAt}</li>)}</ul></section>
    </article><aside><div className="card side-card"><h3>Composition credits</h3><div className="fact"><span>Raga</span><Link href={`/ragas/${song.raga}`}><strong>{raga?.name.en}</strong></Link></div><div className="fact"><span>Language</span><strong>{song.language}</strong></div>{Object.entries(credits).map(([role, people]) => <div className="fact" key={role}><span>{role}</span><strong>{people.join(", ")}</strong></div>)}{song.tala && <div className="fact"><span>Tala</span><strong>{song.tala}</strong></div>}</div><div className="card side-card"><h3>Important distinction</h3><p className="small muted">This page describes the composition. Singer, tonic, duration and media belong to each individual recording.</p></div><Link href={`/corrections?entity=${song.slug}`} className="text-link"><Music2 size={16} /> Suggest a correction <ArrowUpRight size={15} /></Link></aside></div></>;
}
