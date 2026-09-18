import { RagaCompare } from "@/components/raga-compare";
import { ragas } from "@/lib/catalog";

export default function ComparePage() { return <><section className="page-hero"><div className="container"><span className="eyebrow">Practice tool</span><h1 className="serif">Compare two ragas</h1><p className="muted">A scale shows useful structure. The listening signature reminds you why structure alone is not identity.</p></div></section><section className="section"><div className="container"><RagaCompare ragas={ragas} /></div></section></>; }
