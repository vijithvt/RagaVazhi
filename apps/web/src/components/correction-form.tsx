"use client";

import { FormEvent, useState } from "react";

export function CorrectionForm({ entity = "" }: { entity?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/corrections", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    setStatus(response.ok ? "sent" : "error");
  }
  if (status === "sent") return <div className="card" style={{ padding: 35 }}><h2 className="serif">Thank you.</h2><p className="muted">Your report has entered the editorial review queue.</p></div>;
  return <form className="card" style={{ padding: 30, display: "grid", gap: 17 }} onSubmit={submit}><label>Record or page<input name="entity" defaultValue={entity} required style={field} /></label><label>What needs correction?<textarea name="message" minLength={10} required rows={6} style={field} /></label><label>Supporting source URL<input name="sourceUrl" type="url" style={field} /></label><label>Your email (optional)<input name="email" type="email" style={field} /></label><input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} /><button className="primary-button" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send to editors"}</button>{status === "error" && <div className="notice">The report could not be sent. Please try again.</div>}</form>;
}
const field = { display: "block", width: "100%", marginTop: 7, padding: 12, borderRadius: 10, border: "1px solid var(--line)", background: "white" } as const;
