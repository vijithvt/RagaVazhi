import { describe, expect, it } from "vitest";
import { normalizeQuery, searchCatalog } from "./search";

describe("bilingual catalog search", () => {
  it("folds Latin diacritics and punctuation", () => expect(normalizeQuery("Māyāmāḷavagauḷa! ")).toBe("mayamalavag aula".replace(" ", "")));
  it("finds a raga by Malayalam title", () => expect(searchCatalog({ q: "മോഹനം" }).items[0]?.slug).toBe("mohanam"));
  it("finds aliases without spaces", () => expect(searchCatalog({ q: "Mayamalavagowla" }).items[0]?.slug).toBe("mayamalavagowla"));
  it("filters tutorials by instrument", () => expect(searchCatalog({ type: "tutorial", instrument: "violin" }).items).toHaveLength(1));
  it("finds a composer as a person", () => expect(searchCatalog({ q: "Tyagaraja", type: "person" }).items[0]?.type).toBe("person"));
  it("does not expose unrelated results", () => expect(searchCatalog({ q: "not-in-the-catalog" }).items).toHaveLength(0));
});
