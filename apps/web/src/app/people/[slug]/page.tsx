import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, GraduationCap, Music2 } from "lucide-react";
import { compositions, people, personBySlug, tutorials } from "@/lib/catalog";

export async function generateStaticParams() { return people.map(({ slug }) => ({ slug })); }

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const person = personBySlug((await params).slug); if (!person) notFound();
  const works = compositions.filter((composition) => composition.credits.some((credit) => credit.person === person.name));
  const lessons = tutorials.filter((tutorial) => tutorial.teacher === person.name);
  const roles = [...new Set(works.flatMap((work) => work.credits.filter((credit) => credit.person === person.name).map((credit) => credit.role)))];
  return <><section className="detail-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/search?type=person">People</Link> / {person.name}</div><div className="detail-title"><div><span className="pill saffron">{roles.join(" · ") || "teacher"}</span><h1 className="serif">{person.name}</h1></div><div><span className="small">Catalog appearances</span><strong style={{ display: "block", marginTop: 6 }}>{works.length + lessons.length}</strong></div></div></div></section><div className="container detail-layout"><article><section className="content-section"><span className="eyebrow">Credited works</span><h2>Compositions in the catalog</h2>{works.map((work) => <Link href={`/songs/${work.slug}`} className="composition-row" key={work.id}><div><h3>{work.title.en}</h3><p>{work.language} · {work.tala} tala</p></div><ArrowUpRight size={18} color="#a8452d" /></Link>)}{!works.length && <p>No composition credits in the demonstration catalog.</p>}</section><section className="content-section"><h2>Lessons</h2>{lessons.map((lesson) => <a className="media-link" href={lesson.media.url} key={lesson.id}><span><strong>{lesson.title.en}</strong><span className="muted small" style={{ display: "block" }}>{lesson.instrument} · {lesson.level}</span></span><GraduationCap color="#a8452d" /></a>)}{!lessons.length && <p>No reviewed lessons are linked yet.</p>}</section></article><aside><div className="card side-card"><h3>Catalog profile</h3><div className="fact"><span>Roles</span><strong>{roles.join(", ") || "teacher"}</strong></div><div className="fact"><span>Works</span><strong>{works.length}</strong></div><div className="fact"><span>Lessons</span><strong>{lessons.length}</strong></div></div><Link href={`/corrections?entity=${person.slug}`} className="text-link"><Music2 size={16} /> Report a correction</Link></aside></div></>;
}
