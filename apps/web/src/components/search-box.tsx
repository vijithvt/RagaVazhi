"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initial = "", compact = false }: { initial?: string; compact?: boolean }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = q.trim();
    if (value) {
      const history = JSON.parse(localStorage.getItem("ragavazhi-recent") || "[]") as string[];
      localStorage.setItem("ragavazhi-recent", JSON.stringify([value, ...history.filter((item) => item !== value)].slice(0, 6)));
    }
    router.push(`/search${value ? `?q=${encodeURIComponent(value)}` : ""}`);
  }
  return <form className="search-shell" onSubmit={submit} style={compact ? { marginTop: 0, maxWidth: "100%" } : undefined} role="search">
    <Search size={20} aria-hidden /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search ragas and songs" placeholder="Search രാഗം, song, composer, singer…" />
    <button type="submit">Search</button>
  </form>;
}
