"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle } from "lucide-react";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const [token, setToken] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const router = useRouter();
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(""); const response = await fetch("/api/v1/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) }); const body = await response.json(); if (!response.ok) { setError(body.error || "Login failed"); setLoading(false); return; } router.replace("/admin"); router.refresh(); }
  return <form className="card admin-login" onSubmit={submit}><div className="tutorial-icon"><KeyRound /></div><div><span className="eyebrow">Protected editorial access</span><h1 className="serif">Sign in to review</h1><p className="muted">Enter the value of <code>ADMIN_PREVIEW_TOKEN</code> from your local <code>.env</code> file.</p></div>{!configured && <div className="notice">No admin token is configured. Add <code>ADMIN_PREVIEW_TOKEN=your-strong-password</code> to the root <code>.env</code>, then restart the development server.</div>}<label>Admin token<input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="current-password" required disabled={!configured} /></label>{error && <div className="notice">{error}</div>}<button className="primary-button" disabled={!configured || loading}>{loading ? <><LoaderCircle className="spin" size={15} /> Signing in…</> : "Open editorial studio"}</button></form>;
}
