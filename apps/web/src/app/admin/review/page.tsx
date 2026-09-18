import Link from "next/link";
import { redirect } from "next/navigation";
import { MediaReview } from "@/components/media-review";
import { hasAdminSession } from "@/lib/admin-session";
import { listApprovals } from "@/lib/approval-store";
import { compositions, ragaBySlug } from "@/lib/catalog";

export default async function ReviewPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  const approvals = await listApprovals(); const songs = compositions.map((song) => ({ slug: song.slug, title: song.title.en, raga: ragaBySlug(song.raga)?.name.en || song.raga }));
  return <div className="admin-shell"><aside className="admin-side"><strong className="serif">Editorial studio</strong><div style={{ marginTop: 28 }}><Link href="/admin">Overview</Link><Link className="active" href="/admin/review">Media review</Link><Link href="/corrections">Corrections</Link></div></aside><section className="admin-main"><span className="eyebrow">Review queue</span><h1 className="serif" style={{ fontSize: "2.7rem", margin: "8px 0" }}>Approve media & lyric sources</h1><p className="muted">Approval moves a discovered URL ahead of unreviewed results. It does not grant permission to copy lyrics.</p><MediaReview songs={songs} initialApprovals={approvals} /></section></div>;
}
