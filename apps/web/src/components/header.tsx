import Link from "next/link";
import { Menu, Music2 } from "lucide-react";
import { LocaleToggle } from "./locale-toggle";

export function Header() {
  return <header className="site-header">
    <div className="container nav">
      <Link href="/" className="brand" aria-label="RagaVazhi home">
        <span className="brand-mark"><Music2 size={21} /></span>
        <span><span className="brand-name">RagaVazhi</span><span className="brand-ml malayalam">രാഗവഴി</span></span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/search">Discover</Link><Link href="/learn">Learn</Link><Link href="/compare">Compare ragas</Link><Link href="/search?type=tutorial">Tutorials</Link><Link href="/admin">Editorial</Link>
      </nav>
      <LocaleToggle />
      <button className="mobile-nav" aria-label="Open menu"><Menu /></button>
    </div>
  </header>;
}
