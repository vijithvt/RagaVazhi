"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, PlayCircle, Sparkles } from "lucide-react";
import type { ExternalMedia } from "@ragavazhi/domain";

interface Candidate { title: string; url: string; description: string; domain: string; kind: string; embedUrl?: string; score: number; approvalStatus?: "approved" | "rejected" }
interface Enrichment { media: Candidate[]; lyricSources: Candidate[]; references: Candidate[]; generatedAt: string; provider: string }
interface Suggestions { overview: string; listeningCues: string[]; nextSteps: { title: string; reason: string }[]; caution: string; reviewed: boolean }

export function LiveSongResources({ slug, catalogMedia, lyrics }: { slug: string; catalogMedia: ExternalMedia[]; lyrics?: { text: string; script: string; publishable: boolean; sourceUrl?: string } }) {
  const [data, setData] = useState<Enrichment | null>(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null); const [suggesting, setSuggesting] = useState(false); const [suggestionError, setSuggestionError] = useState("");
  useEffect(() => { let active = true; fetch(`/api/v1/songs/${slug}/enrichment`).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Could not find online resources"); if (active) setData(body); }).catch((cause) => active && setError(cause.message)).finally(() => active && setLoading(false)); return () => { active = false; }; }, [slug]);
  async function generateSuggestions() { setSuggesting(true); setSuggestionError(""); try { const response = await fetch(`/api/v1/songs/${slug}/suggestions`, { method: "POST" }); const body = await response.json(); if (!response.ok) throw new Error(body.error || "Suggestions failed"); setSuggestions(body); } catch (cause) { setSuggestionError(cause instanceof Error ? cause.message : "Suggestions failed"); } finally { setSuggesting(false); } }
  const liveMedia = data?.media || [];
  return <>
    <section className="content-section"><div className="resource-heading"><div><span className="eyebrow">Live web discovery</span><h2>Recordings & media</h2></div>{loading && <span className="pill"><LoaderCircle className="spin" size={14} /> Finding real links</span>}</div>
      {liveMedia.filter((item) => item.embedUrl).slice(0, 3).map((item) => <div className="embed-card" key={item.url}><div className="embed-frame"><iframe src={item.embedUrl} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="embed-meta"><span className={`pill ${item.approvalStatus === "approved" ? "green" : ""}`}>{item.approvalStatus === "approved" ? "✓ approved" : item.kind}</span><strong>{item.title}</strong><a href={item.url} target="_blank" rel="noreferrer">Open on {item.domain} <ExternalLink size={13} /></a></div></div>)}
      {liveMedia.filter((item) => !item.embedUrl).slice(0, 5).map((item) => <a className="media-link" href={item.url} target="_blank" rel="noreferrer" key={item.url}><span><strong>{item.title}</strong><span className="muted small" style={{ display: "block" }}>{item.domain} · discovered via {data?.provider}</span></span><ExternalLink color="#a8452d" /></a>)}
      {!loading && !liveMedia.length && catalogMedia.map((media) => <a className="media-link" href={media.url} target="_blank" rel="noreferrer" key={media.id}><span><strong>{media.title}</strong><span className="muted small" style={{ display: "block" }}>{media.platform} · catalog fallback</span></span><ExternalLink color="#a8452d" /></a>)}
      {error && <div className="notice">Live discovery is unavailable: {error}. The catalog fallback remains available below.</div>}
      {data && <p className="muted small">Internet results are discovered automatically and may not be the canonical performance. Editors should approve links before adding them permanently.</p>}
    </section>
    <section className="content-section"><h2>Lyrics</h2>
      {lyrics?.publishable ? <div className="malayalam lyrics-text">{lyrics.text}</div> : <><div className="notice"><strong>Full lyrics need a licensed source.</strong><br />Search can locate lyric pages, but copyright does not permit copying every result into RagaVazhi.</div>{data?.lyricSources.map((source) => <a className="media-link" href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.title}</strong><span className="muted small" style={{ display: "block" }}>Read at {source.domain}</span></span><ExternalLink color="#a8452d" /></a>)}{lyrics?.sourceUrl && !data?.lyricSources.length && <a className="media-link" href={lyrics.sourceUrl} target="_blank" rel="noreferrer"><span><strong>Open catalog lyric source</strong></span><ExternalLink color="#a8452d" /></a>}</>}
    </section>
    <section className="content-section"><div className="resource-heading"><div><span className="eyebrow">AI study aid</span><h2>What should I listen for?</h2></div>{!suggestions && <button className="primary-button" onClick={generateSuggestions} disabled={suggesting}>{suggesting ? <><LoaderCircle className="spin" size={15} /> Thinking…</> : <><Sparkles size={15} /> Generate suggestions</>}</button>}</div>
      {suggestionError && <div className="notice">{suggestionError}</div>}
      {suggestions && <div className="ai-suggestion"><p>{suggestions.overview}</p><h3>Listening cues</h3><ul>{suggestions.listeningCues.map((cue) => <li key={cue}>{cue}</li>)}</ul><h3>Continue with</h3>{suggestions.nextSteps.map((step) => <div className="relation-card" key={step.title}><strong>{step.title}</strong><p>{step.reason}</p></div>)}<p className="muted small"><Sparkles size={12} /> AI-generated and not yet teacher-reviewed. {suggestions.caution}</p></div>}
    </section>
  </>;
}
