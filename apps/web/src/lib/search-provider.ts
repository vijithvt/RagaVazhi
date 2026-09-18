import { MeiliSearch } from "meilisearch";
import { searchCatalog, type SearchOptions } from "./search";

export async function search(options: SearchOptions) {
  const host = process.env.MEILISEARCH_HOST; const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!host || !apiKey) return searchCatalog(options);
  const client = new MeiliSearch({ host, apiKey });
  const filter = [options.type && `type = "${options.type}"`, options.raga && `raga = "${options.raga}"`, options.language && `language = "${options.language}"`, options.instrument && `instrument = "${options.instrument}"`, options.level && `level = "${options.level}"`].filter(Boolean) as string[];
  const result = await client.index("catalog").search(options.q || "", { filter, facets: ["type", "raga", "language", "instrument", "level"], limit: 50 });
  return { items: result.hits, facets: result.facetDistribution || {} };
}
