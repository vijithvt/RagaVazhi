"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchItem } from "@ragavazhi/domain";
import { ArrowUpRight, BookOpen, Filter, GraduationCap, Music2, Waves } from "lucide-react";
import { normalizeQuery } from "@/lib/search";

const icon = { raga: Waves, composition: Music2, tutorial: GraduationCap, person: BookOpen, release: BookOpen };

export function SearchExperience({ items, initialType = "", initialRaga = "" }: { items: SearchItem[]; initialType?: string; initialRaga?: string }) {
  const [type, setType] = useState(initialType);
  const [raga, setRaga] = useState(initialRaga);
  const [language, setLanguage] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const visible = useMemo(() => items.filter((item) => (!type || item.type === type) && (!raga || item.raga === raga) && (!language || item.language === language)), [items, type, raga, language]);
  const types = ["raga", "composition", "person", "tutorial"];
  const ragas = [...new Set(items.map((item) => item.raga).filter(Boolean))] as string[];
  const languages = [...new Set(items.map((item) => item.language).filter(Boolean))] as string[];
  const filters = <>
    <div className="filter-head"><h2>Filter results</h2><button onClick={() => { setType(""); setRaga(""); setLanguage(""); }} style={{ border: 0, background: "none", color: "var(--terracotta)", cursor: "pointer" }}>Clear</button></div>
    <div className="filter-group"><h3>Content type</h3>{types.map((value) => <div className="filter-option" key={value}><label><input type="radio" name="type" checked={type === value} onChange={() => setType(type === value ? "" : value)} />{value}</label><span>{items.filter((i) => i.type === value).length}</span></div>)}</div>
    <div className="filter-group"><h3>Raga</h3>{ragas.slice(0, 10).map((value) => <div className="filter-option" key={value}><label><input type="radio" name="raga" checked={raga === value} onChange={() => setRaga(raga === value ? "" : value)} />{value.replaceAll("-", " ")}</label></div>)}</div>
    <div className="filter-group"><h3>Language</h3>{languages.map((value) => <div className="filter-option" key={value}><label><input type="radio" name="language" checked={language === value} onChange={() => setLanguage(language === value ? "" : value)} />{value}</label></div>)}</div>
  </>;
  return <div className="container search-page">
    <aside className="filter-panel" aria-label="Search filters">{filters}</aside>
    <section><div className="results-top"><div><strong>{visible.length} results</strong><div className="muted small">Ranked by title, aliases and credits</div></div><button className="primary-button mobile-filter-button" onClick={() => setMobileFilters(!mobileFilters)}><Filter size={16} /> Filters</button></div>
      {mobileFilters && <div className="card" style={{ padding: 20, marginBottom: 20 }}>{filters}</div>}
      {visible.length ? <div className="result-list">{visible.map((item) => { const Icon = icon[item.type]; return <Link key={item.id} href={item.href} className="card result-card"><span className="result-symbol"><Icon size={23} /></span><div><span className="pill">{item.type}</span><h3>{item.title.en} <span className="malayalam muted" style={{ fontWeight: 400 }}>· {item.title.ml}</span></h3><p>{item.subtitle.en}</p></div><ArrowUpRight color="#a8452d" /></Link>; })}</div> : <div className="card empty"><Music2 size={35} color="#a8452d" /><h2 className="serif">No matching records yet</h2><p className="muted">Try clearing a filter or report the missing song to our editors.</p><Link className="text-link" href="/corrections">Suggest a record</Link></div>}
    </section>
  </div>;
}
