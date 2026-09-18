import { publicJson } from "@/lib/http";

export async function GET() {
  return publicJson({
    openapi: "3.1.0",
    info: {
      title: "RagaVazhi Public API",
      version: "1.0.0",
      description: "Published bilingual music catalog. Draft records and unlicensed lyrics are never returned."
    },
    servers: [{ url: "/api/v1" }],
    paths: {
      "/search": {
        get: {
          summary: "Search the published catalog",
          parameters: ["q", "type", "raga", "language", "media", "instrument", "level", "yearFrom", "yearTo", "page", "pageSize"].map((name) => ({ name, in: "query", schema: { type: "string" } })),
          responses: { "200": { description: "Search results with facets and pagination" } }
        }
      },
      "/ragas/{slug}": {
        get: { summary: "Get a published raga", responses: { "200": { description: "Raga with compositions and tutorials" }, "404": { description: "Not found" } } }
      },
      "/songs/{slug}": {
        get: { summary: "Get a composition and recordings", responses: { "200": { description: "Composition; lyrics are rights-gated" } } }
      },
      "/discover/beginner": {
        get: { summary: "Get the beginner listening path", responses: { "200": { description: "Ordered learning steps" } } }
      }
    }
  });
}
