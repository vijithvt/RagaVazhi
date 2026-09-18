import type { SearchItem } from "@ragavazhi/domain";
import { buildSearchItems } from "./catalog";

const MALAYALAM_CHILLU: Record<string, string> = { "ൺ": "ണ്", "ൻ": "ന്", "ർ": "ര്", "ൽ": "ല്", "ൾ": "ള്", "ൿ": "ക്" };

export function normalizeQuery(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ൺൻർൽൾൿ]/g, (char) => MALAYALAM_CHILLU[char] || char)
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9\u0d00-\u0d7f]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function score(item: SearchItem, rawQuery: string): number {
  const query = normalizeQuery(rawQuery);
  if (!query) return 1;
  const titleValues = [item.title.en, item.title.ml].map(normalizeQuery);
  const aliases = item.aliases.map(normalizeQuery);
  if (titleValues.includes(query) || aliases.includes(query)) return 100;
  if (titleValues.some((value) => value.startsWith(query)) || aliases.some((value) => value.startsWith(query))) return 80;
  if (titleValues.some((value) => value.includes(query))) return 60;
  if (aliases.some((value) => value.includes(query))) return 45;
  const words = query.split(" ");
  const haystack = normalizeQuery([...titleValues, ...aliases, item.subtitle.en, item.subtitle.ml, item.raga || "", item.language || ""].join(" "));
  return words.every((word) => haystack.includes(word)) ? 25 : 0;
}

export interface SearchOptions {
  q?: string; type?: string; raga?: string; language?: string; media?: string; instrument?: string; level?: string;
  yearFrom?: number; yearTo?: number;
}

export function searchCatalog(options: SearchOptions) {
  const items = buildSearchItems()
    .map((item) => ({ item, score: score(item, options.q || "") }))
    .filter(({ item, score }) => score > 0
      && (!options.type || item.type === options.type)
      && (!options.raga || item.raga === options.raga)
      && (!options.language || item.language === options.language)
      && (!options.media || item.mediaKinds.includes(options.media))
      && (!options.instrument || item.instrument === options.instrument)
      && (!options.level || item.level === options.level)
      && (!options.yearFrom || (item.year || 0) >= options.yearFrom)
      && (!options.yearTo || (item.year || 9999) <= options.yearTo))
    .sort((a, b) => b.score - a.score || a.item.title.en.localeCompare(b.item.title.en))
    .map(({ item }) => item);

  const all = buildSearchItems();
  const count = (key: keyof SearchItem) => Object.entries(all.reduce<Record<string, number>>((acc, item) => {
    const value = item[key];
    if (typeof value === "string" && value) acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {})).map(([value, total]) => ({ value, total }));

  return { items, facets: { type: count("type"), raga: count("raga"), language: count("language"), instrument: count("instrument"), level: count("level") } };
}
