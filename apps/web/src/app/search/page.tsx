import { SearchBox } from "@/components/search-box";
import { SearchExperience } from "@/components/search-experience";
import { searchCatalog } from "@/lib/search";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const query = params.q || "";
  const result = searchCatalog({ q: query });
  return <><section className="page-hero"><div className="container"><span className="eyebrow">Explore the catalog</span><h1 className="serif">{query ? <>Results for “{query}”</> : "Ragas, songs & lessons"}</h1><SearchBox initial={query} compact /></div></section><SearchExperience items={result.items} initialType={params.type} initialRaga={params.raga} /></>;
}
