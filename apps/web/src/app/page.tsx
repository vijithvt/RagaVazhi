import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, Music, SlidersHorizontal, Sparkles, Video } from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { RagaCard } from "@/components/raga-card";
import { compositions, ragas, tutorials } from "@/lib/catalog";

export default function HomePage() {
  const featured = ragas.filter((raga) => raga.featured).slice(0, 4);
  return <>
    <section className="hero">
      <div className="container hero-inner"><div>
        <div className="eyebrow">Malayalam-first music discovery</div>
        <h1 className="serif">Find the song.<br /><em>Follow the raga.</em></h1>
        <p className="hero-sub">Search in മലയാളം, English or Manglish. Move from a familiar song to its raga, essential compositions, trusted recordings and the next lesson to learn.</p>
        <SearchBox />
        <div className="search-hints"><span>Try:</span><Link href="/search?q=Mayamalavagowla">Mayamalavagowla</Link><Link href="/search?q=മോഹനം">മോഹനം</Link><Link href="/search?q=Tyagaraja">Tyagaraja</Link><Link href="/search?type=tutorial">violin lessons</Link></div>
      </div><div className="hero-art" aria-hidden>
        <div className="vinyl" /><div className="art-card one"><span className="eyebrow">Now exploring</span><strong className="serif" style={{ display: "block", marginTop: 7 }}>Mayamalavagowla</strong><div className="swara-line">S R₁ G₃ M₁ P D₁ N₃</div></div>
        <div className="art-card two"><Headphones size={22} color="#a8452d" /><strong style={{ display: "block", marginTop: 8 }}>Listen for the phrase</strong><div className="swara-line">G₃ M₁ P D₁</div></div>
      </div></div>
      <div className="stats-strip"><div className="container stats"><div className="stat"><strong>{ragas.length}</strong><span>curated raga guides</span></div><div className="stat"><strong>{compositions.length}</strong><span>demo compositions</span></div><div className="stat"><strong>2</strong><span>search scripts + Manglish</span></div><div className="stat"><strong>100%</strong><span>claims carry sources</span></div></div></div>
    </section>

    <section className="section"><div className="container">
      <div className="section-head"><div><span className="eyebrow">Begin your listening</span><h2 className="serif">Ragas worth meeting first</h2></div><Link className="text-link" href="/search?type=raga">View all ragas <ArrowRight size={17} /></Link></div>
      <div className="grid-4">{featured.map((raga) => <RagaCard key={raga.id} raga={raga} />)}</div>
    </div></section>

    <section className="section learning-band"><div className="container">
      <div className="section-head"><div><span className="eyebrow" style={{ color: "#efbd7e" }}>A path, not a pile of links</span><h2 className="serif">Learn to hear what makes a raga itself</h2></div><p>Each listening ladder moves from a clear scale to a composition, a familiar song and a carefully explained contrast.</p></div>
      <div className="grid-4">
        <div className="path-card"><span className="path-num">1</span><h3>Hear the shape</h3><p>Start with arohana, avarohana and an unhurried tonic reference.</p></div>
        <div className="path-card"><span className="path-num">2</span><h3>Notice the signature</h3><p>Listen for phrases and gamakas that a plain scale cannot explain.</p></div>
        <div className="path-card"><span className="path-num">3</span><h3>Meet a composition</h3><p>Anchor the raga in a canonical kriti or varnam with verified credits.</p></div>
        <div className="path-card"><span className="path-num">4</span><h3>Compare and return</h3><p>Contrast a related raga, then listen again with a sharper ear.</p></div>
      </div><div style={{ marginTop: 30 }}><Link href="/learn" className="primary-button" style={{ background: "#d7893b", display: "inline-flex", gap: 8 }}>Start the beginner path <ArrowRight size={18} /></Link></div>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-head"><div><span className="eyebrow">Learn by instrument</span><h2 className="serif">Tutorials in one place</h2></div><Link className="text-link" href="/search?type=tutorial">Browse lessons <ArrowRight size={17} /></Link></div>
      <div className="grid-3">
        {tutorials.map((tutorial) => <a href={tutorial.media.url} key={tutorial.id} className="card tutorial-card"><div className="tutorial-icon"><Video /></div><div><span className="pill saffron">{tutorial.level}</span><h3>{tutorial.title.en}</h3><p>{tutorial.teacher} · {tutorial.instrument}</p></div></a>)}
        <Link href="/compare" className="card tutorial-card"><div className="tutorial-icon" style={{ background: "var(--green)" }}><SlidersHorizontal /></div><div><span className="pill green">Practice tool</span><h3>Compare two ragas</h3><p>See swara patterns side by side</p></div></Link>
      </div>
    </div></section>

    <section className="section" style={{ paddingTop: 0 }}><div className="container"><div className="card" style={{ padding: "38px", display: "flex", alignItems: "center", gap: 25, justifyContent: "space-between", flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}><Sparkles color="#a8452d" /><div><strong className="serif" style={{ fontSize: "1.4rem" }}>A catalog that shows its work</strong><p className="muted small" style={{ margin: "5px 0 0" }}>Sources, confidence and lyric permissions remain visible on every record.</p></div></div><Link href="/about" className="text-link">Read our content policy <ArrowRight size={17} /></Link>
    </div></div></section>
  </>;
}
