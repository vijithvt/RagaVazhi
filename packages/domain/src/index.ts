export type Locale = "en" | "ml";
export type Confidence = "verified" | "high" | "medium" | "debated";
export type EditorialState = "draft" | "in_review" | "published" | "archived";
export type EntityType = "raga" | "composition" | "person" | "release" | "tutorial";

export interface LocalizedText { en: string; ml: string }

export interface Citation {
  id: string;
  label: string;
  url: string;
  sourceType: "reference" | "encyclopedia" | "official" | "editorial";
  license?: string;
  retrievedAt: string;
}

export interface ExternalMedia {
  id: string;
  platform: "youtube" | "spotify" | "jiosaavn" | "youtube_music" | "academy";
  kind: "video" | "audio" | "tutorial";
  title: string;
  url: string;
  externalId?: string;
  embeddable: boolean;
  verifiedAt: string;
}

export interface RagaRelation {
  slug: string;
  kind: "similar" | "contrast" | "derived" | "parent";
  reason: LocalizedText;
}

export interface Raga {
  id: string;
  slug: string;
  name: LocalizedText;
  aliases: string[];
  system: "Carnatic" | "Hindustani" | "Both";
  melakarta?: number;
  parent?: string;
  arohana: string;
  avarohana: string;
  signature: LocalizedText;
  overview: LocalizedText;
  phrases: string[];
  importantSwaras: string[];
  mood: LocalizedText;
  relations: RagaRelation[];
  citations: Citation[];
  featured?: boolean;
  color: string;
  state: EditorialState;
}

export interface Credit { person: string; role: "composer" | "lyricist" | "singer" | "instrumentalist" | "teacher" }

export interface Recording {
  id: string;
  title: string;
  tonic?: string;
  tonicConfidence?: Confidence;
  credits: Credit[];
  media: ExternalMedia[];
}

export interface Composition {
  id: string;
  slug: string;
  title: LocalizedText;
  aliases: string[];
  language: string;
  kind: "carnatic" | "film" | "album" | "devotional";
  raga: string;
  ragaConfidence: Confidence;
  tala?: string;
  release?: string;
  year?: number;
  credits: Credit[];
  recordings: Recording[];
  summary: LocalizedText;
  lyrics?: { text: string; script: string; publishable: boolean; rightsBasis?: string; sourceUrl?: string };
  citations: Citation[];
  state: EditorialState;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: LocalizedText;
  raga?: string;
  composition?: string;
  teacher: string;
  instrument: "violin" | "flute" | "veena" | "vocal" | "general";
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  media: ExternalMedia;
  state: EditorialState;
}

export interface SearchItem {
  id: string;
  slug: string;
  type: EntityType;
  title: LocalizedText;
  subtitle: LocalizedText;
  aliases: string[];
  raga?: string;
  language?: string;
  year?: number;
  mediaKinds: string[];
  instrument?: string;
  level?: string;
  href: string;
}
