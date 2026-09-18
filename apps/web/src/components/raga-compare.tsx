"use client";

import { useState } from "react";
import type { Raga } from "@ragavazhi/domain";

export function RagaCompare({ ragas }: { ragas: Raga[] }) {
  const [left, setLeft] = useState("mohanam"); const [right, setRight] = useState("hindolam");
  const selected = [ragas.find((r) => r.slug === left)!, ragas.find((r) => r.slug === right)!];
  const options = ragas.map((raga) => <option value={raga.slug} key={raga.slug}>{raga.name.en} · {raga.name.ml}</option>);
  return <><div className="compare-grid" style={{ marginBottom: 18 }}><select className="card" value={left} onChange={(e) => setLeft(e.target.value)} style={{ padding: 15 }}>{options}</select><select className="card" value={right} onChange={(e) => setRight(e.target.value)} style={{ padding: 15 }}>{options}</select></div><div className="compare-grid">{selected.map((raga) => <article className="card compare-card" key={raga.slug} style={{ borderTop: `7px solid ${raga.color}` }}><span className="pill">{raga.system}</span><h2 className="serif">{raga.name.en}</h2><div className="malayalam muted">{raga.name.ml}</div><code>↑ {raga.arohana}</code><code>↓ {raga.avarohana}</code><h3>Listen for</h3><p className="muted">{raga.signature.en}</p><h3>Important swaras</h3><div className="phrase-row">{raga.importantSwaras.map((swara) => <span className="phrase" key={swara}>{swara}</span>)}</div></article>)}</div></>;
}
