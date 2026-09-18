import Link from "next/link";
import type { Raga } from "@ragavazhi/domain";
import { ArrowUpRight } from "lucide-react";

export function RagaCard({ raga }: { raga: Raga }) {
  return <Link href={`/ragas/${raga.slug}`} className="card raga-card" style={{ "--accent": raga.color } as React.CSSProperties}>
    <div className="raga-color" /><div className="raga-card-body"><span className="pill">{raga.system}</span><h3 className="serif">{raga.name.en}</h3><div className="ml-name malayalam">{raga.name.ml}</div>
    <div className="scale-mini">↑ {raga.arohana}<br />↓ {raga.avarohana}</div><div className="card-arrow"><span>Explore this raga</span><ArrowUpRight size={17} /></div></div>
  </Link>;
}
