import Link from "next/link";
import { ArrowRight, Ear, Music2, Repeat2, Route, SlidersHorizontal } from "lucide-react";
import { RagaCard } from "@/components/raga-card";
import { ragas } from "@/lib/catalog";

export default function LearnPage() {
  return <><section className="learn-hero"><div className="container"><span className="eyebrow" style={{ color: "#efbd7e" }}>Beginner listening path · തുടക്കക്കാർക്കായി</span><h1 className="serif">You do not need to recognise a raga on day one.</h1><p>Begin by hearing one stable note, one memorable phrase and one composition. Recognition grows through careful return—not through memorising hundreds of scales.</p><Link href="#first-raga" className="primary-button" style={{ display: "inline-flex", marginTop: 20, gap: 8, background: "#d7893b" }}>Start with Mohanam <ArrowRight size={18} /></Link></div></section>
    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">The four-listen method</span><h2 className="serif">A repeatable way to explore</h2></div></div><div className="grid-4">
      <div className="card path-card" style={{ color: "var(--ink)", background: "white" }}><span className="path-num"><Ear size={17} /></span><h3>Find sa</h3><p style={{ color: "var(--muted)" }}>Settle on the tonic. Hear every other note as a relationship to it.</p></div>
      <div className="card path-card" style={{ color: "var(--ink)", background: "white" }}><span className="path-num"><Music2 size={17} /></span><h3>Sing the shape</h3><p style={{ color: "var(--muted)" }}>Use arohana and avarohana slowly, without treating them as the whole raga.</p></div>
      <div className="card path-card" style={{ color: "var(--ink)", background: "white" }}><span className="path-num"><Repeat2 size={17} /></span><h3>Loop a phrase</h3><p style={{ color: "var(--muted)" }}>Return to a short characteristic turn until it feels familiar.</p></div>
      <div className="card path-card" style={{ color: "var(--ink)", background: "white" }}><span className="path-num"><SlidersHorizontal size={17} /></span><h3>Contrast</h3><p style={{ color: "var(--muted)" }}>Hear a related raga and name one concrete difference.</p></div>
    </div></div></section>
    <section className="section" id="first-raga" style={{ background: "#efeade" }}><div className="container"><div className="section-head"><div><span className="eyebrow">First listening set</span><h2 className="serif">Three clear starting points</h2></div></div><div className="grid-3">{["mohanam", "hamsadhwani", "madhyamavati"].map((slug) => <RagaCard key={slug} raga={ragas.find((r) => r.slug === slug)!} />)}</div></div></section>
    <section className="section"><div className="container"><div className="card" style={{ padding: 38, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 22, alignItems: "center" }}><Route size={38} color="#a8452d" /><div><h2 className="serif" style={{ margin: 0 }}>Ready to hear the difference?</h2><p className="muted" style={{ marginBottom: 0 }}>Place two ragas side by side and compare their swara maps and listening signatures.</p></div><Link href="/compare" className="primary-button">Compare ragas</Link></div></div></section>
  </>;
}
