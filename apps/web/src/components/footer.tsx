import Link from "next/link";

export function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-grid">
      <div><h3 className="serif">RagaVazhi <span className="malayalam">· രാഗവഴി</span></h3><p className="small">A careful path into ragas, compositions and listening—built for curious students.</p></div>
      <div><h3>Explore</h3><Link href="/search">Search catalog</Link><Link href="/learn">Beginner path</Link><Link href="/compare">Compare ragas</Link></div>
      <div><h3>About</h3><Link href="/about">Content policy</Link><Link href="/corrections">Report a correction</Link><Link href="/admin">Editor access</Link></div>
    </div>
    <div className="footer-bottom"><span>© 2026 RagaVazhi. Catalog facts remain linked to their sources.</span><span>Music is embedded or linked—not rehosted.</span></div>
  </div></footer>;
}
